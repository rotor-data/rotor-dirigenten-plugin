# Guide: tools
- `search`: find tasks, moments and deliveries; each hit has an `on` for `read`.
- `read`: one subject's envelope with `rev`; `view:"net"` adds the map.
- `guide`: this text, by `phase`.
- `plan_state`: the overview of deliveries (`agenda`, `include`).
- `act`: the only way to do an action: `on`, `action`, `rev`, `params`, `preview_id`, `user_approval`, `batch`; action `undo` takes the last action back.
- `execute_step`: run a capability for a moment (`on`, `rev`, `params`, `test`); the result is always logged.
- `write`: define, append or draft a registry entry (`op`, `entry`, `fixes`); the gate lists what is missing.

Steps
1. `search{q:[…]}` (one to five phrasings) or `plan_state{}` to find the subject.
2. `read{on}` to get the envelope and `rev`; `read{on, view:"net"}` for a task map (60 moments per page, follow `page.cursor`).
3. `act{on, action, rev}` for every action, `execute_step` to run a capability, `write` to define registry entries.
4. `guide{phase}` for details: moment, task, delivery, case, idea, envelope, severity, promptstandard, tools.

Example 1: `search{q:["offer","quote"]}` then `read{on:hit.on}`.
Example 2: `plan_state{agenda:true}` for what is due, ordered by urgency, then end date.
Counterexample: calling a customer's system through another connector when this server has the capability.
Edge case: a legacy call shape (`asset_register`, `{tool,args}` wrapper) is translated while the adapter window is open; `say.now` shows the new form.