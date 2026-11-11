# Guide: tools
- `search`: find tasks, moments and deliveries; each hit has an `on` for `read`.
- `read`: one subject's envelope with `rev`; `view:"net"` adds the map; `on:{kind:"file",id}` gives a bank file's text in pages (`guide{phase:"verktyg:read"}`).
- `guide`: this text, by `phase`.
- `plan_state`: the overview of deliveries; `lens` `mine` (on me), `yes` (waits for my yes), `late`, `waiting` (on the customer); `customer`, `include`.
- `act`: the only way to do an action: `on`, `action`, `rev`, `params`, `preview_id`, `user_approval`, `batch`; action `undo` takes the last action back.
- `execute_step`: run a capability for a moment (`on`, `rev`, `params`, `test`); the result is always logged.
- `write`: define, append or draft a registry entry (`op`, `entry`, `fixes`); the gate lists what is missing.
- `upload`: the upload app for a customer (`customer`, `for_task`, `for_node`); only when the user wants to upload.

Steps
1. `search{q:[…]}` (one to five phrasings) or `plan_state{}` to find the subject.
2. `read{on}` to get the envelope and `rev`; `read{on, view:"net"}` for a task map (60 moments per page, follow `page.cursor`).
3. `act{on, action, rev}` for every action, `execute_step` to run a capability, `write` to define registry entries.
4. `guide{phase}` for details: moment, task, delivery, case, idea, envelope, severity, promptstandard, tools, routes; `map` for what can run here.

Example 1: `search{q:["offer","quote"]}` then `read{on:hit.on}`.
Example 2: `plan_state{lens:"mine"}` for what is on the person now; `plan_state{lens:"yes"}` for what waits for her yes.
Counterexample: calling a customer's system through another connector when this server has the capability.
Edge case: a legacy call shape (`asset_register`, `{tool,args}` wrapper) is translated while the adapter window is open; `say.now` shows the new form.
A file into the customer's file bank: `write` with `op` `file_add` and `name`, `text` or `base64` (+`mime`), `customer`, optionally `folder` and `asset_type`; with `task` and `moment` it is also tied to that moment. Without a task it is the customer's alone. v1's `asset_register` with `text` or `base64` becomes this call.
A bug report about dirigenten: `write{op:"bug_report", text, where?, screenshot?}` (●, a png as base64 after the person has seen it). People in the house list the open ones with `read{op:"bug_report"}` and mark one fixed with `write{op:"bug_report", resolve, note}` (●).
Upload app: `upload{customer, for_task?, for_node?}` (only when the user wants to upload; `read{op:"upload_link"}` gives the link alone) gives a page where the user drops one or more files; they go straight to the file bank (never base64). Then offer «Ska jag föreslå var filerna hör hemma?» and, after a yes to the shown proposal, tie each with `act attach_file` (from_ref).

