# Guide: tools
- `search`: find tasks, moments and deliveries; each hit has an `on` for `read`.
- `read`: one subject's envelope with `rev`; `view:"net"` adds the map.
- `guide`: this text, by `phase`.
- `plan_state`: the overview of deliveries (`agenda`, `include`).
- `act`: the only way to do an action: `on`, `action`, `rev`, `params`, `preview_id`, `user_approval`, `batch`; action `undo` takes the last action back.
- `execute_step`: run a capability for a moment (`on`, `rev`, `params`, `test`); the result is always logged.
- `write`: define, append or draft a registry entry (`op`, `entry`, `fixes`); the gate lists what is missing.

Steps
1. `search{q:[…]}` (one to five phrasings) or `plan_state{}` to find the subject.
2. `read{on}` to get the envelope and `rev`; `read{on, view:"net"}` for a task map (60 moments per page, follow `page.cursor`).
3. `act{on, action, rev}` for every action, `execute_step` to run a capability, `write` to define registry entries.
4. `guide{phase}` for details: moment, task, delivery, case, idea, envelope, severity, promptstandard, tools.

Example 1: `search{q:["offer","quote"]}` then `read{on:hit.on}`.
Example 2: `plan_state{agenda:true}` for what is due, ordered by urgency, then end date.
Counterexample: calling a customer's system through another connector when this server has the capability.
Edge case: a legacy call shape (`asset_register`, `{tool,args}` wrapper) is translated while the adapter window is open; `say.now` shows the new form.

v1's own tools, as `read{op, …}` or `write{op, …}` with v1's fields (a wrong call lists them); severity from the policy, ■ needs `user_approval`:
- `write{op:"calendar_write"}`: kalendern: lay_out, confirm (till personens kalender), undo, follow_span
- `write{op:"time_report"}`: rapportera verklig tid på ett steg eller ärende
- `write{op:"message"}`: meddelande till en kollega; read, resolve
- `write{op:"message_mark"}`: markera meddelanden
- `read{op:"image_picker"}`: bildväljaren: sources, search, prompt
- `write{op:"image_register"}`: bildväljarens val: pick_image { task, ref } ger målet; register + filename, provenance eller from_ref sparar en ny version
- `write{op:"bug_report"}`: felrapport: text, eller resolve; utan båda listan
- `write{op:"note_link"}`: anteckning med länk
- `read{op:"plan_estimate"}`: uppskatta en plan
- `read{op:"content_search"}`: sök i innehållsbanken
- `read{op:"content_list"}`: lista innehåll
- `read{op:"content_get"}`: hämta innehåll
- `read{op:"asset_get"}`: hämta en fil ur banken
- `write{op:"content_save"}`: spara innehåll
- `write{op:"content_approve"}`: godkänn innehåll
- `write{op:"content_published"}`: markera publicerat
- `read{op:"presentation_draft"}`: presentationens utkast
- `read{op:"step_material"}`: momentets material i grupper (momentets först), med version och godkänt: task, node
- `read{op:"delivery_material"}`: leveransens material och saker: task (whole: true för hela leveransen) eller delivery
- `read{op:"step_card"}`: stegets ark som v6 visade det, med lägesbilden: task, step (momentets nyckel)
- `write{op:"presentation_text"}`: presentationens text
- `read{op:"project_brief"}`: projektets brief
- `write{op:"project_brief_save"}`: spara projektets brief
- `read{op:"library_search"}`: sök i biblioteket
- `read{op:"library_check"}`: kontrollera biblioteket
- `read{op:"library_debt"}`: bibliotekets skuld
- `read{op:"measure_debt"}`: mät skuld
- `read{op:"classify_propose"}`: förslag på klassning
- `read{op:"intake_status"}`: beställningens läge
- `read{op:"messages"}`: meddelandena: varje meddelande med tråd, läst, löst, arkiverat; since
- `read{op:"inbox_sheet"}`: Inkommet: kön och varje tråds öde; days
- `write{op:"classify_accept"}`: flytta inkommet dit det hör: thread, classification.route.to
- `write{op:"case_mark"}`: märk ärenden: task, resolved, note, archived, merged_into
- `write{op:"case_take_over"}`: ta över ett ärende: task
- `read{op:"quick_actions"}`: snabbhandlingarna per kund; med ref: uppdragen filen kan kopplas till
- `write{op:"intake_order"}`: lägg in en beställning: kund, leveranstyp, datum, vem som beställt; blir ett uppdrag
- `write{op:"intake_submit"}`: ta emot kandidater (möte, mejl, formulär); fetch läser brevlådan utan att skriva
v1's step tools, with v1's fields, done on v2's moments through read, act or plan_state (severity and yes as there):
- `read|write{op:"context"}`: lägesbilden: task + step/node, eller thread
- `read|write{op:"step_sheet"}`: stegets ark: task + step/node
- `read|write{op:"delivery_results"}`: leveransens resultat: delivery eller task
- `read|write{op:"plan_questions"}`: frågor till kund eller partner: det som väntar på svar
- `read|write{op:"question_answer"}`: svara på en fråga: task + question (momentet), answer «ja — …» eller «nej — …»
- `read|write{op:"step_edit"}`: ändra ett steg: task + step, layer here|customer|method, skip + reason, calendar {…}
- `read|write{op:"batch_actions"}`: handlingstabellen: varje handling med allvar och om den går i en batch
- `read|write{op:"batch_apply"}`: en handling på flera: action, items [{ task, step|node }], params; ■ en i taget efter förhandsvisning