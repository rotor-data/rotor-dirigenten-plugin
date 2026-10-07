---
name: starta-projekt
description: "Turn a loose request, a short brief or a large pasted body of material into a dirigenten project that is ready to run: talk it through with the user in short rounds (draft to correct, never only questions), then build deliveries, parts, methods and Claude instructions through the rotor-dirigenten connector. Use when someone wants something done that spans several steps — \"vi ska göra…\", \"kan vi ta fram…\", \"planera…\", \"här är underlaget\", a pasted order, brief, meeting notes or customer email — with or without a customer, even when the word project is never said. Not for a single quick task, a question about what is planned (use dirigenten), or time planning of an existing delivery (prompt «Planera projektet»)."
---

<!-- Genereras ur src/plan/start-project.ts med npm run gen:skills. Ändra där, inte här. -->

# Starta projekt

Ta en beställning eller ett underlag till ett projekt som bara är att sätta igång: allt som behövs finns, så mycket som möjligt går av sig självt, varje Claude-instruktion är fullständig och behåller underlagets nyanser, och det som saknas är beskrivet så att någon kan ta fram det utan att fråga.

Prata med användaren på vanlig svenska om arbetet, aldrig om dirigentens modell. Allt i dirigenten görs genom kopplingen rotor-dirigenten.

## Läs först
- search med kundens namn och 2–3 formuleringar av beställningen: kunden, pågående leveranser och liknande som gjorts förut
- read { op: "context" } på det sökningen pekar på, om beställningen gäller något som redan pågår
- guide { topic: "plan_and_move" } och guide { topic: "write_and_sharpen_prompts" } första gången i samtalet

## 1. Ta emot
1. Spara allt som klistrats in, bifogats eller länkats oförändrat som material (write { op: "content_save" }, filer med asset_register) innan något annat görs.
2. Gör en förteckning: en rad per påstående i underlaget — krav, önskemål, fakta, ton, förbud, öppen fråga (kind: requirement, wish, fact, tone, prohibition, open_question) — med var det står (source: material och ställe). Kundens egna ord citeras ordagrant (quote). Förteckningen sparas med briefen efter ja.
3. Säg bara «Jag har sparat underlaget» till användaren.

## 2. Förstå och föreslå, i varv med användaren
1. Pausa aldrig tomhänt: varje varv lämnar ett förslag att rätta i, aldrig bara frågor eller en invändning.
2. Första varvet högst ungefär 200 ord: en rad om vad projektet ska användas till och vad som står på spel; högst fem punkter som är beslut, inte förslag — vad du valt, vad alternativet var och varför i en bisats, så att varje punkt kan besvaras med ja, nej eller «ta det andra»; en rad med antagandena om syfte, mottagare och ambition; sist «säg kör direkt så bygger jag projektet med en gång».
3. Fyll luckor med egna slutsatser och skäl i stället för att fråga. Föreslå också det som inte står i underlaget: steg som brukar behövas, risker, det som kan göras samtidigt.
4. Fråga högst tre saker per varv, och bara det du inte kan sluta dig till och som ändrar mycket: pengar, kundens medverkan, något som lämnar huset, något som inte går att ångra.
5. Ordningen i varven: först innehållet (mål, mottagare — kund, Rotor själv eller möjligt —, avgränsning, vad som har stöd i underlaget och inte, vad som medvetet lämnas utanför), sedan uppdelningen, formen sist och osynligt.
6. Varje del bär ett påstående om vad den åstadkommer och minst en tydlig handling (verb + vad). En del utan påstående eller handling ska bort, inte fyllas ut.
7. Splittra inte mer än nödvändigt. Samma arbete med flera resultat är en del med flera utfall (en fotografering som ger tre sorters bilder är ett arbete). Dela bara med utskrivet skäl: olika utförare, ett beslut emellan, eller att den ena väntar på den andras resultat. Det som görs i samma veva blir ett steg med flera utfall.
8. När något ska avgöras först (utredas, beslutas, testas): gör det till en beslutspunkt med alternativen och vad varje alternativ utlöser. Det som kommer efter står som skiss med rubrik och mål och detaljplaneras när beslutet fattats.
9. Ett projekt utan kund (Rotors eget, internt eller möjligt) sparas utan customer och blir möjligt: inget datum mot kund och inget som lämnar huset förrän det blivit en leverans.
10. Användaren rättar med egna ord, stryker eller klistrar in mer: för in det, säg vad som ändrats och vad som nu antas, visa nästa varv.
11. Blir förslaget längre än ett par skärmar: lägg briefen i ett eget dokument och låt chatten bära punkterna.
12. Ja till briefen → spara den med write { op: "project_brief_save" }: label, customer (utelämna för Rotors eget, internt eller möjligt), brief (goal, recipient, scope), hela förteckningen och antagandena (text, reason, confirmed). Svaret ger projektet och radernas id; behåll dem. Inget annat sparas före detta ja.
13. En liten beställning med klart innehåll går direkt till uppdelningen, med antagandena utskrivna.

