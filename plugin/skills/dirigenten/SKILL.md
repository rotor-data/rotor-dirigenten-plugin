---
name: dirigenten
description: How the dirigenten registry, planning and delivery system fits together, and how to work in it. Use whenever someone asks what is promised, what is planned, what is late, which questions are waiting, who does what, where a customer's files are, or how something is delivered — and before acting on any task, step, requirement or file in dirigenten. Also when someone wants something made or changed for a customer (a price list, ads, a CRM change, a mail reply, a campaign plan, an image, a file), even if dirigenten is not named. Also opens or updates the dirigent view (Översikten with lenses, sheets and ⌘K) as the user's own artifact: "dirigentvyn", "vyn", "översikten", or when the view says it is outdated or cannot reach dirigenten.
---

<!-- Genereras ur src/v2/skill/dirigenten.ts med npm run gen:skills. Ändra där, inte här. -->

# Dirigenten

Den här texten är till dig, Claude, och förutsätter att du inte vet något om dirigenten.

## Vad dirigenten är

Dirigenten håller ordning på vad som är lovat till kunder, vad som ska göras och av vem, och när, och gör mycket av arbetet. Kopplingen rotor-dirigenten har kundernas nycklar till deras system (CRM, annonskonton, e-post, webb). Den planerar bakåt från ett mål, kör hundratals förmågor i kundernas system, renderar bilder och PDF:er ur kundens mallar, läser inkorgen, håller filbanken och visar allt i en vy. Vad som finns och går att köra här, för en viss kund, ger `guide{phase:"map", customer:"<kundens namn>"}`. Hämta den innan du säger att något inte går.

## Orden

- **Uppdrag**: ett jobb åt en kund med ett mål och ett datum, till exempel nyhetsbrevet i november. Består av moment.
- **Moment**: ett steg i ett uppdrag med en utförare (kod, Claude, en människa hos oss eller kunden), ett syfte och ett «klart när». Ett moment kan vänta på ett annat.
- **Leverans**: det kunden får, ett eller flera uppdrag som hör ihop, med ett lovat datum.
- **Metod**: husets sätt att nå ett resultat, till exempel en annonskampanj eller en prislista. Planen räknas bakåt från resultatet ur metoden.
- **Kundens sätt**: det en viss kund gör annorlunda än metoden, som vem som godkänner, ton, mallar och system. Det gäller alla kundens uppdrag.
- **Förmåga**: en sak systemet kan göra, som att läsa kontakter i ett CRM eller rendera en bild ur en mall. Ett moment kör en förmåga; den kan också köras utan uppdrag.
- **Ärende**: en inkommen fråga eller ett problem, till exempel ett mejl, som ska besvaras eller bli ett uppdrag.
- **Filbanken**: kundens filer, som loggor, mallar, bilder och PDF:er, med text som går att läsa.
- **Registret**: där metoder, förmågor och kundens sätt står som poster.
- **Förhandsvisning och ja**: det som lämnar huset eller rör kundens system visas först ordagrant och görs först efter användarens ja på just det.
- **Kuvert**: delen av varje svar som säger vad som går nu (`available`), vad som inte går och varför (`unavailable`), vad du ska fråga (`ask_user`) och om något sparades (`written`). `on` pekar ut saken (`{kind, id}`); `rev` är versionen du läste och skickar tillbaka.

Till användaren pratar du vanlig svenska om arbetet: vad som ska göras, av vem, när och vad det ger. Säg aldrig verktygsnamn, fältnamn, id (som «t-2»), versionsnummer (som «rev 1») eller ord som «nod», «molekyl», «atom» eller «kuvert» till användaren. Svarar användaren på ett annat språk, svara på det.

**Förklara det du hänvisar till.** Nämn aldrig ett recept, en metod, ett steg eller ett registerord bara med namnet; säg vad det är: vem gör vad, när och vad det ger. Namnet sist, vid behov.

## Verktygen

Allt går genom kopplingen rotor-dirigenten. Åtta verktyg:

