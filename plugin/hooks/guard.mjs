#!/usr/bin/env node
/**
 * Dirigentens vakt (Daniel P 2026-11-10): styr tidigt till dirigentens väg. En fil för fyra händelser, reglerna ur
 * rules.json (genereras ur koden, src/v2/skill/hook-rules.ts). Samma regler bär servern, så claude.ai (utan hooks) får
 * samma svar: instruktionerna, ways vid okänd op, stale_tools och batch_hint.
 *
 *   UserPromptSubmit  en rad om dirigenten när prompten rör kund, uppdrag, fil, mejl eller planering
 *   PreToolUse        styr om andra kopplingars skrivningar när dirigenten har en förmåga i drift för dem; läsningar och
 *                     skrivningar utan väg går igenom (de senare med en notis); curl mot dirigenten
 *                     planeringsskrivningar till dirigenten får principen om ickelinjär plan
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
/** A user line's own words: text the person wrote, never a tool result. */
const ownText = (o) => (typeof o.message?.content === "string" ? o.message.content : blocks(o).filter((b) => b.type === "text").map((b) => b.text).join(" "));
/**
 * A prompt the person wrote: not a line the client adds as the user's (a loaded skill, a reminder, a command's output:
 * isMeta or tagged). 2026-11-23: a skill loaded after the person's yes hid it, and the guard stopped the Gmail draft.
 */
const isPrompt = (o) => o.type === "user" && o.isMeta !== true && ownText(o).trim() !== ""
  && !/^\s*(<(system-reminder|command-|local-command|task-notification)|Base directory for this skill)/.test(ownText(o));
function lastUserText(lines) {
  for (let i = lines.length - 1; i >= 0; i--) if (isPrompt(lines[i])) return ownText(lines[i]);
  return "";
}
/** Lines since the user's last prompt (this turn). */
function turn(lines) {
  let i = lines.length - 1;
  for (; i >= 0; i--) if (isPrompt(lines[i])) break;
  return lines.slice(i + 1);
}
/** Lines since the prompt before the last one: this turn and the one before (a failure, then the person's answer). */
function lastTwoTurns(lines) {
  let seen = 0, i = lines.length - 1;
  for (; i >= 0; i--) if (isPrompt(lines[i]) && ++seen === 2) break;
  return lines.slice(i + 1);
}
/** What Claude said last before the person's last prompt (the question she answers). */
function askedBefore(lines) {
  let i = lines.length - 1;
  for (; i >= 0; i--) if (isPrompt(lines[i])) break;
  for (let j = i - 1; j >= 0; j--) {
    if (isPrompt(lines[j])) return "";
    const t = lines[j].type === "assistant" ? blocks(lines[j]).filter((b) => b.type === "text").map((b) => b.text).join(" ") : "";
    if (t.trim()) return t;
  }
  return "";
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
  // A send's yes (■): the person's own lone yes, word for word, to the preview Claude showed in the turn before.
  if (isDirigent(name)) {
    const no = sendYesProblem(input);
    if (no) return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: no } };
  }
  // A planning write to dirigenten: the non-linear principle, said where the plan is made (Daniel P 2026-11-16).
  if (isDirigent(name)) return RULES.nonlinear && re(RULES.nonlinear.input, "").test(args)
    ? { hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: RULES.nonlinear_line } } : null;
  for (const r of RULES.pre) {
    if (!re(r.tool).test(name) && !(Array.isArray(r.routes) && (onSystemServer(r, name) || sameServerAsKnown(r, name, input.transcript_path)))) continue;
    if (r.input && !re(r.input).test(args)) continue;
    // Developing dirigenten itself (the repo) may curl its previews.
    if (r.id === "curl_upload" && /rotor-dirigenten|wt-/.test(String(input.cwd ?? "")) && !/upload/.test(args)) continue;
    // A file sent by code to an upload_link (the only curl allowed against dirigenten; the pattern is generated, hook-rules.ts).
    if (r.allow && re(r.allow, "").test(String(input.tool_input?.command ?? ""))) continue;
    // A routed connector (HubSpot, Meta): only a write in its input matches; a read always passes. A write is redirected
    // only when dirigenten has a live capability that clearly does it; otherwise it passes with a note (Daniel P 2026-11-16).
    let ways = r.ways;
    if (Array.isArray(r.routes)) {
      // Only a known read with its exact shape passes silently; anything else is a write (the reads are generated, hook-rules.ts).
      if (isKnownRead(r.reads ?? [], name, input.tool_input)) continue;
      const route = r.routes.find((x) => (!x.tool || re(`__${x.tool}$`, "").test(name)) && (x.input === "" || re(x.input, "").test(args)));
      // A write no route names, or one dirigenten has no live capability for: passes with the note, never silently.
      if (!route || !route.ways.length) return { hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: RULES.pass_line } };
      ways = route.ways;
    }
    const lines = transcript(input.transcript_path);
    // Exceptions are scoped to this request: a mention in an old user turn, or a phrase in an unrelated tool result,
    // must not silently disable the guard for later customer writes.
    const current = turn(lines);
    // The exceptions hold only for the tools the rule names as exempt (the Gmail drafts, never a send).
    const exempt = !r.exempt_tool || re(r.exempt_tool, "").test(name);
    if (exempt && explicitlyChoosesConnector(lastUserText(lines), r.name, askedBefore(lines))) continue;
    if (exempt && dirigentSaysCapabilityMissing(current)) continue;
    // Dirigent's own way for the same thing just failed (this turn or the one before): the other connector may be used.
    if (exempt && r.same && dirigentSameFailed(lastTwoTurns(lines), r)) continue;
    const said = ways.map((w) => `${w.tool}${w.op ? `{op:"${w.op}"}` : ""}${w.call ? `{call:"${w.call}"} (${w.label})` : ""} (${w.severity})`).join(" eller ");
    return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny",
      permissionDecisionReason: `${RULES.pre_line} Dirigentens väg: ${said}. Exempel: ${JSON.stringify(ways[0]?.example ?? { tool: "read", args: { op: "can" } })}.` } };
  }
  return null;
}