v1's own tools, as `read{op, …}` or `write{op, …}` with v1's fields; `guide{phase:"verktyg:<op>"}` gives an op's fields from the schema the write is checked against, and a field it does not have is refused with a template. Severity from the policy, ■ needs `user_approval`:
- `read{op:"plan_estimate"}`: uppskatta en plan
- `read{op:"presentation_draft"}`: presentationens utkast
- `read{op:"project_brief"}`: projektets brief
- `write{op:"project_brief_save"}`: spara projektets brief
- `read{op:"library_search"}`: sök i biblioteket
- `read{op:"library_check"}`: kontrollera biblioteket
- `read{op:"library_debt"}`: bibliotekets skuld
- `read{op:"measure_debt"}`: mät skuld
- `read{op:"classify_propose"}`: förslag på klassning
- `read{op:"intake_status"}`: kön: queue: true, format kort|full; övriga lägen (thread, image, pending, candidates, trial) är v2:s egna
- `write{op:"classify_accept"}`: flytta inkommet dit det hör: thread, classification.route.to
- `read{op:"view_file"}`: vyns ark: sheet delivery|calendar|how|library|method|order …; utan sheet: for page|version (vyns sida och stämpel) eller personens egen vyadress
- `read{op:"quick_actions"}`: snabbhandlingarna per kund; med ref: uppdragen filen kan kopplas till
- `write{op:"mail_draft"}`: mejl som utkast i din egen e-post, bilagor som ref ur filbanken: values { to, subject, body, cc?, attachments: [ref], reply_to? }; to och cc är adresser eller husets personer som part-id, upplösta till sin adress; reply_to är Gmails meddelande- eller tråd-id för mejlet som besvaras, så hamnar utkastet i den tråden (ämnet blir «Re: …» utan subject); förhandsvisning först (■), sedan användarens ja ordagrant; personen skickar själv från sin e-post. Aldrig mejlet bara i chatten eller via en annan e-postkoppling i Claude (den bifogar inga filer). Saknas en rätt: säg vilken och vem som ordnar den, med svarets ord, och erbjud guidning i Chrome. Kontroll: search { q: ["Kontrollera kopplingen för mejl"] } och kör den med read { op: "read_call" }
- `read{op:"handovers"}`: överlämningar och väntan per leverans: agenda true, format oversikt
- `read{op:"order_preview"}`: förhandsvisa en beställning: samma fält som när den läggs in, inget skrivs
- `write{op:"intake_order"}`: lägg in en beställning: kund, leveranstyp, datum, vem som beställt; blir ett uppdrag
v1's step tools, with v1's fields, done on v2's moments through read, act or plan_state (severity and yes as there):
- `read|write{op:"content_search"}`: sök i innehållsbanken: query, customer?, limit?
- `read|write{op:"content_list"}`: lista innehåll med läge (utkast, godkänd, publicerad): customer?, kind?, status?
- `read|write{op:"save"}`: spara en text, fil eller länk (●, med ångra; stoppar bara av rättighet eller personuppgifter): text|base64|url, mime?, name?, what?, about? (vilken sida eller «kunden»), customer|task, moment?, folder?, kind? (v1:s sort), as_file? (en text som är en fil), chunk?; fälten står direkt i anropet, inte i entry; vad det är och namnet läses ur innehållet; ångra med svarets undo (hela, alla versioner) eller result.undo_latest (bara senaste versionen), båda ● för egen färsk sparning
- `read|write{op:"content_approve"}`: godkänn senaste versionen av en text i banken: id, user_approval (personens ord); decline (vad som ska ändras) eller withdraw
- `read|write{op:"asset_copy"}`: lägg en fil ur filbanken i en mapp: from_ref, folder, valfritt filename, customer; samma fil, kopplingarna står kvar
- `read|write{op:"file_remove"}`: ta bort en fil ur filbanken (■): from_ref, reason (skälet krävs); först en förhandsvisning, sedan samma anrop med preview_id från svaret och user_approval (personens ord ordagrant); filen går att lägga tillbaka; only_latest: true tar bara en texts senaste version; egen färsk sparning (save) tas bort direkt (●)
- `read|write{op:"material_backfill"}`: fyll i vad det är och vad det gäller för allt som sparats innan save läste det (◐): valfritt customer; först en förhandsvisning grupperad per mönster, sedan samma anrop med preview_id och user_approval (personens ord); inget innehåll ändras, och allt ångras på en gång; före ifyllnaden läses samma uppgifter vid sökning, utom det som bara textens brödtext avgör (till exempel sidan som bara står i rubriken)
- `read|write{op:"material_backfill_undo"}`: ångra en ifyllnad av uppgifter om sparat material, hela på en gång: batch (ur svaret)
- `read|write{op:"file_restore"}`: lägg tillbaka en borttagen fil i filbanken: from_ref (filens ref, namn eller kontrollsumma), valfritt reason
- `read|write{op:"upload_link"}`: uppladdningssidan för en kund: customer, valfritt for_task och for_node (momentet), folder; fler filer på en gång
- `read|write{op:"image_picker"}`: bildväljaren: mode sources|search|prompt; customer eller content; source, q, page, formats, text_area, channel
- `read|write{op:"image_target"}`: bildväljarens mål: pick_image { task, ref }
- `read|write{op:"find_file"}`: hitta en fil, text eller länk: q (vad du letar efter, i vardagsord), customer?, task?, moment?, sort? (rapport, bild, annons, länk …); varje träff säger vad, var och länken
- `read|write{op:"content_graph"}`: innehållsgrafen med besluten pålagda och kontrollens fynd: graph_id (eller customer för att lista kundens grafer), valfritt node (bara fynden för den delen); svaret har delarna med sina textfält och besluten med ångra
- `read|write{op:"content_graph_save"}`: spara en genererad innehållsgraf: customer, profile (site eller report), graph { nodes, sequences }, valfritt components, platform, symbols, image_language, customer_profile och graph_id (samma id = ny generering; besluten står kvar)
- `read|write{op:"content_graph_edit"}`: ändra en text i innehållsgrafen (●, sparas direkt som beslut med ångra): graph_id, node, path (ett av profilens textfält, t.ex. data.heading), value, valfritt words; ett annat fält (ordning, komponent, bild) bara med words, personens egna ord; rättar du ett fynd själv: fixes (kontrollens namn), så står det i beslutet att Claude rättade
- `read|write{op:"content_graph_undo"}`: ångra ett beslut i innehållsgrafen: graph_id, decision
- `read|write{op:"content_graph_import"}`: för in en innehållsgraf gjord utanför dirigenten (■): customer, task, valfritt outcome, result (kontraktets resultat), generated, profile { facts }, events; först en förhandsvisning av vad som skrivs och skrivs över, sedan samma anrop med preview_id och user_approval (personens ord); går att ångra
- `read|write{op:"content_graph_import_undo"}`: ångra en införsel av en innehållsgraf: graph_id
- `read|write{op:"content_graph_block"}`: hela block eller sidor i innehållsgrafen, som beslut med ångra (content_graph_undo): action add (page, after, type page|block, component, role, heading, body; ●), move (node, direction up|down; ●) eller remove (node; ◐, först en förhandsvisning av vad som slutar gälla, sedan preview_id och user_approval)
- `read|write{op:"content_graph_menu"}`: webbplatsens navigering (menyn, knappar som alltid syns, sidfoten), som beslut med ångra: action add (page, label, place menu|always|footer, under för undermeny, column för megamenyns kolumn; ●), move (item, direction up|down; ●) eller remove (item; ◐, först vad som slutar gälla)
- `read|write{op:"content_graph_markdown"}`: innehållet som markdown att lämna ut för redigering utanför dirigenten, med varje dels id i en dold kommentar: graph_id
- `read|write{op:"content_graph_markdown_save"}`: läs in markdown som redigerats utanför dirigenten (◐): graph_id, markdown, by (den som skrev); ändrade rubriker och texter, ny ordning, rubrikerna «Nytt block» och «Ta bort» blir beslut med ångra; först en förhandsvisning, sedan preview_id och user_approval
- `read|write{op:"planning"}`: planeringen av ett uppdrag, sparad i dirigenten: task, valfritt full; först överlämningen (var vi står, det som återstår, nästa beslut med förslag, frågor och det som inte får tappas), sedan resonemanget kort och nästa steg
- `read|write{op:"planning_note"}`: spara ett resonemang i planeringen (●, läggs till, ändras aldrig): task, kind (decision, choice, deferred, assumption, requirement, concern), what, why; decision, choice och deferred tas bara emot med alternatives [{ option, why_not }]; valfritt assumptions, sources [{ ref, what }], words (personens egna ord ordagrant), milestones, remaining_milestones (det som återstår att planera), rev; svaret har överlämningen som servern räknat fram och påminner om det som inte får tappas
- `read|write{op:"planning_pause"}`: spara en sammanfattning direkt när personen säger «vi tar det sen», «pausa» eller byter ämne (●): task, valfritt summary (med personens ord) och remaining_milestones; överlämningen räknar servern fram
- `read|write{op:"planning_done"}`: planeringen är klar (●): task
- `read|write{op:"planning_delegate"}`: lägg ett delbeslut i planeringen hos rätt person, som eget steg med förslag (●): task, what, why, to (roll eller person), proposal, valfritt milestones (delmålen som väntar på beslutet); skickar du rev och någon hann före visas vad som ändrats
- `read|write{op:"planning_answer"}`: besvara ett delbeslut i planeringen (●): task, choice (numret), answer (förvalt förslaget), reason (skälet), user_approval (personens egna ord); sedan fortsätter planeringen
- `read|write{op:"content_graph_link"}`: koppla material eller ett moment till en del av innehållsgrafen (●, med ångra): graph_id, node, task, ref eller moment; ångra med undoes
- `read|write{op:"tidy"}`: städa ett uppdrag: task; det som följer av bevis (momentets resultat finns och nästa moment har börjat) markeras klart direkt med ångra, resten kommer som grupperade frågor att säga ja till med act tidy_apply (items, digest); ångra med act undo_tidy_apply
- `read|write{op:"delivery_material"}`: leveransens material och saker: task (whole: true för hela leveransen) eller delivery
- `read|write{op:"mail_draft"}`: mejl som utkast i din egen e-post, bilagor som ref ur filbanken: values { to, subject, body, cc?, attachments: [ref], reply_to? }; to och cc är adresser eller husets personer som part-id, upplösta till sin adress; reply_to är Gmails meddelande- eller tråd-id för mejlet som besvaras, så hamnar utkastet i den tråden (ämnet blir «Re: …» utan subject); förhandsvisning först (■), sedan användarens ja ordagrant; personen skickar själv från sin e-post. Aldrig mejlet bara i chatten eller via en annan e-postkoppling i Claude (den bifogar inga filer). Saknas en rätt: säg vilken och vem som ordnar den, med svarets ord, och erbjud guidning i Chrome. Kontroll: search { q: ["Kontrollera kopplingen för mejl"] } och kör den med read { op: "read_call" }
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
- `read|write{op:"inbox_sheet"}`: Inkommet: kön och varje tråds öde, utan ämne och avsändare (60 dagar)
- `read|write{op:"intake_submit"}`: ta emot kandidater: candidates [...]; undo: kandidaten drar tillbaka den; release: släpper fram en som hålls; fetch läser brevlådan
- `read|write{op:"intake_order"}`: lägg in en beställning: customer, deliverable_type, due, ordered_by, note, description; preview: true visar den utan att skriva; finns en likadan öppen i dag används den, create_new: true lägger in en ny
- `read|write{op:"quick_run"}`: kör en snabbhandling: task (uppdraget) eller values.delivery ger act run_quick på uppdraget; utan dem läses en förmåga som bara läser direkt för customer (även execute_step { call, customer, values }, utan steg), och annars blir det först ett uppdrag (customer, deliverable_type ur förmågans yta, due)
- `read|write{op:"image_fetch"}`: bild ur en extern källa: for_task, for_node (momentet), provenance { source, source_id }, filename, asset_type; Adobe Stock är ■
- `read|write{op:"note_link"}`: notera en koppling i kundens system: task, customer, from, relation, to, why
- `read|write{op:"time_report"}`: rapportera verklig tid: task + step (momentet) eller task, hours, phase, date, party; corrects rättar en rapport
- `read|write{op:"presentation_text"}`: spara presentationens texter: delivery, texts [{ key, field title|lead|caption, ref?, text, source? }]
- `read|write{op:"content_published"}`: markera publicerat: task + step/node (momentet), channel, channel_id, url, id (texten); ■ med förhandsvisning
- `read|write{op:"content_get"}`: en text eller fil ur banken: ref, id eller name (namnet räcker)
- `read|write{op:"asset_get"}`: en fil ur banken: ref, id eller name (namnet räcker); thumb för miniatyren
- `read|write{op:"content_save"}`: spara text: markdown, customer, kind, name; for_task? (uppdrag), for_step? (moment), fields?, images?; utan for_step väljer servern plats
- `read|write{op:"view_file"}`: vyns ark: sheet library och how (v2:s egna), delivery|calendar|method|order …
- `read|write{op:"to_approve"}`: att godkänna: per text vad, uppdrag, vem och när, förhandsvisning, länk, skillnad mot förra godkända och vad ett ja släpper; task för ett uppdrag
- `read|write{op:"settings"}`: inställningarna: kopplingar, arbetsdag och för en superadmin vem som har vilka rättigheter
- `read|write{op:"method_build"}`: nytt eller ändrat arbetssätt: method + draft (metodbyggaren) eller from_plan { label, steps [{ label, type }] }; förhandsvisning först
- `read|write{op:"registry_define"}`: ändra en post: node { id, … } med change: true (arbetssätt, delmål, moment, förmåga, eller v1:s steg och molekyl), eller en ny förmåga; förhandsvisning först
- `read|write{op:"how_customer"}`: kundens sätt: patch { variant (kunden), step (momentet), set { responsible | values } }; förhandsvisning först
- `read|write{op:"method_variant_build"}`: kundens sätt: patch { variant, step, set } eller responsible/approver/values/instruktion/prompt_addition per steg; förhandsvisning först
- `read|write{op:"step_layer_call"}`: anropet för kundens sätt eller metoden: task, step, layer customer|method, prompt, prompt_addition, checklist
- `read|write{op:"read_call"}`: läs med en del: call, args, hitta (Ny beställning: ett mötes slutsatser)
- `read|write{op:"delivery_sheet"}`: leveransens sida: tasks (uppdragen), räknad i servern
- `read|write{op:"step_card"}`: stegets ark: task, step (momentets nyckel)
- `read|write{op:"batch_apply"}`: en handling på flera: action, items [{ task, step|node }], params; ■ en i taget efter förhandsvisning
v1's ops that v2 now does itself, with v1's names and fields (severity and yes as above):
- `read{op:"messages"}`: meddelandena som trådar med läget i ord och antal per flik; since (ÅÅÅÅ-MM-DD) läser längre bak
- `write{op:"message"}`: meddelande till en eller flera kollegor: to (namn, mejladress eller id), text, about { task?, step?, thread? }, reply_to; read (id) markerar läst; resolve (id) + note?, scope «thread», undo: true; review + answer för second opinion
- `write{op:"message_mark"}`: arkivera meddelanden: sent (id), archived true döljer, false tar tillbaka; bara för den som gör det