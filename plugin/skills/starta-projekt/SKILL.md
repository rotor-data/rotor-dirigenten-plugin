---
name: starta-projekt
description: "Turn a loose request, a short brief or a large pasted body of material into a dirigenten project ready to run: agree on a clear goal with the user in short rounds (draft to correct, never only questions), let the rotor-dirigenten connector compute the plan backwards from it, settle the open choices one at a time and write it in after a yes. Also adjusts the goal of running work, resumes a paused review (\"fortsätt genomgången\") and replans running work (\"planera om\"). Use when someone wants something done that spans several steps — \"vi ska göra…\", \"kan vi ta fram…\", \"planera…\", \"här är underlaget\", \"nytt jobb\", \"offert\", \"kampanj till …\", \"kan ni hjälpa oss med\", \"förfrågan\", \"beställning\", a pasted order, brief, meeting notes or customer email, or an order dirigenten sent to project start — with or without a customer, even when the word project is never said. Not for a single quick task, a question about what is planned (use dirigenten), or time planning of an existing delivery (prompt «Planera projektet»)."
---

<!-- Genereras ur src/v2/skill/start-project.ts med npm run gen:skills. Ändra där, inte här. -->

# Starta projekt

Ta en beställning eller ett underlag, tydligt eller vagt, till ett uppdrag som bara är att sätta igång: ett tydligt mål, delmålen räknade baklänges från det, valen gjorda med användaren, och varje moment beskrivet så att någon kan göra det utan att fråga. Arbete som redan pågår planeras om utan att något gjort försvinner.

Prata med användaren på vanlig svenska om arbetet: vad som ska göras, av vem, när och vad det ger. Verktygsnamn, fältnamn, id och orden «nod», «molekyl», «atom» och «kuvert» stannar hos dig. Allt i dirigenten görs genom kopplingen rotor-dirigenten; andra kopplingar används bara när dirigenten saknar förmågan, och då säger du vilken väg och varför.

Anta inte att något fortfarande inte fungerar för att det inte fungerade tidigare i samtalet eller i går. Fråga servern igen.

## Läs först

- `guide{phase}` med `task`, `moment` och `promptstandard` första gången i samtalet. Där står vad varje handling betyder och hur en instruktion ska se ut.
- `search{q}` med kundens namn och två till fem formuleringar av beställningen: kunden, det som redan pågår hos kunden och liknande som gjorts förut.
- `read{on}` på det sökningen pekar på; `read{on, view: "net"}` ger kartan över ett pågående uppdrag. Ta `rev` från den senaste läsningen.
- `plan_state{}` när beställningen kan höra till något som redan pågår.

## 1. Ta emot

1. Spara det som klistrats in, bifogats eller länkats oförändrat som material innan något annat görs. Filer kopplas till momentet de hör till med `act{on, action: "attach_file", rev}`.
2. Gör en förteckning: en rad per påstående i underlaget (krav, önskemål, fakta, ton, förbud, öppen fråga) med var det står. Kundens egna ord citeras ordagrant.
3. Läs in det som redan finns hos kunden: pågående och tidigare uppdrag, utkast och filer, med datum och vem. Det som finns återanvänds eller hänvisas till och blir inte nya moment som gör om det.
4. Fråga användaren «Har ni redan gjort något av det här?» och föreslå själv det du ser: research tidigare i samtalet, snabbhandlingar som körts för kunden och filer i banken. Det användaren säger ja till skrivs med målet som `goal.existing` [{ result, source, kind: "quick" | "file" | "text", ref, text }]: result är resultatet i planen det levererar, source varifrån i ord, ref snabbhandlingens uppgift eller filens id, text samtalets research ordagrant. Momentet räknas då som «fanns redan» och planeras inte igen; det som inte passar något moment står kvar med skälet. Efter inskrivningen kopplas filerna till sina moment med `act{on, action: "attach_file", rev}`.
5. Bedöm utkast ärligt: ett utkast som inte är godkänt är inte klart och räknas aldrig som gjort arbete; bygger något på det får det ett moment som rättar det och får det godkänt.
6. Säg bara «Jag har sparat underlaget» till användaren.

## 2. Förstå och föreslå, i varv med användaren

