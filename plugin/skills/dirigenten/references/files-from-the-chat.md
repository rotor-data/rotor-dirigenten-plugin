# A file in the chat into the file bank

When: the user attached a file, or you made one, and it should be in the file bank.

Decide by what you hold of the file, then send one call. Fields go at the top of `write`, never inside `entry`.

1. The words are in the conversation (a text, markdown, html, csv, json you wrote or were given): `write{op:"save", text, name, customer}`. Add `as_file: true` to keep it as a file with the type of its name's ending (`.html`, `.csv`).
2. You can read the file's bytes (claude.ai: `/mnt/user-data/uploads/…` or a file you made in `/mnt/user-data/outputs/`; Cowork or Code: the file on disk): base64 of the bytes in `write{op:"save", base64, name, mime, customer}`.
   - At most 256 kB of bytes per call (before base64). Larger: cut the bytes in parts of 262144 bytes, total = ceil(size / 262144), index 0 … total-1, sha256 = hex sha256 of the WHOLE file (`sha256sum file` or `shasum -a 256 file`), one id of 8–64 letters, digits, - or _ for all parts. Send each part with the same name, mime, customer and `chunk: {id, index, total, sha256}`; replies before the last say which parts are missing, the last saves the file. Up to 20 MB.
   - In a shell: `base64 -w0 file` (macOS: `base64 -i file`); parts with `split -b 262144 file part_`.
3. You only see the file (an attachment shown as an image or text, no path you can read): you cannot send its bytes. Do not retype it or send a screenshot as the file. `read{op:"upload_link", customer}` and tell the user to drop the file in the box that appears (or open the link); it is saved as it is.

No customer said: ask which, or save on your own house with its id. Without `folder` the place is proposed and said; with `task` and `moment` it is tied there too. The same bytes twice are one file. Say where it landed: a file by `file.ref` and `file.folder`, a text by `result.id`; the reply carries its undo.

## a text in the conversation

input:
```json
{"tool":"write","args":{"op":"save","text":"# Notes\n\nWhat was agreed.","name":"notes.md","customer":"<customer>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Sparat: «notes.md», bland filerna för <customer>.","now":"Sparat: «notes.md», bland filerna för <customer>.","then":"Det syns i listan där det sparades och kan flyttas därifrån."}}
```
next:
```json
null
```

## a file whose bytes you read (here 30 bytes)

input:
```json
{"tool":"write","args":{"op":"save","base64":"<base64 of the file's bytes>","name":"offer.pdf","mime":"application/pdf","customer":"<customer>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Sparat: «offer.pdf», bland filerna för <customer>.","now":"Sparat: «offer.pdf», bland filerna för <customer>.","then":"Det syns i listan där det sparades och kan flyttas därifrån."},"file":{"ref":"file:748a234fd582a54e82ee7cf003387ef11811e182ed609159c2c35a47daae0ef6","name":"offer.pdf","folder":"customer/claude/filer","proposed_place":true}}
```
next:
```json
null
```

## a file over 256 kB, part 1 of 2

input:
```json
{"tool":"write","args":{"op":"save","name":"report.pdf","mime":"application/pdf","customer":"<customer>","chunk":{"id":"chat-upload-1","index":0,"total":2,"sha256":"<sha256 of the whole file>"},"base64":"<base64 of bytes 0 … 262143>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Delen är sparad; 1 av 2 delar återstår. Filen kopplas när den sista har kommit.","now":"Delen är sparad; 1 av 2 delar återstår. Filen kopplas när den sista har kommit.","then":"Skicka nästa del med samma chunk.id; filen sparas när den sista delen har kommit."},"chunk":{"id":"chat-upload-1","missing":[1],"total":2}}
```
next:
```json
null
```

## a file over 256 kB, part 2 of 2

input:
```json
{"tool":"write","args":{"op":"save","name":"report.pdf","mime":"application/pdf","customer":"<customer>","chunk":{"id":"chat-upload-1","index":1,"total":2,"sha256":"<sha256 of the whole file>"},"base64":"<base64 of bytes 262144 … 263167>"}}
```
output:
```json
{"phase":"done","say":{"happened":"Sparat: «report.pdf», bland filerna för <customer>.","now":"Sparat: «report.pdf», bland filerna för <customer>.","then":"Det syns i listan där det sparades och kan flyttas därifrån."},"file":{"ref":"file:da16c6f3b4726943269b1d20974dbd804e96195ff3b41b4d73af086b13d77a89","name":"report.pdf","folder":"customer/claude/filer","proposed_place":true}}
```
next:
```json
null
```

## a file you only see (no bytes)

input:
```json
{"tool":"read","args":{"op":"upload_link","customer":"<customer>"}}
```
output:
```json
{"phase":"read","say":{"happened":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","now":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","then":"Fortsätt med nästa sak."},"upload":{"page":"https://<dirigenten>/upload?t=<signed>","expires_at":"2026-01-01T09:30:00Z","max_bytes":26214400,"max_files":20,"for":{"customer":"<customer>","folder":"Uppladdat","type":"core.asset.material"}}}
```
next:
```json
null
```
