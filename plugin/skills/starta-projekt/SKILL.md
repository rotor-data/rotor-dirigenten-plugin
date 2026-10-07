---
name: starta-projekt
description: "Turn a loose request, a short brief or a large pasted body of material into a dirigenten project that is ready to run: talk it through with the user in short rounds (draft to correct, never only questions), then build deliveries, parts, methods and Claude instructions through the rotor-dirigenten connector, review it part by part with the user and write it in. Also resumes a paused review (\"fortsätt genomgången\") and replans running work (\"planera om\"). Use when someone wants something done that spans several steps — \"vi ska göra…\", \"kan vi ta fram…\", \"planera…\", \"här är underlaget\", \"nytt jobb\", \"offert\", \"kampanj till …\", \"kan ni hjälpa oss med\", \"förfrågan\", \"beställning\", a pasted order, brief, meeting notes or customer email, or an order dirigenten sent to project start — with or without a customer, even when the word project is never said. Not for a single quick task, a question about what is planned (use dirigenten), or time planning of an existing delivery (prompt «Planera projektet»)."
---

<!-- Genereras ur src/plan/start-project.ts med npm run gen:skills. Ändra där, inte här. -->

# Starta projekt

Ta en beställning eller ett underlag till ett projekt som bara är att sätta igång: allt som behövs finns, det mesta går av sig självt, varje Claude-instruktion är fullständig och behåller underlagets nyanser, och det som saknas är beskrivet så att någon kan ta fram det utan att fråga.

Prata med användaren på vanlig svenska om arbetet, aldrig om dirigentens modell. Allt i dirigenten görs genom kopplingen rotor-dirigenten.

## Läs först
- Gäller samtalet ett projekt som redan är sparat: read { op: "project_brief", project } (utan project: projekten) först, och fortsätt där det slutade — svaret säger var genomgången står och vad som ändrats sedan en del godkändes
- search med kundens namn och 2–3 formuleringar av beställningen: kunden, det som redan pågår hos kunden och liknande som gjorts förut
- read { op: "context" } på det sökningen pekar på, om beställningen gäller något som redan pågår
- guide { topic: "plan_and_move" } och guide { topic: "write_and_sharpen_prompts" } första gången i samtalet

## 1. Ta emot
1. Spara allt som klistrats in, bifogats eller länkats oförändrat som material innan något annat görs: för en kund med write { op: "content_save" } och filer med asset_register; för Rotors eget projekt eller en idé, som inte har någon kund, på projektet självt med write { op: "project_brief_save", label, mode, materials: [{ label, text }] } (svaret ger underlagets id; samma projekt får briefen efter ja).
2. Gör en förteckning: en rad per påstående i underlaget — krav, önskemål, fakta, ton, förbud, öppen fråga (kind: requirement, wish, fact, tone, prohibition, open_question) — med var det står (source: material och ställe). Kundens egna ord citeras ordagrant (quote). Förteckningen sparas med briefen efter ja.
3. Säg bara «Jag har sparat underlaget» till användaren.

## 2. Planera om något som redan pågår
1. Gäller det arbete som redan pågår — «planera om», «lägga om», «researchen har kommit längre», nya steg eller färre i något som redan är igång — börja inte från ett tomt projekt: läs in det först med write { op: "project_brief_save", from_delivery: <namnet eller id:t> }. Det gör ett projekt där varje uppdrag är en del och varje steg står med vad som är gjort, och där allt arbete som redan finns (utkast i alla versioner, filer, rapporter per spår, anteckningar, frågor och svar) står per steg med datum och vem.
2. Säg först vad som är gjort och står kvar, med utkasten och filerna uppräknade som svaret visar dem, och vad som återstår. Planen utgår från det, inte från hur arbetet var tänkt.
3. Kör sedan varven som vanligt: förslaget att rätta i, ändringar, nya steg och nya delar. Ett gjort steg står kvar som det är; det enda som får läggas till är en anteckning (steps: [{ id, note }]). Ett steg med utkast eller som är påbörjat får flyttas och ändras inom sitt uppdrag men inte tas bort, och utkasten står kvar.
4. Ändra det som inte är gjort som i varje genomgång: vem, datum och timmar (steps: [{ id, performer, start, end, hours }]), vad ett steg väntar på (steps: [{ id, waits_on: [<steg i delen>] }]), receptet eller instruktionen (gäller bara det här uppdraget), metoden för en del (parts: [{ id, method }]; går inte när något gjort eller med utkast saknas i den nya metoden), flytta en del (move), och dela upp, slå ihop eller flytta steg mellan delar — utkasten följer steget. Avvisas ett anrop säger svaret vilken del och vilket fält; inget i det är sparat, så skicka om resten.
5. Ett steg som inte är påbörjat tas bort med skäl: steps: [{ id, remove: true, reason }]. En del utan gjort arbete stryks med skäl (parts: [{ id, struck: { reason } }]); uppdraget avbryts vid inskrivningen. En ny del blir ett nytt uppdrag bredvid de andra.
6. Genomgången och inskrivningen går som vanligt. Förhandsvisningen säger vad som står kvar, ändras, tas bort med skäl och läggs till; visa den som den står. Ångra går så länge inget nytt eller ändrat steg har startat, och tar tillbaka allt utom det gjorda, som aldrig rörts.

