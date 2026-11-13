#!/usr/bin/env node
/**
 * Dirigentens vakt (Daniel P 2026-11-10): styr tidigt till dirigentens väg. En fil för fyra händelser, reglerna ur
 * rules.json (genereras ur koden, src/v2/skill/hook-rules.ts). Samma regler bär servern, så claude.ai (utan hooks) får
 * samma svar: instruktionerna, ways vid okänd op, stale_tools och batch_hint.
 *
 *   UserPromptSubmit  en rad om dirigenten när prompten rör kund, uppdrag, fil, mejl eller planering
 *   PreToolUse        stoppar andra kopplingars skrivningar och curl mot dirigenten när dirigenten har vägen
 *   PostToolUse       gamla verktyg, ett nej med vägen (rev_conflict), batch, en fil som bara finns lokalt
 *   Stop              en obesvarad förhandsvisning, en lokal fil, berörda moment, docs/kvar.md
 *
 * Svarar aldrig med fel: något oväntat ger tyst ja. Läser bara transkriptet och git status; skriver bara sin
 * egen lilla tillståndsfil i tmp (räkningen av anrop i rad).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const RULES = JSON.parse(readFileSync(join(HERE, "rules.json"), "utf8"));
const re = (s, f = "i") => new RegExp(s, f);
const isDirigent = (name) => re(RULES.dirigent_tool).test(name ?? "");
const text = (v) => (typeof v === "string" ? v : JSON.stringify(v ?? ""));

/** The transcript's lines as objects, the last `n`. */
function transcript(path, n = 400) {
  try { return readFileSync(path, "utf8").trim().split("\n").slice(-n).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); }
  catch { return []; }
}
const blocks = (o) => (Array.isArray(o?.message?.content) ? o.message.content : []);
function lastUserText(lines) {
  for (let i = lines.length - 1; i >= 0; i--) {
    const o = lines[i];
    if (o.type !== "user") continue;
    const c = o.message?.content;
    if (typeof c === "string") return c;
    const t = blocks(o).filter((b) => b.type === "text").map((b) => b.text).join(" ");
    if (t) return t;
  }
  return "";
}
/** Lines since the user's last prompt (this turn). */
function turn(lines) {
  let i = lines.length - 1;
  for (; i >= 0; i--) { const o = lines[i]; if (o.type === "user" && (typeof o.message?.content === "string" || blocks(o).some((b) => b.type === "text"))) break; }
  return lines.slice(i + 1);
}

export function onPrompt(input) {
  const p = String(input.prompt ?? "");
  const lines = [];
  if (re(RULES.prompt.words).test(p)) lines.push(RULES.prompt.line);
  // A pause while planning goes on in the conversation: the summary is written at once.
  if (RULES.planning && re(RULES.planning.pause_words).test(p) && transcript(input.transcript_path).some((o) => blocks(o).some((b) => b.type === "tool_use" && re(RULES.planning.writes).test(text(b.input)))))
    lines.push(RULES.pause_line);
  return lines.length ? { hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: lines.join(" ") } } : null;
}

export function onPre(input) {
  const name = String(input.tool_name ?? ""), args = text(input.tool_input);
  for (const r of RULES.pre) {
    if (!re(r.tool).test(name)) continue;
    if (r.input && !re(r.input).test(args)) continue;
    // Developing dirigenten itself (the repo) may curl its previews.
    if (r.id === "curl_upload" && /rotor-dirigenten|wt-/.test(String(input.cwd ?? "")) && !/upload/.test(args)) continue;
    // A file sent by code to an upload_link (the only curl allowed against dirigenten; the pattern is generated, hook-rules.ts).
    if (r.allow && re(r.allow, "").test(String(input.tool_input?.command ?? ""))) continue;
    const lines = transcript(input.transcript_path);
    // Exceptions are scoped to this request: a mention in an old user turn, or a phrase in an unrelated tool result,
    // must not silently disable the guard for later customer writes.
    const current = turn(lines);
    if (explicitlyChoosesConnector(lastUserText(lines), r.name)) continue;
    if (dirigentSaysCapabilityMissing(current)) continue;
    const ways = r.ways.map((w) => `${w.tool}${w.op ? `{op:"${w.op}"}` : ""} (${w.severity})`).join(" eller ");
    return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny",
      permissionDecisionReason: `${RULES.pre_line} Dirigentens väg: ${ways}. Exempel: ${JSON.stringify(r.ways[0]?.example ?? { tool: "read", args: { op: "can" } })}.` } };
  }
  return null;
}

