---
name: log-step
description: Record a finished step everywhere it is tracked (board item, docs/project/README.md "Now", decisions, findings) and sync the GitHub boards. Use after each committed step of a roadmap phase, a test requirement or a docs task.
argument-hint: "[board item key, e.g. UC-006/007 or 3.9]"
---

# Log step

Item: $ARGUMENTS

A step is only finished once every place that tracks it agrees: the board item, the status in
`docs/project/README.md`, the decision log and the findings register. This skill updates them in order and syncs the
GitHub boards, so status is never kept in two diverging copies.

**When to run:** right after the commit(s) that finish a tracked piece of work.
- A requirement's acceptance tests are committed (step 12 of `/test-requirement` calls it).
- A step of a roadmap phase or a docs task is committed (e.g. a bug fix, a restructure step).
- Not for commits outside any board item, nor mid-step before anything is committed.

Claude runs it after such commits; the user can also run `/log-step <item>`, e.g. after committing by hand.

| # | Update | Where | Notes |
|---|---|---|---|
| 1 | Board item | `docs/project/tracking/github-project.json` (security: `.claude/private/tracking/security-items.json`) | `status`; append short hashes to `commits` (`a1b2c3d, e4f5g6h`). |
| 2 | Status | `docs/project/README.md` "Now" and the Phases table | Only if the phase, the done list or the next item changed. |
| 3 | Decisions | `docs/project/decisions.md` (security: `.claude/private/decisions.md`) | Redundancy check first (rule at the top of the log). Supersede, never edit. |
| 4 | Findings | `.claude/private/findings.md` | New red tests or fixes: status `fixed <sha>`, issue number. A new non-security bug also gets a public item (kind `Bug`, parent `P2`, label `bug`). |
| 5 | Dry run | `python3 -I docs/project/tools/sync_project.py --dry-run` | Show the list. Creating public issues is outward-facing: **stop** for approval if the list has `create public` lines. |
| 6 | Sync | `python3 -I docs/project/tools/sync_project.py` | Then a second dry run must show 0 items. |
| 7 | Commit | `commit` skill | The tracked files changed here (manifest, README, decisions) go with the task's next commit; if none follows, a `chore: update board status` commit. |

Public text never names open security findings: they stay in the private files until the fix is released.