## 3. Förstå och föreslå, i varv med användaren
1. Pausa aldrig tomhänt: varje varv lämnar ett förslag att rätta i, aldrig bara frågor eller en invändning.
2. Första varvet högst ungefär 200 ord: en rad om vad projektet ska användas till och vad som står på spel; högst fem punkter som är beslut, inte förslag — vad du valt, vad alternativet var och varför i en bisats, så att varje punkt kan besvaras med ja, nej eller «ta det andra»; en rad med antagandena om syfte, mottagare och ambition; sist «säg kör direkt så bygger jag projektet med en gång».
3. Fyll luckor med egna slutsatser och skäl i stället för att fråga. Föreslå också det som inte står i underlaget: steg som brukar behövas, risker, det som kan göras samtidigt.
4. Fråga högst tre saker per varv, och bara det du inte kan sluta dig till och som ändrar mycket: pengar, kundens medverkan, något som lämnar huset, något som inte går att ångra.
5. Ordningen i varven: först innehållet (mål, mottagare — en kund, Rotor själv eller bara en idé än —, avgränsning, vad som har stöd i underlaget och inte, vad som medvetet lämnas utanför), sedan uppdelningen, formen sist och osynligt.
6. Varje del bär ett påstående om vad den åstadkommer och minst en tydlig handling (verb + vad). En del utan påstående eller handling ska bort, inte fyllas ut.
7. Splittra inte mer än nödvändigt. Samma arbete med flera resultat är en del med flera utfall (en fotografering som ger tre sorters bilder är ett arbete). Dela bara med utskrivet skäl: olika utförare, ett beslut emellan, eller att den ena väntar på den andras resultat. Det som görs i samma veva blir ett steg med flera utfall.
8. När något ska avgöras först (utredas, beslutas, testas): gör det till en beslutspunkt med alternativen och vad varje alternativ utlöser. Det som kommer efter står som skiss med rubrik och mål och detaljplaneras när beslutet fattats.
9. Ett projekt utan kund sparas utan customer, på ett av två sätt. mode: "internal" när det är Rotors eget arbete som ska göras — också när något går ut med Rotor som avsändare, som ett nyhetsbrev till Rotors kunder eller ett lanseringsmejl. mode: "possible" när det bara är en idé som ska prövas: då går inget till någon utanför Rotor. En idé som blir av byter till internal (mode: "internal") eller får en kund (to_delivery). Inget av dem har ett datum lovat till en kund (brief.due); Rotors eget måldatum står i brief.internal_due, och due tas bort med null.
10. Till användaren heter det «en idé», «Rotors eget» eller «för kunden» — aldrig fältens namn eller värden.
11. Användaren rättar med egna ord, stryker eller klistrar in mer: för in det, säg vad som ändrats och vad som nu antas, visa nästa varv.
12. Blir förslaget längre än ett par skärmar: lägg briefen i ett eget dokument och låt chatten bära punkterna.
13. Ja till briefen → spara den med write { op: "project_brief_save" }: label, customer (utelämna för Rotors eget och för en idé, och ange mode), brief (goal, recipient, scope, due eller internal_due), hela förteckningen och antagandena (text, reason, confirmed). Svaret är kort: projektets id, id på det som ändrades (behåll dem), täckningen och det som återstår; hela projektet bara med format: "full". Inget annat sparas före detta ja (utom underlaget i första fasen).
14. Det användaren berättar under arbetet som är nytt i sak — ett testresultat, en siffra, ett besked från kunden, ett nytt förbud — blir nya rader i förteckningen (write { op: "project_brief_save", project, inventory }) med källan «samtalet» och datumet, och placeras som de andra.
15. En liten beställning med klart innehåll går direkt till uppdelningen, med antagandena utskrivna.

