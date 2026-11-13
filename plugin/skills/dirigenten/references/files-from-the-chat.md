# A file in the chat into the file bank

When: the user attached a file, or you made one, and it should be in the file bank.

Decide by what you hold of the file, then send one call. Fields go at the top of `write`, never inside `entry`. Never type a file's bytes out yourself.

1. The words are in the conversation (a text, markdown, html, csv, json you wrote or were given): `write{op:"save", text, name, customer}`. Add `as_file: true` to keep it as a file with the type of its name's ending (`.html`, `.csv`).
2. The file is in your workspace (claude.ai's code tool: `/mnt/user-data/uploads/…` or a file you made in `/mnt/user-data/outputs/`; Cowork or Code: the file on disk): `read{op:"upload_link", customer, for_task?, for_node?}`, then code sends the file to `upload.page`; the bytes go straight to the server, not through your text:
   - `curl -sS --upload-file report.pdf "<upload.page>&name=report.pdf"` (PUT of the raw bytes), or `curl -sS -F file=@report.pdf "<upload.page>"` (multipart; the name comes from the file). A path with spaces or å ä ö in quotes, the name in the address percent-encoded: `curl -sS --upload-file "/mnt/user-data/uploads/min fil åäö.pdf" "<upload.page>&name=min%20fil%20%C3%A5%C3%A4%C3%B6.pdf"`. Only these flags: `-sS`, `--fail`; never `-`, `-K` or other flags (the guard stops them).
   - The type is read from the file's first bytes, else Content-Type, else the name's ending. The reply is short JSON: `ok`, `ref`, `sha256`, `name`, `mime`, `bytes`; 202 with `pending` means received, still being written. Confirm with `read{op:"find_file", q:"<name>", customer}`.
   - At most 4 MB per request. Larger, up to 20 MB: parts of at most 4 MB with `&name=<name>&sha256=<sha256 of the WHOLE file>&part=<i>&parts=<n>` (`split -b 4000000 file part_`, `shasum -a 256 file`); the last part saves the file.
   - The link is tied to the customer (and task) it was made for, lasts 30 minutes, takes up to its `max_files` files and carries no login. curl is allowed only to an upload_link.
   - claude.ai: the code tool reaches only allowed domains (organization setting Capabilities → Code execution → network egress: «Package managers only», «All domains» or extra domains) (?). If curl gets 403 or `host_not_allowed`, take step 3 or 4, and ask an admin to allow `rotor-dirigenten.netlify.app` (?: reports say the extra-domains list is not always applied, and a new chat is needed after a change).
3. Base64 only for a file under about 8 kB, and only when curl does not work: `write{op:"save", base64, name, mime, customer}`.
4. You only see the file (an attachment shown as an image or text, no path you can read), or curl does not reach the server: do not retype it or send a screenshot as the file. `upload{customer}` and tell the user to drop the file in the box that appears (or open the link); it is saved as it is.

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

## a file in the workspace: first the link, then `curl -sS --upload-file offer.pdf "<upload.page>&name=offer.pdf"`

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

## a file under 8 kB when curl does not work (here 30 bytes)

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

## a file you only see (no bytes), or curl does not reach the server

input:
```json
{"tool":"upload","args":{"customer":"<customer>"}}
```
output:
```json
{"phase":"read","say":{"happened":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","now":"Uppladdningsrutan visas i chatten: användaren släpper en eller flera filer där (högst 25 MB och 20 filer, gäller i 30 minuter), och de sparas direkt. Syns ingen ruta: ge användaren länken https://<dirigenten>/upload?t=<signed>, samma sak på en egen sida.","then":"Fortsätt med nästa sak."},"upload":{"page":"https://<dirigenten>/upload?t=<signed>","expires_at":"2026-01-01T09:30:00Z","max_bytes":26214400,"max_files":20,"for":{"customer":"<customer>","folder":"Uppladdat","type":"core.asset.material"}}}
```
next:
```json
null
```
