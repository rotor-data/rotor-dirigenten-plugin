---
name: dirigenten
description: How the dirigenten registry, planning and delivery system fits together, and how to work in it. Use whenever someone asks what is promised, what is planned, what is late, which questions are waiting, who does what, where a customer's files are, or how something is delivered — and before acting on any task, step, requirement or file in dirigenten. Also opens or updates the dirigent view (Idag, In, Planen, Metoder) as the user's own artifact: "dirigentvyn", "vyn", "Idag-sidan", "planen", or when the view says it is outdated or cannot reach dirigenten.
---

# Dirigenten

**Internal guidance for you, not text to repeat.** The terms below are for your reasoning. To people, talk about the work, never the model: say "the post needs the customer's approval before it goes up", not "the step has an approver". **Talk to the user in Swedish**, plain, short, most important first, unless they write in another language. No ids, node names or tool names; context before numbers.

## The tools

Seven tools, all through the user's `rotor-dirigenten` connector (there is no local server, and the old names `context`, `asset_get`, `intake_submit` … are not tools):

- `search` — find anything. A sure hit is the answer; fetch only what a row points to.
- `guide` — topics, methods, and the fields of every operation: `guide { topic: "verktyg:<op>" }`. The terms: `guide { topic: "begrepp" }`.
- `read { op }` — `context` (a step, task, case or thread in one answer), `asset_get`, `content_get`, `content_search`, `content_list`, `intake_status`, `read_call`, `library_check`, `library_debt`, `measure_debt`, `classify_propose`, `bug_report`.
- `write { op }` — `intake_order`, `intake_submit`, `registry_define`, `registry_append`, `method_build`, `method_variant_build`, `molecule_build`, `workflow_build`, `task_lock`, `message`, `question_answer`, `time_report`, `note_link`, `content_save`, `content_approve`, `content_published`, `classify_accept`, `bug_report`.
- `plan_state` — plan, task, delivery, a person's week; `agenda: true` is what needs the person today.
- `execute_step` — run, start, mark, move or hand over a step. The only tool that reaches a customer's system.
- `asset_register` — register a file; `upload_sha256: "sida"` opens the upload box.

## How it fits together

A **commitment** is what the tenant promised a customer. It generates **tasks**, one per thing delivered. Each follows a **method**. Time is computed backwards from delivery; moving inside the window or a step's float changes nothing for the customer, moving the delivery is a new promise a human confirms. Everything is an append-only log: a correction is a new event.

**Three layers: Uppdrag goes before Kundens sätt, which goes before Metod.**
- **Metod** — the general, all customers: instruction or recipe, what counts as done. Change: `registry_define { change: true }`.
- **Kundens sätt** — one customer's differences only: who, templates, rules, values, own instruction, added steps. Change: `method_variant_build`, or `registry_define { change: true }` on the variant.
- **Uppdrag** — this delivery: dates, status, results, steps only here (`task_lock add_step`), what the step waits on in other parts, the task's material. Edit the narrowest layer that fits.