## 4. Bryta ner och bygga
1. Per del: sök metod, steg, anrop och atom med minst två formuleringar. Återanvänd, gör en variant för kunden, bygg nytt — i den ordningen.
2. Bygg en metod bara för det som återkommer: samma sorts arbete som görs igen, för den här kunden eller andra. Det som görs en gång stannar som steg med recept och instruktioner i projektet (parts), utan metod. Är du osäker: ett arbete som redan finns i registret i liknande form återkommer.
3. Bygg med write { op: "method_build", from_plan }: planen i klartext, en rad per steg med typ (människa, Claude, kod). Det som saknar atom blir atomförslag; hitta aldrig på något körbart.
4. En metod slutar vid ett beslut: utfallen som leder till skisser är inte metodens slut och hör inte hemma i metoden (bygget av metoden stoppas på beslutsutfall). Beslutet och skisserna står i projektet; när beslutet är fattat byggs metoden för den valda grenen, om den återkommer.
5. Pröva automationen i ordningen koppling, API, annat, människa.
6. Förhandsvisa, rätta det grinden säger, spara efter ja.
7. Spara delarna på projektet med write { op: "project_brief_save", project, parts }: per del label, claim (vad den åstadkommer), actions (verb + vad), outcomes; per steg label, type (human, llm, code), performer, ref (steget i registret när det är byggt) och leaves_house: true på det som skickar eller publicerar utåt. En beslutspunkt är en egen del med decision: { question, decides, options: [{ label, triggers }] }; det som beror på beslutet är skisser: label, claim, troliga steg som actions och sketch: { decision, option }. Delar eller steg som är samma arbete får samma work, och split_reason när de ändå delas.

## 5. Skärpa instruktionerna
1. Varje Claude-steg får alla sex delar (purpose, read_first, how_to, must_not, answer_format, ask_when); varje människosteg sitt recept (Vad behövs, Så gör du 1. 2. 3., Kontrollera).
2. Gå igenom förteckningen rad för rad: varje rad ska ha landat i en instruktion, ett krav, en fråga, ett beslut — eller vara struken med skäl. Skriv det med write { op: "project_brief_save", project, inventory: [{ id, placed: [{ in, ref }] }] } eller struck: { reason }. Täckningen räknas av read { op: "project_brief", project }; placera det som står kvar.
3. Ton, förbud och kundens ord citeras i instruktionen, inte omformulerade.
4. Obekräftat markeras (?) där det används och stoppar inget.

## 6. Tid
1. När beslutet fattas: write { op: "project_brief_save", project, decide: { part, option, reason } }. Den valda grenens skisser märks som valda och kontrolleras fullt ut: bryt ner dem i steg med utförare, recept och instruktioner (bryta ner, skärpa) innan de körs; de andra grenarna stryks med skäl av sig själva.
2. När en idé eller Rotors eget projekt får en kund: write { op: "project_brief_save", project, to_delivery: { customer } }. Kör sedan varven i fas 2 igen mot kunden: pröva varje antagande och bekräfta det (confirmed: true) eller rätta det.
3. Varje ändring förhandsvisas med vad den gör i klartext; visa den texten för användaren som den står innan du skickar ja.
4. Planera tiden med arbetssättet i prompten «Planera projektet»: en del i taget, plan_state { delivery, format: "plan" }, förhandsvisning med execute_step { plan }.

## 7. Klart att köra
1. Spara det som saknas med write { op: "project_brief_save", project, missing } (what, why, how: { kind: link, prompt, recipe eller draft_message, content }, who, when: { date eller step }). En lucka utan vad, hur eller när avvisas.
2. Kör read { op: "project_brief", project }. Kontrollen räknar alla delar utom skisser vars beslut inte är fattat: utförare, full instruktion eller recept, det som går till någon utanför Rotor, varje del har en handling, varje uppdelning har ett skäl, förteckningen är täckt, luckorna är beskrivna. Räkna inte själv: åtgärda det som står i remaining och kör igen tills listan är tom, eller visa det som återstår för användaren som det står.
3. Berätta projektet som en berättelse: vad som händer, vem, när, och vad användaren behöver säga ja till. Sist det som saknas.