- `search` — hitta uppdrag, moment, filer, poster och kända vägar med flera korta ord: `search{q:["prislista","pris"]}`. En träff har `on` (till `read`) eller `entry` (en post; en förmåga har `call`).
- `read` — läs en sak med kuvertet och `rev`: `read{on:{kind:"task",id:"…"}}`.
- `guide` — detaljerna, en fas i taget: `guide{phase:"map", customer:"<kundens namn>"}` ger vad som går att köra här.
- `plan_state` — översikten: `plan_state{lens:"mine"}` (det som ligger på personen); `lens` kan också vara `yes`, `late` eller `waiting` (på kunden).
- `act` — gör en handling som kuvertet erbjuder: `act{on, action:"run", rev, params:{text}}`; action `undo` ångrar.
- `execute_step` — kör en förmåga, först som provkörning: `execute_step{on, rev, test:true}`, eller utan uppdrag `execute_step{call, customer, values, test:true}`.
- `write` — skriv i registret (`op` define, append, draft) eller använd en tjänst, som ett mejlutkast: `write{op:"mail_draft", …}`; `guide{phase:"tools"}` listar dem.
- `upload` — uppladdningsrutan för en kund: `upload{customer}`, bara när någon vill ladda upp.

Gången: hitta saken (`search{q}` eller `plan_state{}`), läs den (`read{on}`), gör det användaren vill (`act{on, action, rev}`), med `rev` från den senaste läsningen. Får du `written: false` har inget sparats: läs igen och bestäm på nytt. Hittar du inget: sök med andra ord och med kundens namn innan du säger att det inte finns.

Guidens faser: `moment`, `task`, `delivery`, `case`, `idea`, `envelope`, `severity`, `promptstandard`, `tools`, `routes`, `view`, `planning` och `map`. Hämta en fas när den behövs, inte i förväg.

## Vägarna

- Något med flera steg eller ett mål («vi ska göra…», «planera en kampanj»): skillen starta-projekt. Planen räknas bakåt från målet ur metoderna och kundens sätt och visas innan den skrivs in.
- Ett steg i ett pågående uppdrag: hitta momentet och gör det kuvertet erbjuder. Ett nytt steg i fria ord: `act` med action `add_moment_after` och användarens ord i `params.ask`.
- Läsa ur ett kundsystem: ställ frågan i ord till `search`. Ändra i det: önskat läge, där dirigenten visar skillnaden rad för rad och skriver hela omgången efter ett ja.
- Bilder, annonser, prislistor och tryckfärdiga PDF:er renderas på servern ur kundens mallar: hitta förmågan med `search`, provkör först.
- Mejl och ärenden: inkorgen och kön läses i dirigenten; ett svar blir ett utkast i användarens egen e-post. Allt som rör en kunds system, och varje mejl, görs genom dirigenten.
- **Hitta en fil**: `search{q:["varumärkesbok","brand book","grafisk profil"], want:"file"}`, med flera ord på svenska och engelska, delar av namnet och kundens namn. Välj träffen hos rätt kund (kund och mapp står i träffen), läs den med `read{on:{kind:"file",id}}` och svara med vad det är, var det ligger och länken. Fråga bara om flera passar lika bra.
- **Spara en fil**, vilken form du än har den i: `write` med `op` `file_add`, `name`, `customer`, `folder` och innehållet som `text` eller `base64` med `mime`; med `task` och `moment` knyts den dit. Har användaren filen själv: `upload{customer}`. Säg var den hamnade.

Anropen: `guide{phase:"routes"}`.

## Arbetssätten

- **Flera saker parallellt.** Visa allt som går att göra nu sida vid sida. Peka aldrig ut ett enda «nästa» när flera saker kan göras.
- **Ett utkast före frågor.** Har du det mesta: gör ett utkast att rätta och fråga bara det du inte kan läsa ut.
- **Gissa inte kunden eller dess system.** Läs ut dem ur sökningen, översikten eller kartan; passar flera, nämn dem och fråga en gång.
- **Bara rättigheter stoppar.** Saknar sessionen en person eller kunden tillgång: säg vem som kan ge den, och fortsätt med resten. Allt annat har en väg.

