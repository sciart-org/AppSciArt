---
name: bug
description: Record a bug the user found while using the app (walkthrough, preprod, demo) as a finding and a board item, find its cause, then fix it only if the user says so. Use when the user runs /bug or reports a bug they saw ("Found a bug:", "Bug:").
argument-hint: "[what you saw]"
---

# Bug

Report: $ARGUMENTS

Bugs are recorded before they are fixed, so none gets lost and each fix has an issue to close. **Stop** marks a point
where the user must answer or approve before going on.

| # | Step | Details |
|---|---|---|
| 1 | Restate | Actor (role), browser, environment (dev, preprod), hackathon phase, steps, expected vs observed. Ask for what's missing. **Stop** if anything is. |
| 2 | Known? | Search `.claude/private/findings.md`, `docs/project/tracking/github-project.json` and `gh issue list --search "<terms>"`. If it's known, link it and stop. |
| 3 | Find the cause | Read only, no edits. Reproduce if it helps (seed or reset the dev DB only after asking). Explain the cause with code references in chat only. |
| 4 | Check the requirement | Is the expected behaviour in the SRS or a clarification? If not, it may be by design: ask. **Stop.** Never call it a bug from the code alone. |
| 5 | Record | See below. **Stop** before the sync creates a public issue. |
| 6 | Fix now or later? | Ask. Default: later. **Stop.** |
| 7 | Fix | Plan, then the go. Fix, test, `commit` skill (`Closes #<n>`), then `/log-step`. Update the finding: `fixed <sha>`. |

## Recording (step 5)
- Next free ID in the walkthrough table of `findings.md` (`W<n>`; IDs are never reused). Columns: ID, finding, where,
  status `open`, issue.
- The board item depends on whether it's security-related:

| Kind | Board item | Public text |
|---|---|---|
| Security | `.claude/private/tracking/security-items.json`: `project: security`, `kind: Security`, `phase: 1`, body ends with `Details: .claude/private/findings.md W<n>.` | None. Issue column `—` |
| Other | `docs/project/tracking/github-project.json`: `project: public`, `parent: P2`, `kind: Bug`, labels `bug` + the current milestone label (as the latest W items), `milestone: v1.0.0` | Title and body describe the behaviour, not code locations |

- Then `python3 -I docs/project/tools/sync_project.py --dry-run`, show the list, and sync after approval.
- Put the issue number into the finding's Issue column.
