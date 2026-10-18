# Guide: promptstandard
Prompts, recipes and moment instructions for Claude keep exact technical references (ids, calls, parameters, field names, object types, sources).

Steps
1. Six parts: purpose and background; what to read first, with exact sources; steps, numbered; must not; answer format with examples; when to ask.
2. For each tool step state tool and call (`crm.api` with `GET /objects/deals`), parameters, before and after, where the result is saved (`placeOf`), and how to check it is right.
3. Name the failure each rule prevents; write wanted traits as a positive instruction with an example.
4. Keep to few, heavy imperatives (about seven at most).

Example 1: "Read the area (object_type <object_type>) with associations <association_type>; saved at placeOf(task); right when the count equals the source's count."
Example 2: a `write` entry whose steps each carry the five tool parts is saved live; the gate lists what is missing otherwise.
Counterexample: "Use the customer system carefully" names no call and no check, and is refused.
Edge case: incomplete prompts can be saved as drafts (`op:"draft"`) but are not run by Claude or code until complete.