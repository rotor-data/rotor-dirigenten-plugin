# Refusals and detours

When: a refusal, an error, «cannot», stale tools.

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

## batch apply ■

input:
```json
{"tool":"write","args":{"op":"batch_apply","action":"<action>","items":"<items>","params":"<params>"}}
```
output:
```json
{"phase":"read","say":{"happened":"Här är det.","now":"Här är det.","then":"Fortsätt med nästa sak."}}
```
next:
```json
null
```

## a refusal or rev_conflict as sent

input:
```json
{"tool":"<envelope.next.tool>","args":{"...":"<envelope.next.args>"}}
```
output:
```json
{"phase":null,"say":null,"note":"send envelope.next as it is"}
```
next:
```json
null
```
