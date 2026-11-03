#!/usr/bin/env bash
input=$(cat)
command=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')
case "$command" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
subject=$(git log -1 --format=%s 2>/dev/null) || exit 0
committed_at=$(git log -1 --format=%ct 2>/dev/null) || exit 0
seconds_ago=$(( $(date +%s) - committed_at ))

[ "$seconds_ago" -gt 120 ] && exit 0
[ "$subject" = "chore: update board status" ] && exit 0

jq -n --arg subject "$subject" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: ("A commit was just created (\"" + $subject + "\"). Once every commit of this batch is done, run /log-step for the board item these commits belong to, without asking the user first. Stop only where log-step itself says to stop (e.g. create public lines in the dry run).")
  }
}'
