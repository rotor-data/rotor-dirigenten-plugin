# Guide: tools
- `search`: find tasks, moments and deliveries; each hit has an `on` for `read`.
- `read`: one subject's envelope with `rev`; `view:"net"` adds the map; `on:{kind:"file",id}` gives a bank file's text in pages (`guide{phase:"verktyg:read"}`).
- `guide`: this text, by `phase`.
- `plan_state`: the overview of deliveries (`agenda`, `include`).
- `act`: the only way to do an action: `on`, `action`, `rev`, `params`, `preview_id`, `user_approval`, `batch`; action `undo` takes the last action back.
- `execute_step`: run a capability for a moment (`on`, `rev`, `params`, `test`); the result is always logged.
- `write`: define, append or draft a registry entry (`op`, `entry`, `fixes`); the gate lists what is missing.
- `upload`: the upload app for a customer (`customer`, `for_task`, `for_node`); only when the user wants to upload.

Steps
1. `search{q:[…]}` (one to five phrasings) or `plan_state{}` to find the subject.
2. `read{on}` to get the envelope and `rev`; `read{on, view:"net"}` for a task map (60 moments per page, follow `page.cursor`).
3. `act{on, action, rev}` for every action, `execute_step` to run a capability, `write` to define registry entries.
4. `guide{phase}` for details: moment, task, delivery, case, idea, envelope, severity, promptstandard, tools.

Example 1: `search{q:["offer","quote"]}` then `read{on:hit.on}`.
Example 2: `plan_state{agenda:true}` for what is due, ordered by urgency, then end date.
Counterexample: calling a customer's system through another connector when this server has the capability.
Edge case: a legacy call shape (`asset_register`, `{tool,args}` wrapper) is translated while the adapter window is open; `say.now` shows the new form.
A file into the customer's file bank: `write` with `op` `file_add` and `name`, `text` or `base64` (+`mime`), `customer`, optionally `folder` and `asset_type`; with `task` and `moment` it is also tied to that moment. Without a task it is the customer's alone. v1's `asset_register` with `text` or `base64` becomes this call.
Upload app: `upload{customer, for_task?, for_node?}` (only when the user wants to upload; `read{op:"upload_link"}` gives the link alone) gives a page where the user drops one or more files; they go straight to the file bank (never base64). Then offer «Ska jag föreslå var filerna hör hemma?» and, after a yes to the shown proposal, tie each with `act attach_file` (from_ref).

