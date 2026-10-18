# Guide: envelope
Every reply carries `envelope`: `subject` (kind, id, rev), `available` (each with `action`, `label`, `does`, `severity`, `primary`), `unavailable` (`why`, what unlocks it), `next`, `ask_user`, `written`, `receipt`, `preview`, `missing`.

Steps
1. Read `available`; the entry with `primary: true` comes first.
2. If `ask_user` is set, ask exactly that and wait.
3. Act on `next` when the user wants to continue.
4. Check `written`: false means nothing was saved; the reason is in `say`.
5. `checked_at` is when the server last tested capabilities; trust it over earlier failures.

Example 1: `available` holds `lock` (primary) and `skip`; offer "take the moment" first.
Example 2: `written:false` with a new `rev`: read again, repeat the action with the new `rev`.
Counterexample: telling the user that a capability does not work because it failed last session. Ask the server again in this call; `checked_at` proves it did.
Edge case: `form:"short"` envelopes hold at most 8192 bytes; ask for `form:"full"` (32768) only when details are needed.