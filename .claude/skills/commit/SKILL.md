---
name: commit
description: Commit the current changes as logical commits with project-style messages, after the user's approval. Use only when the user explicitly asks to commit; never commit on your own initiative.
argument-hint: "[optional: what to include, or a message hint]"
---

# Commit

Request: $ARGUMENTS

## 1. Inspect
- Run `git status --short`, `git diff`, `git diff --staged`, and `git log --oneline -10` to see the current style.
- Never commit any of these. If something looks like one, stop and tell the user:
  - `backend/.env*` or Supabase `.env.keys` / `.env.*.local` files
  - keys or tokens: Supabase service-role, JWT, Resend, Google OAuth secrets or refresh tokens
  - `.claude/settings.local.json`, `.claude/private/` or `CLAUDE.local.md`
  - real personal data (names, emails of real participants) in seeders or fixtures
- `sciart-org/AppSciArt` is a **public** repo. Commit messages must not describe vulnerabilities. Word
  security fixes generically until they are released.

## 2. Group
- Make one commit per purpose (a feature, a fix, a refactor, a tooling change). Each commit should leave the
  repo consistent. For example, an API spec change goes together with its controller change, and a
  migration goes together with its model change.
- If there are changes the user did not mention and that are unrelated, ask whether to include them.

## 3. Draft messages
- The subject is a single line, `type: summary`: lowercase, imperative, no trailing period, at most 72
  characters. Add no other body than the issue trailer below, unless the user asks for one.
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
- Write in English. Add no `Co-Authored-By` or other AI attribution lines.

### Related issue
- Every commit names the GitHub issue of the task it belongs to, as a trailer after a blank line:
  - `Refs #<n>` while the task still has commits to come.
  - `Closes #<n>` on the last commit of the task.
- Find the issue in `docs/project/tracking/github-project.json`: the `issueNumber` of the task's item (e.g. the
  `UC-004` item for the UC-004 acceptance tests). If no item fits, or it's unclear whether this is the task's
  last commit, ask the user.
- Security items are private drafts with no issue: reference nothing, and never mention them.
- When showing the planned commit, say which trailer it gets and why.

```
test: add acceptance tests for viewing hackathons

Closes #179
```

## 4. Approve, then commit
- Show each planned commit with its files and its message, then wait for an explicit go-ahead. Approving
  a plan that includes commits is not a go-ahead to run `git commit`.
- Stage files explicitly (`git add <paths>`, never `git add -A` or `git add .`). Commit with
  `git commit -m "<subject>" -m "Refs #<n>"` (or `Closes #<n>`).
- Never use `--no-verify`. The Husky pre-commit hook runs lint-staged (`lint:fix`). If the hook fails, show
  the output and stop. If the hook reformats files that stay modified afterwards, point them out.
- Afterwards, show `git log --oneline -<n>` and `git status --short`.
- Never push, amend, rebase, or force anything unless the user asks.