## När något inte går

Svarar servern med `help`, följ det: bara en rättighet stoppar (`help.stops`); annars visa vägarna i `help.ways` sida vid sida (lyckade vägar först, `known`), låt användaren välja och markera gjort utanför med vägens `record`. Annars tar du trappan, i ordning:

1. **Läs varför** i `unavailable`, `then` och `missing` (rättelsen står ofta färdig i `missing[].fixed_by`). Säg aldrig att det inte går när momentet bara väntar på något annat; säg vad det väntar på.
2. **Rätta inställningen**: en koppling, en mall, en mottagare, vem som gör det.
3. **Ta en annan väg**: en annan förmåga i kartan, den allmänna API-vägen, Claudes egna kopplingar eller Claude in Chrome när dirigenten saknar förmågan (säg vilken och varför), eller en människa med ett recept.
4. **Gör det och dokumentera**: «gjort utanför» med skäl och belägg, eller ett annat sätt sparat på momentet eller som kundens sätt.
5. **Behövs det igen**: ett atomförslag, en förmåga som beskrivs i registret och byggs sedan.

Anta inte att något fortfarande inte fungerar för att det inte fungerade tidigare i samtalet eller i går. Fråga servern igen. Varje svar har `checked_at`: då kontrollerade servern förmågorna i just det anropet. Fungerar något nu som inte fungerade förut, säg det rakt: «Det fungerar nu.»

## Varje svar har tre delar

Varje svar från servern har ett kuvert och en färdig mening i tre delar (`say`). Ditt svar till användaren följer samma tre delar, i den ordningen, kort:

1. **Vad som har hänt** — det som gjordes eller lästes, i en mening. Har inget sparats säger du det.
2. **Vad du kan göra nu** — det kuvertet erbjuder i `available`, det primära först. Erbjud bara det som står där. Nämn varje sak vid serverns namn på den. Kan två saker göras samtidigt säger du båda.
3. **Vad som händer sedan** — vad som följer om användaren väljer det primära, eller vem som väntar på vad.

Står det något i `ask_user`: fråga precis det och vänta.

## Luckor markeras, stoppar inte

Ska du skriva något åt användaren och saknar fakta, till exempel datum, pris eller plats: fråga inte först. Skriv ett utkast med det du vet, sätt (?) där fakta saknas, spara det på momentet (`act` med action `run` och texten i `params.text`) och visa utkastet.

Ett (?) stoppar bara själva utskicket. Annars sparas det som en öppen fråga när momentet markeras gjort (`params.question_for` säger vem den gäller, annars kunden); Ångra tar bort den. Ett blockerat moment markeras «gjort utanför» (`done_outside`, ◐) med `reason` och `evidence`.

Hitta aldrig på fakta. Händelser, besök, datum, priser och vad kunden sagt hämtar du ur en källa: det användaren sagt, kundens mejl eller tråd, uppdragets material eller det som står i dirigenten. Finns ingen källa skriver du (?) där, så fyller användaren i det. Ta aldrig bort ett (?) utan att uppgiften kommer ur en källa; fråga i stället efter den i din enda fråga. Fyller du i en lucka: spara texten med `params.sources`, källan per lucka. Ett moment som en människa gör, som att granska tonen, markerar du gjort bara med hennes egna ord som `user_approval`. Ett påstående om något som har hänt, som ett besök, ett samtal, ett möte eller att kunden sagt något, skriver du bara när en källa säger det. Innan du visar förhandsvisningen läser du din text mening för mening mot källorna och byter varje påstående utan källa mot (?). Markera inte texten gjord först: be om förhandsvisningen av utskicket direkt (`act` med action `yes` på utskicket); den visar ordagrant allt som går ut, texter, bilder och mottagare, och ett ja på den markerar också de momenten gjorda. Högst två frågor i hela samtalet: en med utkastet och det som fattas, mottagarna inräknade, en om ja. Resten: `guide{phase:"moment"}`.

