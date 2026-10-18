# Guide: severity
Every action has a severity from its effect (verb and reach).

Steps
1. ● (changes inside the house): do it directly and offer `undo`.
2. ◐ (archives, or hard to notice): ask once per task and calendar day (Europe/Stockholm); the yes lapses when the task is left.
3. ■ (sends, publishes, deletes, leaves the house, customer systems, money, rights): call without approval to get `preview`, show it, then send `preview_id` and `user_approval` with the verbatim yes. Never send `user_approval` before the user has said yes to the very preview you showed; a yes given before the preview, or to a draft, does not count for ■.
4. Never put a ■ action in a `batch`; it is refused.

Example 1: `act{…, action:"done_outside"}` is ● and runs at once.
Example 2: `act{…, action:"yes", preview_id:"pv2.…", user_approval:"Ja, skicka"}` after the preview of the same fields.
Counterexample: sending `user_approval` without a preview, or with the preview of other fields, is never written.
Never send `origin: "view_click"` or `view_session`: only the view sets them when the user clicks, and the log shows every such call. You relay the user's words in `user_approval`.
Edge case: a yes given yesterday or in another task does not cover today's ◐; ask again.