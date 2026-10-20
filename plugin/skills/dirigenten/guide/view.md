# Guide: view
The view (overview) is the user's own artifact. Never read the view's html (half a megabyte): not with `read`, not from a file. «Update the view» is done by the view itself («Uppdatera nu» in it), never by you.

Steps
1. Open `views_url` first. The user has it when `read{op:"view_file"}` answers «Öppna din vy: <views_url>» (or the guide's first line, or `read{op:"settings"}`): open it with Artifact `open` (the answer's `next`); that is all.
2. No own view (● and can be undone): in Cowork and the app, `cp` the plugin's `skills/dirigenten/dirigenten.html` to the working folder (do not open it), read the small `skills/dirigenten/manifest.json`, and publish the file with Artifact, `capabilities` from the manifest.
3. On claude.ai on the web, where plugin files do not exist: `read{op:"view_start"}` gives a start page of a few kB and its `capabilities`; write `html` to a file and publish it. The page fetches the view itself.
4. Save the address: `write{op:"registry_define", change:true, node:{id:<the person's id>, views_url}}`.

Example 1: «Uppdatera vyn» from the owner: say that the view updates itself with «Uppdatera nu»; do nothing more.
Example 2: a colleague without an own view: publish the start page, save `views_url`, link it.
Counterexample: reading the view's html in parts to publish it, or publishing someone else's view (only its owner can).
Edge case: someone else's view is never updated by you; it is always current on the skill's `/vy` address (sign-in with the work account): say so, do nothing more.