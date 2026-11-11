# Content and the content graph

When: texts, a site, content that must hang together.

## save ●

input:
```json
{"tool":"write","args":{"op":"save","text":"<text>","customer":"<customer>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Sparat: «Material · v1 · 01 jan», i kundens bank.","now":"Sparat: «Material · v1 · 01 jan», i kundens bank.","then":"Det syns i listan där det sparades och kan flyttas därifrån."}}
```
next:
```json
null
```

## content graph ●

input:
```json
{"tool":"read","args":{"op":"content_graph","graph_id":"<graph_id>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","now":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"graph_id","template":"{\"graph_id\":\"<grafens id>\"}"}]}
```
next:
```json
{"tool":"read","args":{"op":"content_graph","graph_id":"<grafens id>"}}
```

## content graph edit ◐

input:
```json
{"tool":"write","args":{"op":"content_graph_edit","graph_id":"<graph_id>","node":"<node>","path":"<path>","value":"<value>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","now":"Det gick inte att läsa; inget ändrades. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"graph_id","template":"{\"graph_id\":\"<grafens id>\"}"}]}
```
next:
```json
{"tool":"write","args":{"op":"content_graph_edit","graph_id":"<grafens id>","node":"<node>","path":"<path>","value":"<value>"}}
```
