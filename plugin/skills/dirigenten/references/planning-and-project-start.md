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
{"phase":null,"say":{"happened":"Dirigenten tog inte emot anropet, eftersom något saknades eller var fel.","now":"Inget har sparats.","then":"Läs det igen och skicka med vad det gäller."}}
```
next:
```json
{"tool":"act","args":{"on":"<vad det gäller>","action":"<action>","rev":"<rev>","batch":[{"on":"<next on>","action":"<action>","rev":"<rev>"}]}}
```