## 8. Genomgången före inskrivningen
1. När projektet är klart att köra går ni igenom det tillsammans innan det skrivs in, en del i taget i den här ordningen: 1 Helheten, 2 Del för del, 3 Recepten, 4 Luckor och antaganden, 5 Belastningen, 6 Skriv in. Hämta delen med read { op: "project_brief", project, review: <1–6> }.
2. Visa varje del kort, med det du vill ändra som beslut att svara ja eller nej på (samma form som i varven). Efter ja: write { op: "project_brief_save", project, review: [{ part, status: "approved", note }] }. Godkända delar ligger kvar när samtalet pausas.
3. Börja varje nytt samtal om projektet med read { op: "project_brief", project } och fortsätt med delen i review.next. Gå inte igenom en godkänd del igen, utom när svaret säger att den ändrats eller öppnats igen — då står skälet där.
4. Helheten: vad som görs, för vem, när det sista är klart och timmarna per person. Mål, mottagare och datum ändras med brief. Planeras något som redan pågår om står det som redan är gjort här, med utkasten: visa det först.
5. Del för del: varje del med steg, vem som gör dem, datum och timmar. Ändra direkt: steps: [{ id, performer, start, end, hours }], { id, remove: true } eller ett nytt steg { part, label, type, … }; move: { part, start } (stegen efter följer med); merge: { parts, label }; split: { part, steps, label, reason } — en del delas bara med ett utskrivet skäl. Metoden byts med method på delen. Varje ändring förhandsvisas: visa vad den gör innan du skickar ja.
6. Recepten: läs varje recept i svaret, inte bara de flaggade. Flaggorna (tunt, vagt, kod) är en början; bedöm resten själv — varje punkt i Så gör du har ett verb och vad, inga kommandon, filnamn eller id, och Kontrollera går att pröva. Skriv om det som behövs, visa före och efter, och spara efter ja med stegets next_calls på den smalaste nivån: project för ett steg som bara finns i projektet; för ett byggt steg customer_way när ändringen bara gäller den här kunden, annars method.
7. Luckor och antaganden: för var och en — bekräfta, ge ansvarig och datum, eller stryk med skäl (next_calls confirm, assign, strike).
8. Belastningen: visa krockarna per person och vecka med förslagen, och välj med användaren att flytta, lämna över eller välja bort. Korta aldrig ett steg för att det ska rymmas.
9. En ändring kan öppna en tidigare del igen (en ny ansvarig öppnar belastningen). Gå tillbaka dit innan ni skriver in.
10. Skriv in först när del 1–5 är godkända och användaren sagt ja till hela genomgången: write { op: "project_brief_save", project, write_in: true } ger förhandsvisningen; visa den och skicka nästa anrop efter ja. Visa svaret som det står: det som skapades, med länken, och det som inte skrevs in med skälet.
11. Ångra hela inskrivningen, så länge inget steg har startat: write { op: "project_brief_save", project, undo_write_in: { reason } }. Därefter ändras uppdragen som andra uppdrag.
12. Pausar användaren: säg vilken del ni är på och att det godkända ligger kvar.

## När något saknas
- Exakt vad: det konkreta — filen, siffran, inloggningen, beslutet — inte kategorin.
- Varför: vilket steg det stoppar och vad du gör under tiden (fortsätt på antagande där det går).
- Exakt hur, ett av: en länk dit det finns eller görs; en färdig prompt att klistra in (till Claude, en kollega eller kunden) som går att förstå utan sammanhanget; en stegvis instruktion (Vad behövs, Så gör du 1. 2. 3., Kontrollera); ett färdigt mejl eller meddelande, som skickas först efter ja.
- Vem som troligen har det och när det behövs, räknat ur steget det stoppar.
- Saknar dirigenten en förmåga: skriv atomförslaget själv och säg till användaren bara «det här kan dirigenten inte än, det byggs», plus hur det görs för hand under tiden, som stegvis instruktion.

## Gör inte
- svara med bara frågor eller en invändning
- fråga om sådant du kan dra en slutsats om
- bygga, spara eller skriva i registret innan briefen fått ja (utom underlaget i första fasen)
- dela upp ett arbete utan utskrivet skäl
- omformulera kundens ord, ton eller förbud i en instruktion
- förklara hur dirigenten fungerar, eller visa id, verktygsnamn, nodnamn eller orden atom, molekyl, metod, variant och grind för användaren
- kalla projektet möjligt, en leverans eller ett läge inför användaren — säg en idé, Rotors eget eller för kunden
- säga att något saknas utan exakt vad, hur och när
- skriva in projektet innan genomgången är godkänd och användaren sagt ja, eller korta ett steg för att belastningen ska gå ihop
- ta bort, tömma eller byta namn på det som redan är gjort när något planeras om, eller börja om från ett tomt projekt när det finns pågående arbete att utgå från
- hitta på en atom eller ett anrop som inte finns

## Svaret
Svenska, kort, det viktigaste först. Varven i fas 2: rad om sammanhanget, högst fem beslutspunkter, en rad antaganden, genvägen «kör direkt». Därefter projektet som berättelse, antagandena som lista, och sist det som saknas med vad, varför, hur, vem och när. I genomgången: en del per svar, med ändringarna som ja/nej-beslut och var ni är (del n av 6).

## Fråga bara när
- det gäller pengar, kundens medverkan, något som lämnar huset eller något som inte går att ångra, och du inte kan sluta dig till svaret
- underlaget inte räcker ens till ett förslag — säg då exakt vad som saknas och hur det tas fram
