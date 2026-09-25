---
name: dirigentvyn
description: Open or update the dirigent view (Idag, In, Planen, Metoder) as the user's OWN artifact, so it works in Cowork. Use when the user asks to open the dirigent view, "dirigentvyn", "vyn", "Idag-sidan", "planen", or when the view says it is outdated or cannot reach dirigenten.
---

# Dirigentvyn — the view as the user's own page

**Talk to the user in Swedish.** Keep it short: say what you do, then do it.

## Why this exists
In the Claude app (Cowork, Code) a page reaches connectors only for its **owner**. A view published by someone else shows "Dirigenten går inte att nå härifrån" here. So each person publishes their **own copy** of the view. The file contains no data — all data comes through the user's own `rotor-dirigenten` connector, with the user's own permissions.

## Do this
1. Use the files that come with this skill, in the same folder as this SKILL.md: `manifest.json` (gives `title`, `version` and `capabilities`) and `dirigenten.html` (the page). No network is needed. Do not edit the page.
   - Only if those files are missing: fetch `https://rotor-dirigenten.netlify.app/vy/manifest` and the page at its `file`, and save the page unchanged as a local `.html` file.
2. Publish `dirigenten.html` as an artifact **owned by the user**, with exactly the manifest's `capabilities` (the `mcp` servers and tools, `sample`, `downloads`) and the title "Dirigenten".
   - If the user already has an artifact titled "Dirigenten" (list their artifacts), **update that one** so the link stays the same.
   - Otherwise publish a new one, and tell the user to pin it.
3. Open it for the user. If the page asks to allow connectors ("Tillåt kopplingarna"), tell the user to allow.
4. Tell the user in one sentence: the view is theirs, it updates when they ask ("uppdatera dirigentvyn") after the plugin has been updated, and the page itself says when a newer version exists.

## If something fails
- The page says a newer version exists: the plugin is behind. Tell the user to update the plugin, then run this again.
- The artifact tool is not available here: say so plainly, and give the user `https://rotor-dirigenten.netlify.app/vy`. It works in any browser, with Google login.
- The page still says it cannot reach dirigenten: check that the user's `rotor-dirigenten` connector is on in claude.ai's connector settings, and that the artifact was published from the user's own account (the owner rule above).
- Never publish someone else's copy, never change the file, never add capabilities beyond the manifest.
