---
name: dirigenten
description: How the dirigenten registry, planning and delivery system fits together, and how to work in it. Use whenever someone asks what is promised, what is planned, what is late, which questions are waiting, who does what, where a customer's files are, or how something is delivered — and before acting on any task, step, requirement or file in dirigenten. Also opens or updates the dirigent view (Idag, In, Planen, Metoder) as the user's own artifact: "dirigentvyn", "vyn", "Idag-sidan", "planen", or when the view says it is outdated or cannot reach dirigenten.
---

# Dirigenten

**This is internal guidance for you, not text to repeat.** The terms below describe how the system fits together so you can reason correctly. To people, talk about the work, never the model: say "the post needs the customer's approval before it goes up", not "the step has an approver and declares what it leaves".

**Talk to the user in Swedish**, unless they write in another language.

## The tools

Dirigenten has seven tools. Start with `search` (or `plan_state { agenda: true }` for what needs the person today).

- `search` — find anything: methods, steps, customers, files, the plan. A sure hit is the answer; fetch only what a row points to.
- `guide` — the topics, the methods with their steps, and the fields of every operation: `guide { topic: "verktyg:<op>" }`. The terms: `guide { topic: "begrepp" }`.
- `read { op, … }` — every other read: `context` (a step, a task, a case or a thread in one answer), `asset_get` (files), `content_get`, `content_search`, `content_list`, `intake_status`, `read_call`, `library_check`, `library_debt`, `measure_debt`, `classify_propose`, `bug_report` (the open reports).
- `write { op, … }` — every other write: `intake_order`, `intake_submit`, `registry_define`, `registry_append`, `method_build`, `method_variant_build`, `molecule_build`, `workflow_build`, `task_lock`, `message`, `question_answer`, `time_report`, `note_link`, `content_save`, `content_approve`, `content_published`, `classify_accept`, `bug_report` (report or resolve).
- `plan_state` — the plan, a task, a delivery, a person's week, the agenda.
- `execute_step` — run, mark, move or hand over a step. The only tool that reaches a customer's system.
- `asset_register` — register a file; with `upload_sha256: "sida"` the upload box opens in the chat.

The fields of an operation are checked against that operation. When they are wrong, the error lists the fields — fix them and call again. A write without `confirmed` only shows what would change; the user's yes goes in `user_approval`, in their own words. Anything that reaches a customer or another person, a promise or agreement, an order, a change after delivery or a change in a customer's system can only be confirmed with the `preview_id` from a preview of exactly the same call: show that preview, then send its next call unchanged with the user's words. One preview confirms one call. Marking your own internal step done, notes, time reports and answers need no preview. The old tool names (`context`, `asset_get`, `intake_submit` …) are not tools any more: call them as `read`/`write` with `op`.

## How it fits together

A **commitment** is what the tenant has promised a customer: what they get, how often, and within what time. Commitments generate **tasks**, one per thing to be delivered. Each task follows a **method** — a base method shared across customers, plus a **method variant** holding what is specific to one customer.

A method is **steps** in order. A step has a responsible party, a performer (code, llm or human), sometimes an approver, and declares what it leaves behind — an asset, a text, a decision, a publication. What one step leaves is what the next step consumes. When something is missing the chain stops, and the gap becomes a **requirement**: a question someone answers, or an input someone obtains. Requirements are never assumed away.

Beneath the steps are the building blocks. An **atom** is general code that does one thing against one surface. A **molecule** is a single effect: an atom bound to a concrete case, with a performer and a declared result. A **workflow** is molecules in sequence, and a method is a workflow that delivers something to a customer. This exists so the same thing is not built twice, and so the effect of a change can be seen.

When a plan needs something the library cannot do, the gap becomes an **atom proposal**: a registry entry with one effect, the surface, its inputs and outputs, the access level the effect requires, how it is to be tested, and why it is needed — with the plan and the step that asked for it. A proposal is unbuilt until code exists and its test passes. It shows up in `search` and counts as debt (`read { op: "library_debt" }`). A method that rests on a proposal can be planned and saved, but not run all the way, and the answer says where it stops. **You may propose atoms; you never create them.** The gate enforces this: a molecule binding an atom no code implements is rejected when an AI writes it. A human builds the code from the proposal with `npm run build:atom --from-proposal <id>`, which produces the code template out of the declaration, so it is never written twice.

Time is computed backwards from delivery. A step has an earliest and a latest day, and the distance between them is its float. When a delivery has no fixed date it has a window, and work is placed where there is capacity. Moving within the window or the float changes nothing for the customer. Moving the delivery is a new promise and is confirmed by a human.

Everything that has happened is an append-only log. Nothing is overwritten or deleted; state is derived from the log. A correction is a new event, never an edit of an old one.

Access, visibility and decision rights are in the registry too. You see only what your session may see, and an approver is always a named person.

## Files

Files live in the content bank, addressed as `bank://<tenant>/<sha256>`, and are reached through `read { op: "asset_get" }`: the customer's files, which folder they came from, a preview, or a download link. Some tenants also keep copies elsewhere, for example in Drive; those are copies, not the source. Fetch a gallery in one call with previews, never one call per image.

## Start with the views

The server says where the person's views are: `views_url`, in every `plan_state` answer and in `guide`. It is the person's **own** copy of the view, because in the Claude app (Cowork, Code) a page reaches the connectors only for its owner.

