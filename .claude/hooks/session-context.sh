#!/usr/bin/env bash
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

branch=$(git branch --show-current 2>/dev/null)
changes=$(git status --short 2>/dev/null)
worktrees=$(git worktree list 2>/dev/null)
now=$(awk '/^## Now/ { inside = 1; next } /^## / { inside = 0 } inside' docs/project/README.md 2>/dev/null)

context="Session context (SessionStart hook).
Branch: ${branch:-detached}
Uncommitted changes:
${changes:-none}
Worktrees:
${worktrees}
docs/project/README.md \"Now\":
${now:-not found}
Before resuming work, read current-work.md in the auto-memory directory and check that it still matches the above."

jq -n --arg context "$context" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $context
  }
}'
