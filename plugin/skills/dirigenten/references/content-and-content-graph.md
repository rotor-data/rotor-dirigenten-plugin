# Content and the content graph

When: texts, a site, content that must hang together.

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

## content save ◐

input:
```json
{"tool":"write","args":{"op":"content_save","markdown":"<markdown>","customer":"<customer>","kind":"<kind>","name":"<name>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det sparades inte. Vad som behövs står i det som saknas.","now":"Det sparades inte. Vad som behövs står i det som saknas.","then":"Rätta anropet efter det som saknas och skicka det igen."},"missing":[{"field":"customer","template":"{\"customer\":\"<kundens id eller namn>\"}"}]}
```
next:
```json
{"tool":"write","args":{"op":"content_save","markdown":"<markdown>","customer":"<kundens id eller namn>","kind":"<kind>","name":"<name>"}}
```