v1's own tools, as `read{op, …}` or `write{op, …}` with v1's fields; `guide{phase:"verktyg:<op>"}` gives an op's fields from the schema the write is checked against, and a field it does not have is refused with a template. Severity from the policy, ■ needs `user_approval`:
- `write{op:"time_report"}`: rapportera verklig tid på ett steg eller ärende
- `write{op:"message"}`: meddelande till en kollega; read, resolve
- `write{op:"message_mark"}`: markera meddelanden
- `read{op:"image_picker"}`: bildväljaren: sources, search, prompt
- `read{op:"image_target"}`: bildväljarens mål: pick_image { task, ref }
- `read{op:"upload_link"}`: uppladdningssidan för en kund: customer, valfritt for_task och for_node (momentet), folder; fler filer på en gång
- `write{op:"image_fetch"}`: bild ur en extern källa: register + filename och provenance { source, source_id }
- `write{op:"bug_report"}`: felrapport: text, where, screenshot (png som base64) sparas av v2 (●); resolve, eller utan båda listan
- `write{op:"note_link"}`: anteckning med länk
- `read{op:"plan_estimate"}`: uppskatta en plan
- `read{op:"content_search"}`: sök i innehållsbanken
- `read{op:"content_list"}`: lista innehåll
- `write{op:"content_save"}`: spara text
- `write{op:"content_published"}`: markera publicerat
- `read{op:"presentation_draft"}`: presentationens utkast
- `read{op:"delivery_material"}`: leveransens material och saker: task (whole: true för hela leveransen) eller delivery
- `read{op:"step_layer_call"}`: anropet för kundens sätt eller metoden: task, step, layer customer|method, prompt, prompt_addition, checklist
- `write{op:"method_variant_build"}`: kundens sätt: patch, som step_layer_call gav
- `write{op:"registry_define"}`: ändra metoden eller en post i registret: change, node (step_layer_call eller metodbyggaren)
- `write{op:"presentation_text"}`: presentationens text
- `read{op:"project_brief"}`: projektets brief
- `write{op:"project_brief_save"}`: spara projektets brief
- `read{op:"library_search"}`: sök i biblioteket
- `read{op:"library_check"}`: kontrollera biblioteket
- `read{op:"library_debt"}`: bibliotekets skuld
- `read{op:"measure_debt"}`: mät skuld
- `read{op:"classify_propose"}`: förslag på klassning
- `read{op:"intake_status"}`: beställningens läge
- `read{op:"settings"}`: inställningarna: kopplingar, arbetsdag och för en superadmin vem som har vilka rättigheter
- `read{op:"messages"}`: meddelandena som trådar med läget i ord och antal per flik; since
- `read{op:"inbox_sheet"}`: Inkommet: kön och varje tråds öde, utan ämne och avsändare; days
- `write{op:"classify_accept"}`: flytta inkommet dit det hör: thread, classification.route.to
- `read{op:"view_start"}`: startsidan för en egen vy (några kB) och förmågorna den läggs ut med; vyns egen html ges aldrig
- `read{op:"view_file"}`: vyns ark: sheet delivery|calendar|how|library|method|order …
- `write{op:"how_customer"}`: kundens sätt: patch { variant, step, set { responsible | values } }
- `read{op:"quick_actions"}`: snabbhandlingarna per kund; med ref: uppdragen filen kan kopplas till
- `write{op:"quick_run"}`: kör en snabbhandling för en kund: call, customer, values; förhandsvisning först
- `read{op:"handovers"}`: överlämningar och väntan per leverans: agenda true, format oversikt
- `read{op:"order_preview"}`: förhandsvisa en beställning: samma fält som när den läggs in, inget skrivs
- `write{op:"method_build"}`: ny version av ett arbetssätt (metodbyggaren)
- `read{op:"read_call"}`: läs med en del: call, args (Ny beställning: ett mötes slutsatser)
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
- `read|write{op:"material"}`: materialet per moment: task + node (momentets grupper), task (hela leveransen), task + ref (en saks innehåll)
- `read|write{op:"files"}`: filbanken att bläddra i: customer, folder, q, order new|old|name, cursor; ref (en fils innehåll, thumb för miniatyren), ref + task (uppdragets moment att knyta till)
- `read|write{op:"project_brief_save"}`: spara projektets brief: project (uppdraget), brief { goal, recipient, scope, due, internal_due }
- `read|write{op:"intake_submit"}`: ta emot kandidater: candidates [...]; undo: kandidaten drar tillbaka den; release: släpper fram en som hålls; fetch läser brevlådan
- `read|write{op:"intake_order"}`: lägg in en beställning: customer, deliverable_type, due, ordered_by, note, description; preview: true visar den utan att skriva
- `read|write{op:"quick_run"}`: kör en snabbhandling: task (uppdraget) eller values.delivery ger act run_quick på uppdraget; utan dem läses en förmåga som bara läser direkt för customer (även execute_step { call, customer, values }, utan steg), och annars blir det först ett uppdrag (customer, deliverable_type ur förmågans yta, due)
- `read|write{op:"image_fetch"}`: bild ur en extern källa: for_task, for_node (momentet), provenance { source, source_id }, filename, asset_type; Adobe Stock är ■
- `read|write{op:"note_link"}`: notera en koppling i kundens system: task, customer, from, relation, to, why
- `read|write{op:"time_report"}`: rapportera verklig tid: task + step (momentet) eller task, hours, phase, date, party; corrects rättar en rapport
- `read|write{op:"presentation_text"}`: spara presentationens texter: delivery, texts [{ key, field title|lead|caption, ref?, text, source? }]
- `read|write{op:"content_published"}`: markera publicerat: task + step/node (momentet), channel, channel_id, url, id (texten); ■ med förhandsvisning
- `read|write{op:"content_get"}`: en text eller fil ur banken: ref, id eller name (namnet räcker)
- `read|write{op:"asset_get"}`: en fil ur banken: ref, id eller name (namnet räcker); thumb för miniatyren
- `read|write{op:"content_save"}`: spara text; utan for_step väljer servern plats
- `read|write{op:"delivery_sheet"}`: leveransens sida: tasks (uppdragen), räknad i servern
- `read|write{op:"step_card"}`: stegets ark: task, step (momentets nyckel)
- `read|write{op:"batch_apply"}`: en handling på flera: action, items [{ task, step|node }], params; ■ en i taget efter förhandsvisning