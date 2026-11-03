# Fixture consistency rules

Test fixtures only build states the system can reach. Each rule below is enforced by a fixture check that throws
`Unreachable state: …`. An infra test (`backend/tests/infra/fixtures.test.js`) proves the check works.

- **Where the rules come from:** the SRS or a product owner answer. The current answers are in
  `clarifications/general.md` ("Consistent states across entities").
- **Adding a rule:** add a row here, the check in `backend/tests/support/fixtures/consistency.js`, its infra test,
  and the row in `backend/tests/HELPERS.md` "Consistent states".

## Editions and hackathons
| Rule | Source | Check | Infra test |
|---|---|---|---|
| A `PLANNED` edition only has `PLANNED` hackathons | D-026 | `ensureHackathonFitsEdition` | "a %s edition can / cannot have a %s hackathon" |
| An `ACTIVE` edition can have hackathons in any state | D-026 | `ensureHackathonFitsEdition` | same |
| `CLOSED` and `PUBLISHED` editions only have `FINISHED` hackathons | D-026 | `ensureHackathonFitsEdition` | same |

## Seeds, groups and teams
| Rule | Source | Check | Infra test |
|---|---|---|---|
| A hackathon's seeds are `PUBLISHED` | BRU-039 | `ensureSeedFitsHackathon` | "a hackathon cannot use an unpublished seed" |
| A hackathon's seeds belong to its edition | BRU-039 | `ensureSeedFitsHackathon` | "a hackathon cannot use a seed of another edition" |
| Groups and teams only use seeds assigned to their hackathon, so a flower's seed is always published | UC-058, UC-061, BRU-039 | `ensureSeedOfHackathon` | "a group / team cannot use a seed that is not assigned to its hackathon" |
| Flowers exist only in team phases (`TEAM_CREATION` … `TEAM_PRESENTATION`) or `FINISHED` hackathons | D-026 | `ensureHackathonHasTeams` | "a team cannot exist in phase %s" |

## Fruits
| Rule | Source | Check | Infra test |
|---|---|---|---|
| Fruits exist only for `FINISHED` hackathons | D-026 | `ensureHackathonHasFruits` | "a fruit cannot exist for a hackathon that has not ended" |
| A fruit comes from a `PUBLISHED` flower | D-026 | by construction: `aFruit` builds its own published flower and takes no flower | "aFruit builds its chain inside the given edition…" |
| A fruit given both a hackathon and an edition must be in that edition | D-026 | `ensureSameEdition` | — |
| A fruit can be in any state, in any non-planned edition | D-026, D-041 | — (allowed) | — |