const plain = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const subset = (o, keys) => Object.keys(o).every((k) => keys.includes(k));
/** A known read: the exact tool, the input's keys within the read's, and a nested operation of a listed type with its own keys. */
function isKnownRead(reads, name, input) {
  const tool = name.split("__").pop();
  const read = reads.find((x) => x.tool === tool);
  if (!read) return false;
  // A read bound by name alone (no keys): the tool never writes, whatever its input.
  if (!read.keys) return true;
  if (!plain(input) || !subset(input, read.keys)) return false;
  if (!read.nest) return true;
  const op = input[read.nest.field];
  return plain(op) && subset(op, read.nest.keys) && typeof op[read.nest.type_key] === "string" && read.nest.types.includes(op[read.nest.type_key]);
}
/** A tool on a server whose name names the system (the connector's `server` in the registry): known even in a fresh session. */
function onSystemServer(r, name) {
  if (!r.server || !name.startsWith("mcp__")) return false;
  const server = name.slice(5, name.lastIndexOf("__"));
  return re(r.server).test(server);
}
/** A tool not on the connector's list from a server that served one of its listed tools earlier in the session. */
function sameServerAsKnown(r, name, path) {
  const names = r.names ?? [];
  if (!names.length || !name.startsWith("mcp__")) return false;
  const server = name.slice(0, name.lastIndexOf("__"));
  return transcript(path).some((o) => blocks(o).some((b) => b.type === "tool_use" && typeof b.name === "string"
    && b.name.startsWith(`${server}__`) && names.includes(b.name.slice(server.length + 2))));
}

const W = RULES.consent ?? {};
const quoted = /«[^»]*»|"[^"]*"|“[^”]*”|`[^`]*`/g;
/**
 * The person's last prompt allows this connector: a short message of her own (never pasted text), without a no, that
 * names it after a verb of choosing or right beside a yes; or a short yes to Claude's own question asking to use it
 * for a draft (not a quoted tool reply). Review 2026-11-23: the words were too loose and pasted mails unlocked it.
 */
function explicitlyChoosesConnector(message, name, asked = "") {
  const raw = message.trim();
  if (!raw || raw.length > Number(W.max_length ?? 80) || !W.yes) return false;
  // Quoted text is someone else's words, never the person's choice (2026-11-25).
  const own = raw.replace(quoted, " ");
  // A no to dirigent («inte via dirigenten», 2026-11-25) is not a no to the connector; a no beside the connector still is.
  const msg = W.not_dirigent ? own.replace(re(W.not_dirigent, "ig"), (m) => (re(`\\b${name}`).test(m) ? m : " ")) : own;
  if (W.no && re(W.no).test(msg)) return false;
  // The name alone or at the start of a compound («gmailkopplingen», Daniel P 2026-11-23; «Meta-kopplingen»), never
  // another word that starts like it («metadata»).
  for (const m of msg.matchAll(new RegExp(`\\b${name}${W.name_suffix ?? "\\w*"}`, "ig"))) {
    const before = msg.slice(0, m.index), after = msg.slice(m.index + m[0].length);
    if (re(W.routes).test(before) || re(W.yes_before).test(before) || re(W.yes_after).test(after)) return true;
  }
  return re(W.yes).test(msg) && asksForConnector(asked, name);
}
/** Claude's own question (a sentence ending in «?», quotes removed) that names the connector and a draft. */
function asksForConnector(asked, name) {
  const own = asked.replace(quoted, " ");
  return (own.match(/[^.!?]*\?/g) ?? []).some((q) => re(`\\b${name}\\w*`).test(q) && re(W.draft ?? "draft").test(q));
}

