---
name: decision
description: Record a decision or a product owner answer (existing-answer check, research, row, clarification, SRS change, check script, commit timing). Use when a choice is made in chat (the user picks an option, says "go with X", "decided", "let's do X"), when a product owner answer arrives, and before asking the product owner a question. Run /decision to record one by hand.
argument-hint: "[the decision or answer, in a few words]"
---

# Decision

Decision: $ARGUMENTS

The decision log is read before every product question and every decision, so a decision that lives only in chat is
lost at the next `/clear`. This skill records it right away. The format rules of the log (what gets a row, topics,
Details length, supersede, never edit) are in the header of `docs/project/decisions.md`: follow them, don't copy
them here. **Stop** marks a point where the user must answer or approve before going on.

| # | Step | Details |
|---|---|---|
| 1 | Check for an existing answer | Rule at the top of `docs/project/decisions.md`: the log and `docs/project/clarifications/`, also implicit answers. Also `.claude/private/decisions.md`. If one covers the point, cite it and stop: no new row. Before asking the product owner a question, this step is all that runs. |
| 2 | Does it get a row? | Header rule "What gets a row". A fact goes into the doc it describes (README "Where new information goes"); tracking admin goes on the board. Say where it goes instead and stop. |
| 3 | Research | Not for product owner answers. Apply "Decisions" in `CLAUDE.local.md`: expert approach, current sources with years, why it fits. **Stop** for the user's choice. |
| 4 | Draft | Row (next `D-nnn` free in both logs: they share the numbering), and Details when it's long: decision, why, options not adopted, sources. A change of mind supersedes the old row. Security-related: `.claude/private/decisions.md` only. **Stop** for approval of the wording. |
| 5 | Write | The row. A product owner answer also goes into `docs/project/clarifications/<UC>.md` (current truth, edited in place). A decision that changes a requirement also gets a dated `pending` row in `.claude/private/srs/srs-changes.md`. A changed answer also updates the briefs that depend on it; their tests are then rewritten by the `acceptance-test-writer` (`/test-requirement` steps 8–12), never by hand. |
| 6 | Check | `python3 -I docs/project/tools/check_clarifications.py` must pass. |
| 7 | Commit timing | With the change it governs, in the same commit (`commit` skill). No code change: its own `docs:` commit in the current step, right after it's made. Never deferred to `/log-step`. |