1. Link the user to `views_url`, verbatim. Never guess an address, reuse one from an earlier session or open someone else's artifact.
2. If `views_url` is missing (the answer says `own_copy_missing`): in the Claude app, publish the person's own copy with the section «The view (dirigentvyn)» below, then save its address on the person with `write { op: "registry_define", change: true, node: { id: "<the person's party id>", views_url: "<the artifact address>" } }`. Show that call before you make it. Elsewhere, or if the artifact tool is missing, give `https://rotor-dirigenten.netlify.app/vy` (the server's own page, Google login, works in any browser).
3. The view saves its own address on the person too, silently, when its owner opens or updates it, so this step is only needed the first time.

## Know what is waiting, and continue what was started

`plan_state` with `agenda: true` is the person's list: what burns, what is today, what is soon, each row with the reason and the exact next call. It is the same list the views page shows. Start there when someone asks what to do, and when a session begins.

- **Continue, never restart.** A step may be *started* by someone, with a note on where they stopped, and carry *drafts* saved to it. Read them (`read { op: "content_get", id }`) before doing the step again.
- When you begin a step, say so: `execute_step` with `start: true`. When you stop before it is done, `start: false` with a `note` on where you are — the next person or session reads it.
- Save what you write for a step with `write { op: "content_save", for_task, for_step, … }`, as you go. A draft that lives only in this chat is lost when the chat ends.
- A step done by hand leaves something (text, a file or a link): register it with `asset_register` and `for_task` before marking the step done, or the steps after it wait.

## Fetch guidance before you answer

Always fetch guidance from the server before speaking about a customer, a task or a way of working. It differs per tenant and per customer and it changes. This skill holds no methods, no customer data and no per-customer rules.

## Doing things

- Writes pass the gate. Anything that sends, publishes or costs money stops for a human's confirmation.
- Approval is asked of the person named in the registry, never of "the customer" in general.
- A step performed by a human follows its recipe: what is needed, how to do it, how to check it.
- A step may be marked done even when the work happened elsewhere. If what it should leave is missing, that becomes an open requirement, not an assumption.
- Planning writes nothing on its own.

## Credentials are the server's, never yours

Dirigenten talks to HubSpot, Gmail, Google Calendar and the content bank **from the server**, with credentials that live in the deployment and are readable only by it. Nobody working through this plugin needs a token, a key or a `.env` file, and no one should be asked for one.

- Never ask the user for an API token, and never suggest putting one in a local file. If you are about to, you are in the wrong place: the work belongs behind dirigenten's surface.
- The user's own access comes from signing in with their Rotor account. What they may see and do follows from that, not from what is on their machine.
- **`HUBSPOT_TOKEN is not set` and the like mean you are in another repository** — usually the separate HubSpot CLI, which still keeps its own local secrets. That is not a setup fault to fix with a key: it is a capability that has not been moved into dirigenten yet. Say which command was missing and propose it as an atom and a molecule, so it can be run by everyone instead of by whoever has the token.
- A tool here failing with an authorisation error is a server matter. Report it plainly — never route around it with a local script.

## Never guess

What is missing becomes a question or a task. If the answer is not in dirigenten, say so and propose what would need to be found out. Never invent dates, owners, decisions or files.

## Writing to people

Swedish, plain language. No ids, no node names, no internal terms. Explain where a fact comes from and what it shows. Short, most important first.

## When something is missing

If a tool you need is absent, the cached tool list may be old. Say so, and ask the user to choose «Refresh tools» on the existing rotor-dirigenten connector. If that does not help, the connector is removed and then added again — never just added, which leaves a duplicate. Do not work around it on your own.

## The view (dirigentvyn) — open or update it as the user's own page

When the user asks to open or update the view: talk Swedish, keep it short, say what you do, then do it.

### Why this exists
In the Claude app (Cowork, Code) a page reaches connectors only for its **owner**. A view published by someone else shows "Dirigenten går inte att nå härifrån" here. So each person publishes their **own copy** of the view. The file contains no data — all data comes through the user's own `rotor-dirigenten` connector, with the user's own permissions.

### Do this
1. Use the files that come with this skill, in the same folder as this SKILL.md: `manifest.json` (gives `title`, `version` and `capabilities`) and `dirigenten.html` (the page). No network is needed. Do not edit the page.
   - Only if those files are missing: fetch `https://rotor-dirigenten.netlify.app/vy/manifest` and the page at its `file`, and save the page unchanged as a local `.html` file.
2. Publish `dirigenten.html` as an artifact **owned by the user**, with exactly the manifest's `capabilities` (the `mcp` servers and tools, `sample`, `downloads`) and the title "Dirigenten".
   - The `rotor-dirigenten` tools in the manifest are the seven: `asset_register`, `execute_step`, `guide`, `plan_state`, `read`, `search`, `write`. A copy published with the older tool names (`context`, `asset_get`, `intake_submit` …) cannot reach dirigenten any more: update it with the manifest's capabilities.
   - If the user already has an artifact titled "Dirigenten" (list their artifacts), **update that one** so the link stays the same.
   - Otherwise publish a new one, and tell the user to pin it.
3. Open it for the user. If the page asks to allow connectors ("Tillåt kopplingarna"), tell the user to allow. Then save the artifact address on the person (see «Start with the views», step 2), unless `views_url` already equals it.
4. Tell the user in one sentence: the view is theirs, it updates when they ask ("uppdatera dirigentvyn") after the plugin has been updated, and the page itself says when a newer version exists.

### If something fails
- The page says a newer version exists: the plugin is behind. Tell the user to update the plugin, then run this again.
- The artifact tool is not available here: say so plainly, and give the user `https://rotor-dirigenten.netlify.app/vy`. It works in any browser, with Google login.
- The page still says it cannot reach dirigenten: check that the user's `rotor-dirigenten` connector is on in claude.ai's connector settings, and that the artifact was published from the user's own account (the owner rule above).
- Never publish someone else's copy, never change the file, never add capabilities beyond the manifest.