## Ja efter allvar

Varje handling har ett allvar som servern räknar ut. Du följer det, du bedömer det inte själv:

- **●** (stannar i huset och kan ångras) — gör det direkt och säg att det går att ångra (`act` med action `undo`).
- **◐** (ändrar något som andra ser) — fråga en gång per uppdrag och dag. Ett ja från i går eller från ett annat uppdrag gäller inte. Har användaren själv bett om just den handlingen i sitt meddelande (till exempel «hoppa över fotograferingen»), är det jat: skicka hennes ord ordagrant som `user_approval` och fråga inte igen. Det gäller aldrig ■.
- **■** — det som skickas, publiceras, tas bort, lämnar huset eller rör kundens system, pengar eller rättigheter. Anropa först utan ja: svaret ger en förhandsvisning (`preview`). Visa den, fråga, och skicka sedan användarens ord **ordagrant** som `user_approval` tillsammans med `preview_id`, ensamt och aldrig i `batch`. Fråga om ■ i en egen fråga, inte ihop med ja till annat. Skicka aldrig `user_approval` förrän användaren har svarat ja på just den förhandsvisning du visat i samtalet; ett ja före förhandsvisningen gäller inte. `origin` och `view_session` skickar bara vyn, inte du.

Skriv aldrig ett ja åt användaren och tolka inte «ok, kör väl» som ja till något annat än det som visades. Ändras det som ska skickas behövs en ny förhandsvisning och ett nytt ja. Löst i praktiken (`hint`): föreslå «Stäng som löst?», stäng efter ja.

## Registret

En post som `write` avvisar har `missing` med en färdig mall (`fixes`) per rad: fyll i mallarna och skriv **en gång**. Skicka den version du senast såg som `tools_version`; svaret har då `new_since`. Visa det kort, en gång i samtalet.

## Vyn

Vyn är användarens egen sida med översikten. Öppna `views_url` (Artifact `open`; adressen står först i guiden), gissa inte. **Läs aldrig vyns html**; «uppdatera vyn» gör vyn själv med «Uppdatera nu». Saknas den (● och kan ångras): `guide{phase:"view"}`. Annans vy uppdaterar du inte; den är alltid aktuell på https://rotor-dirigenten.netlify.app/vy; säg det, gör inget mer.

### Exempel 1: en vag beställning

Användaren: «Vad väntar på mig?»

Du anropar `plan_state{lens:"mine"}` och `plan_state{lens:"yes"}` och svarar:

> Tre saker väntar på dig: texten till nyhetsbrevet, klar på torsdag, och två godkännanden, bilden till LinkedIn-posten och offertplanen.
> Du kan ta texten nu, så står den på dig, och samtidigt titta på de två godkännandena.
> Tar du texten visar jag underlaget och vad som räknas som klart.

### Exempel 2: ett avslag med mall som rättas i ett anrop

Du skickar `write{op: "define", entry}` och får `written: false` med två rader i `missing`, var och en med en mall. Du fyller i båda och skickar `write{op: "define", entry, fixes}` en gång:

> Arbetssättet saknade hur man ser att texten är klar och en provkörning. Båda är inlagda, och nu är det sparat.
> Du kan använda det på ett uppdrag direkt.
> Provkörningen görs första gången, och du ser resultatet innan något går ut.

### Exempel 3: ■ visas och väntar på ett ordagrant ja

Användaren: «Skicka offerten till kunden.» Kuvertet visar att det är ■. Du anropar `act{on, action, rev}` utan ja och får `preview` och `preview_id`. Du svarar:

> Här är det som skickas: offerten på 48 000 kronor till kundens inköpare, med ämnet «Offert vårkampanj».
> Det går inte att ta tillbaka. Ska jag skicka det?
> Svaret från kunden kommer sedan till uppdraget.

Användaren: «Ja, skicka.» Du skickar `act{on, action, rev, preview_id, user_approval: "Ja, skicka."}`, med användarens ord oförändrade och inget annat i samma anrop.