## 3. Bryta ner och bygga
1. Per del: sök metod, steg, anrop och atom med minst två formuleringar. Återanvänd, gör en variant för kunden, bygg nytt — i den ordningen.
2. Bygg med write { op: "method_build", from_plan }: planen i klartext, en rad per steg med typ (människa, Claude, kod). Det som saknar atom blir atomförslag; hitta aldrig på något körbart.
3. Pröva automationen i ordningen koppling, API, annat, människa.
4. Förhandsvisa, rätta det grinden säger, spara efter ja.
5. Spara delarna på projektet med write { op: "project_brief_save", project, parts }: per del label, claim (vad den åstadkommer), actions (verb + vad), outcomes; per steg label, type (human, llm, code), performer, ref (steget i registret när det är byggt) och leaves_house: true på det som skickar eller publicerar utåt. En beslutspunkt är en egen del med decision: { question, decides, options: [{ label, triggers }] }; det som beror på beslutet är skisser: label, claim, troliga steg som actions och sketch: { decision, option }. Delar eller steg som är samma arbete får samma work, och split_reason när de ändå delas.

## 4. Skärpa instruktionerna
1. Varje Claude-steg får alla sex delar (purpose, read_first, how_to, must_not, answer_format, ask_when); varje människosteg sitt recept (Vad behövs, Så gör du 1. 2. 3., Kontrollera).
2. Gå igenom förteckningen rad för rad: varje rad ska ha landat i en instruktion, ett krav, en fråga, ett beslut — eller vara struken med skäl. Skriv det med write { op: "project_brief_save", project, inventory: [{ id, placed: [{ in, ref }] }] } eller struck: { reason }. Täckningen räknas av read { op: "project_brief", project }; placera det som står kvar.
3. Ton, förbud och kundens ord citeras i instruktionen, inte omformulerade.
4. Obekräftat markeras (?) där det används och stoppar inget.

## 5. Tid
1. När beslutet fattas: write { op: "project_brief_save", project, decide: { part, option, reason } }. Den valda grenens skisser blir vanliga delar: detaljplanera dem (bryta ner, skärpa) innan de körs; de andra grenarna stryks med skäl av sig själva.
2. När ett möjligt projekt blir en leverans: write { op: "project_brief_save", project, to_delivery: { customer } }. Kör sedan varven i fas 2 igen mot kunden: pröva varje antagande och bekräfta det (confirmed: true) eller rätta det.
3. Planera tiden med arbetssättet i prompten «Planera projektet»: en del i taget, plan_state { delivery, format: "plan" }, förhandsvisning med execute_step { plan }.

## 6. Klart att köra
1. Spara det som saknas med write { op: "project_brief_save", project, missing } (what, why, how: { kind: link, prompt, recipe eller draft_message, content }, who, when: { date eller step }). En lucka utan vad, hur eller när avvisas.
2. Kör read { op: "project_brief", project }. Kontrollen räknar allt fram till första beslutspunkten: utförare, full instruktion eller recept, varje del har en handling, varje uppdelning har ett skäl, förteckningen är täckt, luckorna är beskrivna. Räkna inte själv: åtgärda det som står i remaining och kör igen tills listan är tom, eller visa det som återstår för användaren som det står.
3. Berätta projektet som en berättelse: vad som händer, vem, när, och vad användaren behöver säga ja till. Sist det som saknas.

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
- säga att något saknas utan exakt vad, hur och när
- hitta på en atom eller ett anrop som inte finns

## Svaret
Svenska, kort, det viktigaste först. Varven i fas 2: rad om sammanhanget, högst fem beslutspunkter, en rad antaganden, genvägen «kör direkt». Därefter projektet som berättelse, antagandena som lista, och sist det som saknas med vad, varför, hur, vem och när.

## Fråga bara när
- det gäller pengar, kundens medverkan, något som lämnar huset eller något som inte går att ångra, och du inte kan sluta dig till svaret
- underlaget inte räcker ens till ett förslag — säg då exakt vad som saknas och hur det tas fram
