---
name: dirigenten
description: How the dirigenten registry, planning and delivery system fits together, and how to work in it. Also for everyday asks: «ladda upp», «spara filen», «ta bort filen», «mejla kollegan», «skicka till kunden», «hur går det med <kund>», «planera», «ändra i CRM:et». Use whenever someone asks what is promised, what is planned, what is late, which questions are waiting, who does what, where a customer's files are, or how something is delivered — and before acting on any task, step, requirement or file in dirigenten. Also when someone wants something made or changed for a customer (a price list, ads, a CRM change, a mail reply, a campaign plan, an image, a file), even if dirigenten is not named. Also opens or updates the dirigent view (Översikten with lenses, sheets and ⌘K) as the user's own artifact: "dirigentvyn", "vyn", "översikten", or when the view says it is outdated or cannot reach dirigenten.
---

<!-- Generated from src/v2/skill (npm run gen:skills). Edit there. -->

# Dirigenten

Rotor's customers, tasks, files, mail, planning and customer systems: connector rotor-dirigenten. Rules:

- Not sure, or about to say «cannot» or use another connector (mail, CRM, ads, curl): `read{op:"can", q:"<the user's words>"}` first.
- Every op below works under `read`/`write` even when your tool schema lacks it.
- `act{on, action, rev}` does things; `rev` from the last read; several of a kind in one call with `batch`.
- ● do. ◐ one yes per task and day. ■ call without `user_approval`, show the preview, then send the verbatim yes with `preview_id`, alone.
- A refusal carries `envelope.next`: send it. `stale_tools` in a reply: tell the user `stale_tools.how` once.
- Tell the user what `say` says (happened, now, then). **Förklara det du hänvisar till.**

## Calls (generated)

- can → `read{"op":"can","q":"<q>"}` ●
- save → `write{"op":"save","text":"<text>","customer":"<customer>"}` ●
- file remove → `write{"op":"file_remove","from_ref":"<from_ref>","reason":"<reason>"}` ■
- file restore → `write{"op":"file_restore","from_ref":"<from_ref>"}` ◐
- asset copy → `write{"op":"asset_copy","from_ref":"<from_ref>","folder":"<folder>","customer":"<customer>"}` ◐
- find file → `read{"op":"find_file","q":"<q>"}` ●
- upload link → `read{"op":"upload_link","customer":"<customer>","folder":"<folder>"}` ●
- message → `write{"op":"message","to":"<to>","text":"<text>","about":"<about>","reply_to":"<reply_to>"}` ◐
- mail draft → `write{"op":"mail_draft","values":"<values>"}` ■
- content graph → `read{"op":"content_graph","graph_id":"<graph_id>"}` ●
- content graph edit → `write{"op":"content_graph_edit","graph_id":"<graph_id>","node":"<node>","path":"<path>","value":"<value>"}` ◐
- quick run → `write{"op":"quick_run","task":"<task>"}` ◐
- batch apply → `write{"op":"batch_apply","action":"<action>","items":"<items>","params":"<params>"}` ■
- run on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"run","rev":"<rev>"}` per envelope
- do self on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"do_self","rev":"<rev>"}` per envelope
- approve on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"approve","rev":"<rev>"}` per envelope
- skip on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"skip","rev":"<rev>"}` per envelope
- attach file on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"attach_file","rev":"<rev>"}` per envelope
- change who on a moment → `act{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"change_who","rev":"<rev>"}` per envelope
- several actions of a kind → `act{"on":"<first on>","action":"<action>","rev":"<rev>","batch":[{"on":"<next on>","action":"<action>","rev":"<rev>"}]}` ■ alone
- a ■ reply had a preview → `act{"on":"<same>","action":"<same>","rev":"<rev>","preview_id":"<envelope.preview.preview_id>","user_approval":"<the user's words verbatim>"}` ■
- a refusal or rev_conflict → `<envelope.next.tool>{"...":"<envelope.next.args>"}` as sent (send envelope.next as it is)

## Examples per area

- [Files and the file bank](references/files-and-file-bank.md): upload, save, find, move or remove a file
- [Mail and calendar](references/mail-and-calendar.md): mail a colleague or a customer, reply
- [Planning and project start](references/planning-and-project-start.md): plan, add a step, how is a customer doing
- [Content and the content graph](references/content-and-content-graph.md): texts, a site, content that must hang together
- [Customer systems](references/customer-systems.md): read or change a CRM, an ad account, a site; render
- [Severity and yes](references/severity-and-yes.md): something is sent, published, removed or approved
- [Refusals and detours](references/refusals-and-detours.md): a refusal, an error, «cannot», stale tools

Details: `guide{phase}`; `map` lists what can run here; `promptstandard` how a prompt is written. Anta inte att något fortfarande inte fungerar för att det inte fungerade tidigare i samtalet eller i går. Fråga servern igen.
