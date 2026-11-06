#!/usr/bin/env node
/**
 * Vägkartans krok (Daniel P 2026-11-06: «går det inte att göra på ett sätt så att Claude inte behöver skicka»).
 *
 * Runs after every tool call in Claude Code and Cowork (PostToolUse), without the model:
 *  1. A reply from dirigenten with a ticket (`help.trail`) starts a log for that moment.
 *  2. While the ticket holds, Claude in Chrome's steps and other connectors' calls are logged with every value taken
 *     out: an address as its origin and path with ids as `*`, a click or a filled field as its kind, a connector call
 *     as its tool name and the names of its fields. Nothing typed, no query, no summary text.
 *  3. When the moment is marked done outside, the log is sent to dirigenten in the background, once, and removed.
 * Nothing is printed and the hook always ends well: the conversation is never held up by it.
 *
 * The data folder is CLAUDE_PLUGIN_DATA; ROTOR_TRAIL_SYNC=1 sends at once instead of in the background (the test).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE = "https://rotor-dirigenten.netlify.app";
const MAX_STEPS = 200;
const dataDir = () => process.env.CLAUDE_PLUGIN_DATA || join(homedir(), ".rotor-dirigenten");
const base = () => process.env.CLAUDE_PLUGIN_OPTION_DIRIGENT_URL || process.env.ROTOR_DIRIGENT_URL || DEFAULT_BASE;
const safe = (s) => String(s ?? "x").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64) || "x";
const NAME = /^[A-Za-z0-9_.-]{1,60}$/;

/** An address as its origin and path with ids as `*`; no query, no fragment. */
export function targetOf(url) {
  try {
    const u = new URL(String(url));
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    const path = u.pathname.split("/").map((seg) => /^act_\d+$/.test(seg) ? "act_*"
      : /^\d+$/.test(seg) || /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(seg) || /[@%]/.test(seg) || /\d{3,}/.test(seg) ? "*" : seg).join("/");
    return `${u.origin}${path}`;
  } catch { return undefined; }
}

const COMPUTER = { left_click: "click", right_click: "click", double_click: "click", triple_click: "click", left_click_drag: "click",
  type: "type", key: "key", scroll: "scroll", scroll_to: "scroll", screenshot: "read", zoom: "read", hover: "read" };
const BROWSER = { form_input: "fill", file_upload: "fill", upload_image: "fill", find: "read", read_page: "read", get_page_text: "read" };

/** The step a browser call is, or null; only the kind and a cleaned address are kept. */
export function browserStep(tool, input) {
  const i = input && typeof input === "object" ? input : {};
  if (tool === "navigate") { const target = targetOf(i.url); return target ? { kind: "navigate", target } : null; }
  if (tool === "computer") { const kind = COMPUTER[i.action]; return kind ? { kind } : null; }
  const kind = BROWSER[tool];
  return kind ? { kind } : null;
}

const BROWSER_SERVER = /^mcp__(claude-in-chrome|Claude_Browser)__(.+)$/;
const OWN_SERVER = /^mcp__.*rotor-(dirigenten|lokal)/;

/** The steps one tool call gives: a browser step (a batch gives several), a connector call, or none. */
export function stepsOf(name, input) {
  const b = BROWSER_SERVER.exec(name);
  if (b) {
    if (b[2] === "browser_batch") return (Array.isArray(input?.actions) ? input.actions : []).map((a) => browserStep(String(a?.name ?? ""), a?.input)).filter(Boolean);
    const s = browserStep(b[2], input);
    return s ? [s] : [];
  }
  if (OWN_SERVER.test(name)) return [];
  const tool = name.split("__").slice(2).join("__");
  if (!NAME.test(tool)) return [];
  const keys = Object.keys(input && typeof input === "object" ? input : {}).filter((k) => NAME.test(k)).slice(0, 20);
  return [{ kind: "tool", tool, ...(keys.length > 0 ? { keys } : {}) }];
}

const TICKET = /\\*"trail\\*"\s*:\s*\\*"(t1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/;
const momentOf = (ticket) => { try { return JSON.parse(Buffer.from(ticket.split(".")[1], "base64url").toString("utf8")).m; } catch { return undefined; } };
/** A log left a day without being marked is dropped (the server's ticket holds a day too). */
const DAY_MS = 86_400_000;

async function send(file, way, ticket) {
  const steps = readFileSync(file, "utf8").split("\n").filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } }).slice(0, MAX_STEPS);
  const r = await fetch(`${base()}/mcp/lokal/trail`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ ticket, way, steps }), signal: AbortSignal.timeout(8000) });
  if (r.ok) rmSync(file, { force: true });
}

async function main() {
  if (process.argv[2] === "--send") return send(process.argv[3], process.argv[4], process.argv[5]);
  let raw = "";
  for await (const c of process.stdin) raw += c;
  const ev = JSON.parse(raw || "{}");
  const name = String(ev.tool_name ?? "");
  if (!name.startsWith("mcp__")) return;
  const dir = dataDir();
  mkdirSync(dir, { recursive: true });
  const session = safe(ev.session_id);
  const ticketFile = join(dir, `trail-${session}.ticket`), stepsFile = join(dir, `trail-${session}.jsonl`);
  const input = ev.tool_input && typeof ev.tool_input === "object" ? ev.tool_input : {};
  // The moment marked done outside: send the log once, in the background, and start over.
  if (/__act$/.test(name) && input.action === "done_outside") {
    if (!existsSync(ticketFile) || !existsSync(stepsFile)) return;
    const ticket = readFileSync(ticketFile, "utf8").trim();
    // Only the moment the ticket is for: another moment's mark drops the log, so no step lands on the wrong moment.
    if (momentOf(ticket) !== input.on?.id) { rmSync(stepsFile, { force: true }); return; }
    const way = input.params?.way === "connector" ? "connector" : "chrome";
    const sending = join(dir, `trail-${session}-${process.pid}.sending`);
    renameSync(stepsFile, sending);
    // The ticket stays: the same moment done once more the same day is logged too.
    if (process.env.ROTOR_TRAIL_SYNC === "1") return send(sending, way, ticket);
    spawn(process.execPath, [fileURLToPath(import.meta.url), "--send", sending, way, ticket], { detached: true, stdio: "ignore" }).unref();
    return;
  }
  // A reply from dirigenten with a ticket: a new log for that moment.
  const m = TICKET.exec(JSON.stringify(ev.tool_response ?? ""));
  if (m) { writeFileSync(ticketFile, m[1]); rmSync(stepsFile, { force: true }); return; }
  if (!existsSync(ticketFile)) return;
  if (Date.now() - statSync(ticketFile).mtimeMs > DAY_MS) { rmSync(ticketFile, { force: true }); rmSync(stepsFile, { force: true }); return; }
  const steps = stepsOf(name, input);
  if (steps.length > 0) appendFileSync(stepsFile, steps.map((s) => JSON.stringify(s)).join("\n") + "\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main().catch(() => {}).finally(() => { process.exitCode = 0; });