1. Varje varv lämnar ett förslag att rätta i: en rad om sammanhanget, målet i en mening, högst fem punkter (frågor och beslut tillsammans, högst tre frågor), en rad antaganden markerade (?), och genvägen «kör direkt».
2. Det du kan sluta dig till avgör du själv, med skälet utskrivet. Frågor ställs bara om det som ändrar planen.
3. Ett arbete delas bara med ett utskrivet skäl. Kundens ord, ton och förbud står ordagrant i instruktionen.

## 3. Målet först, sedan valen

1. Skriv målet: det som ska vara sant när uppdraget är klart, mätbart där det går. Delmålen och ordningen mellan dem räknas av dirigenten baklänges från målet.
   Är arbetsordningen redan känd (underlaget eller användaren säger vad som kommer först, med datum, vem som ansvarar eller vad en del ska åstadkomma): lämna den med målet i samma skrivning, så räknas bara resten baklänges. Fälten står i `guide{phase: "planning"}`, med ett exempel; ett avslag säger vilket fält som inte finns och ger mallen att skriva efter. Ett nytt datum ersätter det gamla.
   Exempel: «avtalet först, synopsis före mallen, svenska före engelska» blir delmål i den ordningen, med datum och ansvarig. Motexempel: bara målet, och ordningen gissas fram baklänges.
2. Planens öppna val tas ett i taget, högst tre per varv, vart och ett med ditt förslag och vad svaret ändrar.
3. Det som saknas beskrivs med exakt vad (filen, siffran, inloggningen, beslutet), varför (vilket moment det stoppar), exakt hur (en länk, en färdig prompt, en stegvis instruktion med Vad behövs, Så gör du och Kontrollera, eller ett färdigt meddelande som skickas först efter ja) och vem som troligen har det och när.
4. Saknar dirigenten en förmåga: skriv atomförslaget själv och säg till användaren bara «det här kan dirigenten inte än, det byggs», plus hur det görs för hand under tiden.

## 4. Instruktionerna skrivs i planeringen

Instruktionerna skrivs i planeringen, så fullständigt som underlaget räcker, inte när momentet ska göras. Det som inte går att formulera än markeras som lucka: vad som saknas, vem som har det och när det behövs. En instruktion med luckor sparas som utkast med `write{op: "draft", entry}`; den används av människor men körs inte av Claude eller kod förrän den är komplett.

1. Varje instruktion har sex delar: syfte och sammanhang; vad som ska läsas först, med exakta källor; så gör du, i numrerade steg; får inte; svarsformat med minst två exempel, varav ett motexempel eller gränsfall; när man ska fråga. Detaljerna står i `guide{phase}` med `promptstandard`.
2. Skriv in med `write{op: "define", entry, task}`. Svaret säger vad som saknas och ger en färdig rättelse per sak; skicka alla rättelser i ett enda anrop med `fixes`. Ett tillägg till något som finns görs med `write{op: "append", entry}`.
3. Skriv instruktionen komplett första gången (Daniel P: «det bästa vore om prompter och instruktioner från början blev kompletta och inte behövde revideras»). Följ reglerna nedan.
4. Varje moment ska vara fullständigt: purpose (en hel mening) och done_when; människa och kund: recipe { needs, how, check } med numrerade steg; Claude: instruction { purpose, read_first, how_to, must_not, answer_format, ask_when } med minst ett «Exempel:»; kod: capability, en förmåga som finns, görs av kod och lämnar momentets resultat. Kod utan förmåga som stannar i huset stoppar inte: Claude eller en människa tills vidare, och ett atomförslag. Ett verktyg allmänt («Smyra», «Chrome») räcker inte. Kontrollera dirigentens förslag på förmåga: ett förslag märkt «passar inte» används inte. Standardmomenten (godkännande, ja, samla, leverera, kontrollera) ärver ur biblioteket. Grinden avgör: ett utkast sparas med varningar, inskrivningen stoppas, och avslaget har en mall per moment att skicka tillbaka i ett anrop.

### Regler för instruktioner (planeringslärdomarna 26–30)

1. **Högst tre förbud per prompt.** Bara för det som ska bort helt och är en verklig felmod för just det momentet. Önskat beteende skrivs som en positiv instruktion; förbud tolkas bokstavligt (Daniel P: «vi ska vara försiktiga med förbud också. Det tolkas väldigt bokstavligt»). Grinden varnar för fler än tre förbud i en prompt; kontrollera själv att samma förbud inte står i fler än hälften av prompterna i projektet.
   Exempel: i stället för förbudet «skriv inte långt» står den positiva instruktionen «högst 120 ord, en tanke per stycke».
   Motexempel: fem förbud i varje annonsprompt, varav tre om sådant momentet aldrig gör.