**Steps and moments.** What a person sees as a *steg* is one thing done at one time that gives a result. Inside it are *delmoment* (the registry's steps) that code or Claude runs in sequence; a person sees them only folded. A steg has `enough` («så vet du att du är klar»), a `result`, and sometimes a named person whose yes is needed. `read { op: "context" }` gives the steg first (its `enough`, prompts, material, what is `missing`), then the delmoment.

Underneath: an **atom** is general code doing one thing against one surface; a **molecule** is one effect (atom, performer, declared result); a **workflow** is molecules in sequence, and a method is a workflow that delivers something. When a plan needs what the library cannot do, write an **atom proposal** (one effect, surface, inputs, outputs, access level, test, why). **You may propose atoms, never create them**: a molecule binding code that does not exist is rejected. A human builds it with `npm run build:atom --from-proposal <id>`. Debt: `read { op: "library_debt" }`.

## Working a step

1. **Start and continue.** `plan_state { agenda: true }` first. `execute_step { start: true }` when you begin; `start: false` with a `note` where you stopped. Read earlier drafts (`content_get`) before redoing a step. Save what you write with `content_save { for_task, for_step }` as you go; a draft only in the chat is lost.
2. **Everything you write is previewed first.** Show the preview to the user, then send the next call exactly as given, with `preview_id` when it has one and the user's own words in `user_approval`, verbatim. One preview confirms one call. Text for a template, file or system is shown and approved before it goes in. Only the intake sorting is exempt (`intake_submit` candidates and fetch).
3. **Few stops.** Work stops only when something goes out to a customer or other outside party, when money or an agreement is bound, or when something is written irreversibly in a customer's system. Otherwise keep going while waiting: a requirement is `defer` or `assume`, and what is waited on is a `wait { on, question, remind }`, not "late".
4. **Not linear.** Any step can be opened. If something is missing, get it (do it, draft it, or ask the right person) or continue on a stated assumption and fill in later. Never invent dates, owners, decisions or files; if it is not in dirigenten, say so.
5. **Parts.** In a workspace with parts (a track, a format, a channel) fill in part by part: `execute_step { part }`, with `values: { label }` to add one. A report is saved on its part with `content_save { part }`; a newer version fills in, the old stays.
6. **Results.** A step is not done without a result: `mark: "done"` with nothing left is refused unless `values: { no_result: "<reason>" }` is given. An approved draft with `for_step` is the result. A step done by hand leaves something (text, file, link): register it with `asset_register { for_task }` before marking done. Read only what the step reads; context already gives those keys, latest version.
7. **Material.** Put what the work needs on the step, the part or the whole delivery: `asset_register { material: { what, how }, for_task | delivery, part }`. `action: "important"` marks an important document, shown first in the delivery; the latest approved version counts.
8. **Wrong fields.** The error lists the fields and a ready next call. Follow it.
9. **Notes, drafts, methods.** A step's note says where you stopped. A mail draft with attachments may be created after a yes; sending is always a human's. You may switch a task's method (`task_lock { method }`) after the user's yes, with the preview's `preview_id`.

Approval is asked of the person named in the registry, never of "the customer" in general. A human-performed step follows its recipe (what is needed, how, check). A step done elsewhere may be marked done; if what it should leave is missing, that is an open requirement.

## Search and answers

`search` with 1-5 phrasings in `q`: the customer's words and the house's, plus the customer's name. A case with a mail address or thread: search with it. Lists: `search { do: "browse", kind }`; exact label: fetch the record. The hit carries `fetch`: call only that, and stop when answered. Working a step, task or ticket: `read { op: "context" }` first, then search only the unknown.

Missing a *fact*: rephrase once, browse by kind and customer, then ask the user and say what you tried. Never loop. Missing a *capability* (method, step, call): search method, step, call and atom with two phrasings or more, reuse what exists (a variant of an existing method before a new one), build only when nothing fits, and show the proposal before saving.

Always fetch guidance from the server before speaking about a customer, a task or a way of working: it differs per tenant and changes. This skill holds no methods, customer data or per-customer rules. Never store a customer's customers (leads, attendees): count and place only.

## Files

Files live in the content bank as `bank://<tenant>/<sha256>`, reached with `read { op: "asset_get" }` (previews and links; a gallery in one call). Copies elsewhere, such as Drive, are copies, not the source.

## Credentials are the server's

Dirigenten talks to HubSpot, Gmail, Google Calendar and the content bank from the server. Never ask for a token, key or `.env`, and never suggest one. `HUBSPOT_TOKEN is not set` means another repository (the old HubSpot CLI): say which command was missing and propose it as an atom and a molecule. An authorisation error is a server matter: report it, never route around it.

## Views

The server gives `views_url` (in `plan_state` and `guide`): the person's **own** copy of the view, since in the Claude app a page reaches connectors only for its owner. Link it verbatim; never guess an address or open someone else's. If it is missing (`own_copy_missing`): publish the person's copy as below, then save it with `write { op: "registry_define", change: true, node: { id: "<party id>", views_url: "<address>" } }`, shown first. Without the artifact tool, give `https://rotor-dirigenten.netlify.app/vy` (Google login). The view saves its own address when its owner opens it.

## When a tool is missing

The tool list may be old: ask the user to choose «Refresh tools» on the rotor-dirigenten connector. If that does not help, remove the connector and add it again, never just add (a duplicate). Do not work around it.

## Open or update the view (dirigentvyn)

Talk Swedish, short, say what you do, then do it. The file holds no data; everything comes through the user's own connector.

1. Use `manifest.json` (`title`, `version`, `capabilities`) and `dirigenten.html` from this skill's folder, unedited. Only if they are missing: fetch `https://rotor-dirigenten.netlify.app/vy/manifest` and the page at its `file`.
2. Publish `dirigenten.html` as an artifact **owned by the user**, titled "Dirigenten", with exactly the manifest's `capabilities` (the seven tools, `sample`, `downloads`, and **always `artifact: {}`**, or the update button fails). A copy with the old tool names cannot reach dirigenten: update it. If the user already has an artifact "Dirigenten", update that one so the link stays; otherwise publish a new one and tell them to pin it.
3. Open it. If the page asks to allow connectors ("Tillåt kopplingarna"), tell the user to allow. Save the address on the person as under Views, unless `views_url` already equals it.
4. Tell the user in one sentence: the view is theirs, it updates when they say "uppdatera dirigentvyn" after a plugin update, and the page says when a newer version exists.

If it fails: a newer version exists → the plugin is behind, update it and run this again. No artifact tool → `https://rotor-dirigenten.netlify.app/vy`. The page cannot reach dirigenten → the connector must be on in claude.ai's settings and the artifact published from the user's own account. Never publish someone else's copy, edit the file or add capabilities beyond the manifest.
