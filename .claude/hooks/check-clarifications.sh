#!/usr/bin/env bash
input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')

case "$file" in
  */docs/project/decisions.md) project_docs=${file%/decisions.md} ;;
  */docs/project/clarifications/*.md) project_docs=${file%/clarifications/*} ;;
  *) exit 0 ;;
esac

checker="$project_docs/tools/check_clarifications.py"
[ -f "$checker" ] || exit 0

output=$(python3 -I "$checker" 2>&1) && exit 0

jq -n --arg output "$output" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: ("check_clarifications.py fails after this edit:\n" + $output + "\nExpected midway through adding a decision row and its clarification; it must pass before committing (decision skill, step 6).")
  }
}'