function explicitlyChoosesConnector(message, name) {
  const mention = new RegExp(`\\b${name}\\b`, "ig");
  for (const match of message.matchAll(mention)) {
    const before = message.slice(Math.max(0, match.index - 80), match.index);
    const routes = /\b(?:use|använd|via|med|through)\b(?:\W+\w+){0,2}\W*$/i.test(before);
    const negates = /\b(?:not|don't|do not|never|inte|aldrig|utan)\b(?:\W+\w+){0,2}\W*$/i.test(before);
    if (routes && !negates) return true;
  }
  return false;
}

/** Only a current-turn reply from the dirigent tool can establish that it lacks this route. */
function dirigentSaysCapabilityMissing(lines) {
  const calls = new Map();
  const pending = [];
  let missing = false;
  for (const o of lines) for (const b of blocks(o)) {
    if (b.type === "tool_use") {
      const isRoute = isDirigent(b.name);
      if (b.id) calls.set(b.id, isRoute);
      else pending.push(isRoute);
    } else if (b.type === "tool_result") {
      const isRoute = b.tool_use_id ? calls.get(b.tool_use_id) : pending.shift();
      if (isRoute === true) missing = /saknar förmågan|no capability|no runner|ingen körare/.test(text(b.content));
    }
  }
  return missing;
}

const STATE = (session) => join(tmpdir(), `rotor-guard-${String(session ?? "x").replace(/[^\w-]/g, "")}.json`);
function seriesKind(name, a) {
  const tool = name.split("__").pop();
  if (tool === "act" && a?.batch === undefined && typeof a?.action === "string") return `act|${a?.on?.task ?? a?.on?.id ?? ""}`;
  if (tool === "write" && (a?.op === "file_add" || a?.op === "content_save")) return `write|${a.op}`;
  return null;
}

export function onPost(input) {
  const name = String(input.tool_name ?? ""), out = text(input.tool_response);
  const lines = [];
  if (isDirigent(name) || re(RULES.dirigent_reply).test(out)) {
    if (/stale_tools/.test(out)) lines.push(RULES.stale_line);
    if (/"isError":true|"phase":"refused"/.test(out) && /"next":\{/.test(out) && !/"preview_id"/.test(out)) lines.push(RULES.refused_line);
    if (/batch_hint/.test(out)) lines.push(RULES.batch_line);
    else {
      const kind = seriesKind(name, input.tool_input);
      let st = {}; try { st = JSON.parse(readFileSync(STATE(input.session_id), "utf8")); } catch { /* first */ }
      const n = kind && st.kind === kind ? (st.n ?? 0) + 1 : kind ? 1 : 0;
      try { writeFileSync(STATE(input.session_id), JSON.stringify({ kind, n })); } catch { /* no state */ }
      if (n >= RULES.batch.min) lines.push(RULES.batch_line);
    }
  }
  // A file Claude made, or a curl upload: point to file_add (and chunk).
  const path = String(input.tool_input?.file_path ?? "");
  const usesDirigent = () => transcript(input.transcript_path).some((o) => blocks(o).some((b) => b.type === "tool_use" && isDirigent(b.name)));
  if ((name === "Write" && re(RULES.files.ext).test(path) && usesDirigent()) || (name === "Bash" && /curl[^\n]*(upload|filbank)/.test(text(input.tool_input?.command))))
    lines.push(`${RULES.file_line} Namn: ${RULES.files.name_rule}.`);
  return lines.length ? { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: lines.join(" ") } } : null;
}

export function onStop(input, git = gitChanged) {
  if (input.stop_hook_active) return null; // never a loop: the second stop goes through
  const t = turn(transcript(input.transcript_path, 800));
  const results = t.flatMap((o) => blocks(o).filter((b) => b.type === "tool_result").map((b) => text(b.content)));
  const uses = t.flatMap((o) => blocks(o).filter((b) => b.type === "tool_use"));
  const said = t.flatMap((o) => (o.type === "assistant" ? blocks(o).filter((b) => b.type === "text").map((b) => b.text) : [])).join(" ");
  const items = [];
  const last = results.filter((r) => /"envelope"/.test(r)).at(-1) ?? "";
  if (/"preview_id":"[^"]+"/.test(last) && !/förhandsvisning|ska jag|vill du|godkänn/i.test(said)) items.push(RULES.stop_preview);
  const made = uses.filter((u) => u.name === "Write" && re(RULES.files.ext).test(String(u.input?.file_path ?? "")));
  if (made.length && uses.some((u) => isDirigent(u.name)) && !uses.some((u) => /file_add/.test(text(u.input))) && !/filbank|bara lokalt|lokalt/i.test(said)) items.push(RULES.stop_file);
  if (results.some((r) => /"affected":\[\{/.test(r)) && !/berör|öppna(s|t)? igen/i.test(said)) items.push(RULES.stop_affected);
  const cwd = String(input.cwd ?? "");
  const wrote = uses.some((u) => ["Write", "Edit", "NotebookEdit"].includes(u.name));
  if (wrote && existsSync(join(cwd, "docs/kvar.md"))) {
    const changed = git(cwd);
    if (changed.length && !changed.includes("docs/kvar.md") && !/kvar\.md|kvar-listan/i.test(said)) items.push(RULES.stop_kvar);
  }
  // Planning in this turn: the last planning write's reply still reminds of what must not be lost, and no note of it came after.
  const P = RULES.planning;
  if (P) {
    const at = uses.map((u, i) => ({ i, s: text(u.input) })).filter((x) => re(P.writes).test(x.s));
    const lastWrite = at.at(-1);
    const keptAfter = lastWrite !== undefined && uses.slice(lastWrite.i).some((u) => re(P.writes).test(text(u.input)) && re(P.keep).test(text(u.input)));
    const reminded = results.some((x) => re(P.remind).test(x));
    if (lastWrite !== undefined && reminded && !keptAfter) items.push(RULES.stop_planning);
  }
  return items.length ? { decision: "block", reason: `${RULES.stop_intro}\n- ${items.join("\n- ")}` } : null;
}

function gitChanged(cwd) {
  try { return execFileSync("git", ["-C", cwd, "status", "--porcelain"], { encoding: "utf8", timeout: 3000 }).split("\n").map((l) => l.slice(3).trim()).filter(Boolean); }
  catch { return []; }
}

const HANDLERS = { UserPromptSubmit: onPrompt, PreToolUse: onPre, PostToolUse: onPost, Stop: onStop };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let raw = "";
  process.stdin.on("data", (d) => (raw += d));
  process.stdin.on("end", () => {
    try {
      const input = JSON.parse(raw || "{}");
      const out = HANDLERS[input.hook_event_name]?.(input) ?? null;
      if (out) process.stdout.write(JSON.stringify(out));
    } catch { /* tyst ja */ }
    process.exit(0);
  });
}
