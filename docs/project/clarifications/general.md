# General clarifications

Rules that apply to several use cases. Formerly testing plan §3 and §9 Q1–Q10, Q12, Q14.

## Actors
- Guest = no token. Participant = any authenticated user without a staff role.
- Staff = Facilitators, Designers and Administrators.
  - Designers can do every Facilitator task; Facilitators can't do Designer tasks.
  - Designer-only use cases: UC-029, UC-031, UC-033 (the SRS actor is the Designer).
  - Administrators can do everything Designers and Facilitators can.
- Inspiring scientist = invited to that edition. Evaluator = assigned to that hackathon.
  Group voice / team speaker = participant holding that role in their group or team.

Decisions: D-014, D-016, D-036.

## HTTP meaning
- "Rejected" for a guest → `401`. "Rejected" for a logged-in user without permission → `403`.
- "Cancelled" / invalid operation → any `4xx` **and** the state is unchanged when read back.
- Success → `2xx` **and** the effect is visible when read back through the API.

Decisions: D-014.

## Edition states
| SRS term | API value |
|---|---|
| not announced | `PLANNED` |
| announced / publicly visible (incoming or ongoing) | `ACTIVE` |
| closed: hackathons over, catalogue being prepared, descriptions still editable | `CLOSED` |
| published: shown apart from ongoing editions, with its catalogue (compulsory), no editing possible | `PUBLISHED` |

- Order: `PLANNED → ACTIVE → CLOSED → PUBLISHED`. Closing creates the catalogue.
- `CLOSED` editions are visible to guests, listed with the ongoing ones.
- "Finished" edition = `PUBLISHED` only.

Decisions: D-015, D-016, D-024.

## Hackathon states and phases
| SRS term | API value |
|---|---|
| not announced | state `PLANNED` |
| announced (open, upcoming, enrolment allowed) | state `OPEN` |
| closed (no more enrolment, not started) | state `CLOSED`, phase `PREPARING` |
| started / ongoing | state `CLOSED`, phase `GROUP_CREATION` … `TEAM_PRESENTATION` |
| ended / past | state `FINISHED` |
| group work / group presentations / team creation … | phases `GROUP_WORK`, `GROUP_PRESENTATION`, `TEAM_CREATION`, `TEAM_WORK`, `TEAM_PRESENTATION` |

Decisions: D-014.

## Announcing (fully specified)
- Edition: name, year, short description, long description and logo (BRU-004). The Drive link and id are
  implementation details.
- Hackathon: every attribute, except the location if online and the meet link.
- Meet link: not needed to announce; needed before starting, only for online and hybrid hackathons.

Decisions: D-014, D-015, D-021.

## Other answers
- UC-047: the facilitator marks assistance.
- Reopening conceptual maps (UC-059) and flowers (UC-062) is a requirement (the SRS text only describes reopening
  for seeds, UC-080, and fruits, UC-081). Tested with issues #207 and #213; moves to `UC-059.md` and `UC-062.md`
  when those use cases are clarified.

Decisions: D-014.

## Consistent states across entities
Only states the system can reach exist (fixtures build nothing else):
- Edition `PLANNED` → hackathons only `PLANNED`. `ACTIVE` → any hackathon state. `CLOSED` / `PUBLISHED` → only
  `FINISHED` hackathons.
- Flowers only in team phases (`TEAM_CREATION`…`TEAM_PRESENTATION`) or `FINISHED` hackathons, any flower state.
- Fruits only for `FINISHED` hackathons and `PUBLISHED` flowers, in any fruit state. A fruit can be published in
  any non-planned edition; publishing an edition doesn't require all its fruits published.
- Hackathon seeds are `PUBLISHED` and belong to the hackathon's edition (BRU-039).
- In edition details, unpublished fruits are shown to nobody (staff included).

Decisions: D-026.
