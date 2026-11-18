# Planning and project start

When: plan, add a step, how is a customer doing.

## run on a moment per envelope

input:
```json
{"tool":"act","args":{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"run","rev":"<rev>"}}
```
output:
```json
{"phase":"unknown","say":{"happened":"Inget blev sparat, eftersom det inte gick att spara just då; allt är som före försöket.","now":"Försök igen om en stund, så sparas bara det som saknas.","then":"Nästa steg är att försöka igen."}}
```
next:
```json
null
```

## skip on a moment per envelope

input:
```json
{"tool":"act","args":{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"skip","rev":"<rev>"}}
```
output:
```json
{"phase":"unknown","say":{"happened":"Inget blev sparat, eftersom det inte gick att spara just då; allt är som före försöket.","now":"Försök igen om en stund, så sparas bara det som saknas.","then":"Nästa steg är att försöka igen."}}
```
next:
```json
null
```

## change who on a moment per envelope

input:
```json
{"tool":"act","args":{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"change_who","rev":"<rev>"}}
```
output:
```json
{"phase":"unknown","say":{"happened":"Inget blev sparat, eftersom det inte gick att spara just då; allt är som före försöket.","now":"Försök igen om en stund, så sparas bara det som saknas.","then":"Nästa steg är att försöka igen."}}
```
next:
```json
null
```

## several actions of a kind ■ alone

input:
```json
{"tool":"act","args":{"on":"<first on>","action":"<action>","rev":"<rev>","batch":[{"on":"<next on>","action":"<action>","rev":"<rev>"}]}}
```
output:
```json
{"phase":"parked","say":{"happened":"Bara kontrollraden är sparad, själva skrivningen är inte gjord: on saknas eller går inte att läsa","now":"Det står i listan Att kontrollera tills det är klart. Inget annat är ändrat ännu.","then":"Fyll i det som saknas i förslaget, så görs det i samma anrop."}}
```
next:
```json
{"tool":"act","args":{"on":"<vad det gäller>","action":"<action>","rev":"<rev>","batch":[{"on":"<next on>","action":"<action>","rev":"<rev>"}],"resolves":"nc_381550d874ba"}}
```