2. **Kraven per punkt ligger i data per punkt.** En prompt som upprepas per punkt läser punktens krav med `{item}`; den gemensamma prompten bär inte varje punkts särdrag.
   Exempel: prompten säger «skriv texten för {item}, med kraven i {item}.krav», och kraven för varje målgrupp står i målgruppens rad.
   Motexempel: den gemensamma prompten räknar upp särdragen för alla åtta målgrupper.
3. **Modell- och verktygsval läses ur husets metod eller skill** när en sådan finns (för research: husets researchpipeline), aldrig gissat. Finns ingen: skriv det som en lucka.
   Exempel: ett researchmoment pekar på husets researchpipeline och tar modell och sökverktyg därifrån.
   Gränsfall: huset har ingen metod för momentet; då står valet som lucka med vem som avgör, inte som en gissning.
4. **Inga exempel kopierade mellan liknande moment.** Varje moment får exempel ur sitt eget underlag. Kontrollera före skrivningen att det inte finns samma exempel i två eller fler moment.
   Exempel: annonsen för villaägare har ett exempel om villaägare, annonsen för föreningar ett om föreningar.
   Motexempel: samma exempelrubrik står i alla sex annonsmomenten.
5. **Ingen hänvisning till en fil som den som kör momentet inte har.** Kontrollera att varje filsökväg och filnamn finns bland projektets material; webbsökvägar och webbfiler är inte projektmaterial och räknas inte hit. Stryk också ett förbud mot utskick eller skrivning i kundsystem i ett moment som inte kan skicka eller skriva: förbudet gäller något som inte kan hända, och tolkas ändå bokstavligt.
   Exempel: instruktionen hänvisar till underlaget som sparats i projektet, med dess namn där.
   Motexempel: «se mallen i min Dropbox» i ett moment som Claude kör, eller «skicka inget till kunden» i ett moment som bara skriver ett utkast.

Svaret på en skrivning varnar med momentets namn för fler än tre förbud i en prompt; resten av reglerna kontrollerar du själv före skrivningen (?). Varningarna stoppar inget: rätta det som stämmer, och låt resten stå med ett skäl.

## 5. Skriv in och justera

1. Underlaget, förteckningen, målet och svaren på valen sparas direkt och går att ångra med `act{on, action: "undo", rev}`.
2. Det som ändrar ett pågående uppdrag följer allvaret i svaret: ● görs direkt, ◐ kräver ett ja per uppdrag och dag, ■ visas först och görs efter användarens ordagranna ja, ensamt och aldrig i en bunt.
3. Ett pågående uppdrag planeras om från kartan: det som redan är gjort står kvar oförändrat, och planen utgår från det. Ett moment som någon annan gör eller redan har gjort markeras med `act{on, action: "done_outside", rev}`; ett som inte behövs med `act{on, action: "skip", rev}` efter ja.
4. Byter uppdraget metod: `act{on, action: "change_method", rev}` efter ja.
5. Rätta ett pågående uppdrag med act: lägg till ett delmål (med ansvarig och syfte) eller ett beroende på uppdraget, och byt vem eller flytta i tiden på momentet. Fälten per handling står i `guide{phase}` med `task` och `moment`; ett avslag ger mallen.

## Svaret till användaren

Svenska, kort, det viktigaste först, i tre delar: vad som har hänt, vad användaren kan göra nu (det primära först; kan två saker göras samtidigt säger du båda), och vad som händer sedan.

Exempel: «Jag har sparat underlaget. Målet: tre annonser för höstkampanjen klara att publicera 15 november. Du kan nu svara på två val: vilka målgrupper, och om bilderna tas fram här. Sedan räknar jag fram delmålen.»
Motexempel: «Jag har skapat en nod med fem molekyler; kör write med op define.» — interna ord och verktygsnamn till användaren, och inget förslag att rätta i.
Gränsfall: underlaget räcker inte ens till ett förslag. Säg exakt vad som saknas och hur det tas fram, och föreslå ändå ett mål att rätta i.

## Fråga bara när

- planens öppna val behöver ett svar: högst tre per varv, med förslaget;
- svaret innehåller en fråga till användaren: fråga precis det och vänta;
- något ska lämna huset, skriva i ett kundsystem, binda pengar eller inte går att ta tillbaka: visa förhandsvisningen och vänta på ordagrant ja.