/** The turn before the last prompt: from the prompt before it up to the last prompt (where the preview was shown). */
function previousTurn(lines) {
  let last = lines.length - 1;
  for (; last >= 0; last--) if (isPrompt(lines[last])) break;
  let i = last - 1;
  for (; i >= 0; i--) if (isPrompt(lines[i])) break;
  return lines.slice(i + 1, Math.max(last, 0));
}
/**
 * Why a send's yes does not hold, or null (review 2026-11-23): only a call that sends and carries user_approval is checked.
 * The yes must be the person's last message word for word, a lone yes with no no-word; Claude's text before it must have
 * shown the recipients and the subject; and the preview's id must come from a reply in the turn before that message,
 * so a yes from an earlier turn cannot be used again.
 */
function sendYesProblem(input) {
  const S = RULES.send_yes, a = input.tool_input ?? {};
  if (!S || typeof a.user_approval !== "string" || !re(S.input, "").test(text(a))) return null;
  const v = plain(a.values) ? a.values : a;
  const lines = transcript(input.transcript_path);
  const msg = lastUserText(lines).trim();
  if (a.user_approval.trim() !== msg) return S.not_verbatim;
  if (!W.yes_alone || !re(W.yes_alone).test(msg) || (W.no && re(W.no).test(msg))) return S.not_alone;
  const asked = askedBefore(lines);
  const to = (Array.isArray(v.to) ? v.to : String(v.to ?? "").split(",")).map((x) => String(x).trim()).filter(Boolean);
  const subject = String(v.subject ?? "").trim();
  if (!to.length || !to.every((x) => asked.includes(x)) || (subject && !asked.includes(subject))) return S.not_shown;
  const pid = String(v.preview_id ?? a.preview_id ?? "");
  const shown = pid !== "" && previousTurn(lines).some((o) => blocks(o).some((b) => b.type === "tool_result" && resultText(b).includes(`"preview_id":"${pid}"`)));
  return shown ? null : S.not_fresh;
}

/** A tool result's text: the client's own form (a string, or text blocks), with its error flag. */
function resultText(b) {
  const c = b.content;
  const t = typeof c === "string" ? c : Array.isArray(c) ? c.map((x) => (typeof x?.text === "string" ? x.text : JSON.stringify(x))).join(" ") : JSON.stringify(c ?? "");
  return b.is_error === true ? `"isError":true ${t}` : t;
}
/** The last dirigent call for the same thing (`same` against its input, by `same_tool`) failed, with nothing after it that worked. */
function dirigentSameFailed(lines, r) {
  const calls = new Map();
  let failed = false;
  for (const o of lines) for (const b of blocks(o)) {
    if (b.type === "tool_use" && b.id && isDirigent(b.name) && (!r.same_tool || re(r.same_tool, "").test(b.name)) && re(r.same).test(text(b.input))) calls.set(b.id, true);
    else if (b.type === "tool_result" && calls.get(b.tool_use_id)) failed = re(RULES.dirigent_failed ?? "\"code\":\\s*\"INTERNAL\"").test(resultText(b));
  }
  return failed;
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

/** An earlier dirigent reply in this conversation said stale_tools (not this call's own result, if already written). */
function staleSaidBefore(input) {
  return transcript(input.transcript_path, 2000).some((o) => blocks(o).some((b) => b.type === "tool_result"
    && b.tool_use_id !== input.tool_use_id && /stale_tools/.test(resultText(b))));
}

export function onPost(input) {
  const name = String(input.tool_name ?? ""), out = text(input.tool_response);
  const lines = [];
  if (isDirigent(name) || re(RULES.dirigent_reply).test(out)) {
    // Old tools are said once per conversation (2026-11-23): not when an earlier reply in the transcript already had it.
    if (/stale_tools/.test(out) && !staleSaidBefore(input)) lines.push(RULES.stale_line);
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
