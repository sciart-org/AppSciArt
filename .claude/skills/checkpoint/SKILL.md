---
name: checkpoint
description: Save where the work stands into the current-work memory and say whether it's safe to /clear. Use when the user runs /checkpoint or asks "is it safe to clear?", "can I clear?" or similar.
argument-hint: "[optional: what to note for the next session]"
---

# Checkpoint

Note: $ARGUMENTS

`/clear` loses everything that isn't in a file. This skill makes sure the next session can pick up from the
`current-work` memory, then gives a yes/no answer.

## 1. Check
| Check | How | Blocks clearing when |
|---|---|---|
| Uncommitted changes | `git status --short` | A change isn't committed and isn't in the memory's "never commit" list or noted as going with a later commit |
| Unpushed commits | `git log --oneline @{u}..` | Never: the user pushes. Just list them |
| Log-step | Board item `commits` in `docs/project/tracking/github-project.json` (security: `.claude/private/tracking/security-items.json`) vs `git log` | A committed step hasn't been logged |
| Board sync | `python3 -I docs/project/tools/sync_project.py --dry-run` | It lists items to sync |
| Open questions | This conversation | The user hasn't answered something Claude asked, or a decision isn't recorded yet |
| Background work | Running agents, background shells (`caffeinate`, dev servers) | Something is still running that the user may forget |

## 2. Update the memory
Rewrite the "State" part of `current-work.md` in the auto-memory directory:
- Date, branch, unpushed commits, uncommitted changes and where each one goes.
- Next step, and any open question the next session must ask first.
- The note from the arguments, if any.

Keep it short: milestone and step order stay in `docs/project/README.md` "Now". Don't copy them.

## 3. Answer
- **Safe to clear**: one line on what the next session will pick up (e.g. "Next: plan the seeder, #279").
- **Not yet**: each blocker and its fix (e.g. "run /log-step for 3.12", "stop caffeinate?"). Offer to do the fixes,
  then answer again.

Never commit, push or stop processes from this skill without the user's go.

## Resuming
After a `/clear`, when the user asks "where were we?", read `current-work.md`, check that `git status` and README "Now"
still match it, and report the next step and the open questions.
