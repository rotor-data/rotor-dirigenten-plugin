# Severity and yes

When: something is sent, published, removed or approved.

## approve on a moment per envelope

input:
```json
{"tool":"act","args":{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"approve","rev":"<rev>"}}
```
output:
```json
{"phase":"unknown","say":{"happened":"Inget blev sparat, eftersom det inte gick att spara just då; allt är som före försöket.","now":"Försök igen om en stund, så sparas bara det som saknas.","then":"Nästa steg är att försöka igen."}}
```
next:
```json
null
```

## a ■ reply had a preview ■

input:
```json
{"tool":"act","args":{"on":"<same>","action":"<same>","rev":"<rev>","preview_id":"<envelope.preview.preview_id>","user_approval":"<the user's words verbatim>"}}
```
output:
```json
{"phase":"parked","say":{"happened":"Bara kontrollraden är sparad, själva skrivningen är inte gjord: on saknas eller går inte att läsa","now":"Det står i listan Att kontrollera tills det är klart. Inget annat är ändrat ännu.","then":"Fyll i det som saknas i förslaget, så görs det i samma anrop."}}
```
next:
```json
{"tool":"act","args":{"on":"<vad det gäller>","action":"<same>","rev":"<rev>","preview_id":"<envelope.preview.preview_id>","user_approval":"<the user's words verbatim>","resolves":"nc_82d80abb04b7"}}
```
