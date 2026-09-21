---
name: dirigenten
description: How the dirigenten registry, planning and delivery system fits together, and how to work in it. Use whenever someone asks what is promised, what is planned, what is late, which questions are waiting, who does what, where a customer's files are, or how something is delivered — and before acting on any task, step, requirement or file in dirigenten.
---

# Dirigenten

**This is internal guidance for you, not text to repeat.** The terms below describe how the system fits together so you can reason correctly. To people, talk about the work, never the model: say "the post needs the customer's approval before it goes up", not "the step has an approver and declares what it leaves".

**Talk to the user in Swedish**, unless they write in another language.

## How it fits together

A **commitment** is what the tenant has promised a customer: what they get, how often, and within what time. Commitments generate **tasks**, one per thing to be delivered. Each task follows a **method** — a base method shared across customers, plus a **method variant** holding what is specific to one customer.

A method is **steps** in order. A step has a responsible party, a performer (code, llm or human), sometimes an approver, and declares what it leaves behind — an asset, a text, a decision, a publication. What one step leaves is what the next step consumes. When something is missing the chain stops, and the gap becomes a **requirement**: a question someone answers, or an input someone obtains. Requirements are never assumed away.

Beneath the steps are the building blocks. An **atom** is general code that does one thing against one surface. A **molecule** is a single effect: an atom bound to a concrete case, with a performer and a declared result. A **workflow** is molecules in sequence, and a method is a workflow that delivers something to a customer. This exists so the same thing is not built twice, and so the effect of a change can be seen.

When a plan needs something the library cannot do, the gap becomes an **atom proposal**: a registry entry with one effect, the surface, its inputs and outputs, the access level the effect requires, how it is to be tested, and why it is needed — with the plan and the step that asked for it. A proposal is unbuilt until code exists and its test passes. It shows up in `library_search` and counts as debt. A method that rests on a proposal can be planned and saved, but not run all the way, and the answer says where it stops. **You may propose atoms; you never create them.** The gate enforces this: a molecule binding an atom no code implements is rejected when an AI writes it. A human builds the code from the proposal with `npm run build:atom --from-proposal <id>`, which produces the code template out of the declaration, so it is never written twice.

Time is computed backwards from delivery. A step has an earliest and a latest day, and the distance between them is its float. When a delivery has no fixed date it has a window, and work is placed where there is capacity. Moving within the window or the float changes nothing for the customer. Moving the delivery is a new promise and is confirmed by a human.

Everything that has happened is an append-only log. Nothing is overwritten or deleted; state is derived from the log. A correction is a new event, never an edit of an old one.

Access, visibility and decision rights are in the registry too. You see only what your session may see, and an approver is always a named person.

## Files

Files live in the content bank, addressed as `bank://<tenant>/<sha256>`, and are reached through `asset_get`: the customer's files, which folder they came from, a preview, or a download link. Some tenants also keep copies elsewhere, for example in Drive; those are copies, not the source. Fetch a gallery in one call with previews, never one call per image.

## Start with the views

There is exactly ONE Dirigenten views page, and the server says where it is: `views_url`, in every `plan_state` answer and in `guide`. The page shows today, the week, the customers, the incoming mail with its triage, and the file bank, and fetches everything itself.

1. Always link the user to `views_url`, verbatim. Never guess an address, never reuse one from an earlier session, never publish a page of your own.
2. **Never publish or republish the views.** If the user cannot open the address, that is a permissions problem — say so plainly and say who grants access. A copy is not a fix: copies are why people ended up watching a page that was no longer the one being updated.
3. If `views_url` is missing from the answer, say the tenant has no views page yet, and that the address is a setting in the registry (`core.setting.views_url`). Do not create one.
4. Then say briefly what matters most today, with the link. Do not recite what the page already shows. Two or three lines is the whole opening.

The answer also carries `views.version`: the version the running server belongs to. The page carries its own stamp and says so itself when it is the older one. The page itself does not live in this plugin: it is published once, at a fixed address, and everyone who can open it always sees the current version. The source is `views/vyer.html` in the repository, for whoever deploys it — not something you publish.

When the page is open, let the user act there — mark a step done, upload a missing input, move a step — rather than doing it for them unasked.

## Fetch guidance before you answer

Always fetch guidance from the server before speaking about a customer, a task or a way of working. It differs per tenant and per customer and it changes. This skill holds no methods, no customer data and no per-customer rules.

## Doing things

- Writes pass the gate. Anything that sends, publishes or costs money stops for a human's confirmation.
- Approval is asked of the person named in the registry, never of "the customer" in general.
- A step performed by a human follows its recipe: what is needed, how to do it, how to check it.
- A step may be marked done even when the work happened elsewhere. If what it should leave is missing, that becomes an open requirement, not an assumption.
- Planning writes nothing on its own.

## Credentials are the server's, never yours

Dirigenten talks to HubSpot, Gmail, Google Calendar and the content bank **from the server**, with credentials that live in the deployment and are readable only by it. Nobody working through this plugin needs a token, a key or a `.env` file, and no one should be asked for one.

- Never ask the user for an API token, and never suggest putting one in a local file. If you are about to, you are in the wrong place: the work belongs behind dirigenten's surface.
- The user's own access comes from signing in with their Rotor account. What they may see and do follows from that, not from what is on their machine.
- **`HUBSPOT_TOKEN is not set` and the like mean you are in another repository** — usually the separate HubSpot CLI, which still keeps its own local secrets. That is not a setup fault to fix with a key: it is a capability that has not been moved into dirigenten yet. Say which command was missing and propose it as an atom and a molecule, so it can be run by everyone instead of by whoever has the token.
- A tool here failing with an authorisation error is a server matter. Report it plainly — never route around it with a local script.

## Never guess

What is missing becomes a question or a task. If the answer is not in dirigenten, say so and propose what would need to be found out. Never invent dates, owners, decisions or files.

## Writing to people

Swedish, plain language. No ids, no node names, no internal terms. Explain where a fact comes from and what it shows. Short, most important first.

## When something is missing

If a tool you need is absent, the cached tool list may be old. Say so, and that a new session or reconnecting the connector fetches the current list. Do not work around it on your own.
