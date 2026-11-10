# Files and the file bank

When: upload, save, find, move or remove a file.

## file add ◐

input:
```json
{"tool":"write","args":{"op":"file_add","name":"<name>","text":"<text>","customer":"<customer>"}}
```
output:
```json
{"phase":"done","say":{"happened":"«<name>» ligger nu i kundens filbank, i «customer/claude/filer» som föreslagen plats; den kan flyttas därifrån.","now":"«<name>» ligger nu i kundens filbank, i «customer/claude/filer» som föreslagen plats; den kan flyttas därifrån.","then":"Den syns i kundens filer och kan knytas till ett moment därifrån."}}
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
{"phase":"refused","say":{"happened":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","now":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"customer","template":"{\"customer\":\"<kund>\"}"}]}
```
next:
```json
{"tool":"read","args":{"op":"upload_link","customer":"<kund>","folder":"<folder>"}}
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
