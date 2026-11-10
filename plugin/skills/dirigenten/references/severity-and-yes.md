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
{"phase":null,"say":{"happened":"Dirigenten tog inte emot anropet, eftersom något saknades eller var fel.","now":"Inget har sparats.","then":"Läs det igen och skicka med vad det gäller."}}
```
next:
```json
{"tool":"act","args":{"on":"<vad det gäller>","action":"<same>","rev":"<rev>","preview_id":"<envelope.preview.preview_id>","user_approval":"<the user's words verbatim>"}}
```
