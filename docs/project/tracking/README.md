# Tracking

Work is tracked on two GitHub Projects boards, both private. This folder holds the source of the public one.

| Board | Items | Source |
|---|---|---|
| [#4 AppSciArt — Production roadmap](https://github.com/orgs/sciart-org/projects/4) | Repo issues, neutral wording; sub-issues of one parent per phase | `github-project.json` |
| #5 AppSciArt — Security | Draft items only | private file, kept out of the repo |

- A security item becomes a public issue (generic wording) only after its fix is released.
- Views: #4 Board · By phase · v1.0.0; #5 Board · By phase.
- Views can be created with the REST API (`POST orgs/sciart-org/projectsV2/<n>/views` with `name`, `layout`,
  `filter`, `group_by`, `visible_fields`); only deleting a view needs the web UI.

## Syncing
`docs/project/tools/sync_project.py` pushes the manifest to the boards:
- creates missing items, updates changed ones (each item stores a fingerprint of its last sync);
- closes or reopens issues to match `Done`;
- refuses any public item that is of kind `Security` or refers to a private item.

It also syncs the private items when their file is present; without it, it syncs only the public board.

After each step, run the `/log-step` skill (`.claude/skills/log-step/SKILL.md`): it updates the item and syncs
(dry run first).
