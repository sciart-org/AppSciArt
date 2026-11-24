#!/usr/bin/env bash
input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')

case "$file" in
  */docs/project/testing/history.md) exit 0 ;;
  */CLAUDE.md | */backend/tests/HELPERS.md) ;;
  */docs/project/*.md | */.claude/rules/*.md | */.claude/skills/*.md | */.claude/agents/*.md) ;;
  *) exit 0 ;;
esac

repo=$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null) || exit 0
checker="$repo/docs/project/tools/check_decision_citations.py"
[ -f "$checker" ] || exit 0

output=$(python3 -I "$checker" 2>&1) && exit 0

jq -n --arg output "$output" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: ("check_decision_citations.py fails after this edit:\n" + $output + "\nIt must pass before committing (decision skill, step 6).")
  }
}'
