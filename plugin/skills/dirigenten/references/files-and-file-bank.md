# Files and the file bank

When: upload, save, find, move or remove a file.

## save ●

input:
```json
{"tool":"write","args":{"op":"save","text":"<text>","customer":"<customer>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Sparat: «Material · <text> · v1 · 01 jan», bland filerna för <customer>.","now":"Sparat: «Material · <text> · v1 · 01 jan», bland filerna för <customer>.","then":"Det syns i listan där det sparades och kan flyttas därifrån."}}
```
next:
```json
null
```

## file remove ■

input:
```json
{"tool":"write","args":{"op":"file_remove","from_ref":"<from_ref>","reason":"<reason>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det sparades inte. Vad som behövs står i det som saknas.","now":"Det sparades inte. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"from_ref","template":"{\"from_ref\":\"<filens ref ur read { op: \\\"files\\\" }>\",\"reason\":\"<varför>\"}"}]}
```
next:
```json
{"tool":"write","args":{"op":"file_remove","from_ref":"<filens ref ur read { op: \"files\" }>","reason":"<varför>"}}
```

## file restore ◐

input:
```json
{"tool":"write","args":{"op":"file_restore","from_ref":"<from_ref>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det sparades inte. Vad som behövs står i det som saknas.","now":"Det sparades inte. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"from_ref","template":"{\"from_ref\":\"<den borttagna filens ref>\"}"}]}
```
next:
```json
{"tool":"write","args":{"op":"file_restore","from_ref":"<den borttagna filens ref>"}}
```

## asset copy ◐

input:
```json
{"tool":"write","args":{"op":"asset_copy","from_ref":"<from_ref>","folder":"<folder>","customer":"<customer>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det sparades inte. Vad som behövs står i det som saknas.","now":"Det sparades inte. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"from_ref","template":"{\"from_ref\":\"<filens ref ur read { op: \\\"files\\\" }>\",\"folder\":\"<folder>\"}"}]}
```
next:
```json
{"tool":"write","args":{"op":"asset_copy","from_ref":"<filens ref ur read { op: \"files\" }>","folder":"<folder>","customer":"<customer>"}}
```

## find file ●

input:
```json
{"tool":"read","args":{"op":"find_file","q":"<q>"}}
```
output:
```json
{"phase":"read","say":{"happened":"Det finns inget sådant i dirigenten. Leta i kundens Drive eller i mejlen, eller fråga personen var det ligger; hittas det, spara det i kundens filbank så finns det här nästa gång.","now":"Det finns inget sådant i dirigenten. Leta i kundens Drive eller i mejlen, eller fråga personen var det ligger; hittas det, spara det i kundens filbank så finns det här nästa gång.","then":"Fortsätt med nästa sak."}}
```
next:
```json
null
```

## upload link ●

input:
```json
{"tool":"read","args":{"op":"upload_link","customer":"<customer>","folder":"<folder>"}}
```
output:
```json
{"phase":"read","say":{"happened":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","now":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","then":"Fortsätt med nästa sak."},"upload":{"page":"https://<dirigenten>/upload?t=<signed>","expires_at":"2026-01-01T09:30:00Z","max_bytes":26214400,"max_files":20,"for":{"customer":"<customer>","folder":"<folder>","type":"core.asset.material"}}}
```
next:
```json
null
```

## attach file on a moment per envelope

input:
```json
{"tool":"act","args":{"on":{"kind":"moment","id":"<moment>","task":"<task>"},"action":"attach_file","rev":"<rev>"}}
```
output:
```json
{"phase":"unknown","say":{"happened":"Inget blev sparat, eftersom det inte gick att spara just då; allt är som före försöket.","now":"Försök igen om en stund, så sparas bara det som saknas.","then":"Nästa steg är att försöka igen."}}
```
next:
```json
null
```
