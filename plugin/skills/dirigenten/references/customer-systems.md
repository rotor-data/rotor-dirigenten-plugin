# Customer systems

When: read or change a CRM, an ad account, a site; render.

## can ●

input:
```json
{"tool":"read","args":{"op":"can","q":"<q>"}}
```
output:
```json
{"phase":"found","say":{"happened":"Jag hittade ingen väg för just de orden.","now":"Använd dirigentens väg innan en annan koppling; varje op i listan går att anropa även om den inte står i din verktygslista.","then":"Säg det med andra ord, eller läs guide{phase:\"map\"} för allt som kan köras här."},"ways":[]}
```
next:
```json
null
```

## quick run ◐

input:
```json
{"tool":"write","args":{"op":"quick_run","task":"<task>"}}
```
output:
```json
{"phase":"open","say":{"happened":"Förmågan finns inte i registret (call); inget kördes.","now":"uppdraget är öppet.","then":"Nästa: Stäng – «uppdraget»."}}
```
next:
```json
{"action":"close","on":{"kind":"task","id":"<task>"}}
```
