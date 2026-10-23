---
paths:
  - "backend/tests/**"
  - "docs/project/testing/**"
  - "docs/project/clarifications/**"
---

# Acceptance tests: rules

Rules for writing, briefing and reviewing the black-box acceptance tests. Plan and workflow:
`docs/project/testing/plan.md` (§8). Helper and fixture API: `backend/tests/HELPERS.md`.

## Where expectations come from
1. **Source of truth = SRS.** Each test cites its requirement IDs in its name, e.g.
   `UC-041 · BRU-010 · announcing a hackathon whose edition is not announced is cancelled`.
2. **Black-box.** Tests know only:
   - the SRS (what must happen) and the product owner's answers in `docs/project/clarifications/`,
   - the public API contract `api/oas-file.yaml` + `api/paths/*.yaml` (how to call it; the same thing Swagger shows),
   - the socket event names the frontend uses (the real-time contract),
   - the vocabulary (SRS terms → API values) in `docs/project/clarifications/general.md`.
   They never import services, repositories or models, and never assert on internal details.
3. **The YAML is not a validation source.** Its validation is unfinished: use it for paths and field names only,
   never to infer a constraint.
4. **Where the SRS is silent, ask the user first.** Never invent an expectation and never derive one from the code
   (e.g. the SRS doesn't require unique edition names: ask before testing it).
   - Check existing answers first (rule at the top of `docs/project/decisions.md`).
   - Until the user answers, that behaviour isn't tested.
   - HTTP details follow plain HTTP meaning (`general.md`).
5. **Response shapes are exact.** Check which fields are sent (required + allowed optional, nothing else), not just
   that some are included. Ask the user for the allowed field set of each response and role.

## Writing the tests
6. **Arrange / act / assert.**
   - *Arrange* (preconditions) with DB fixtures, so a broken step (e.g. announcing) doesn't cascade into every later
     test. This is test infrastructure only.
   - *Act* only through the public API or sockets, as the right actor (token of that user).
   - *Assert* only through the public API or sockets (e.g. "the guest can now see it in the list"), plus the boundary
     fakes for Drive and email.
7. **Readable tests.** No comments (`CLAUDE.md` style): name each test after its expected outcome, check one
   behaviour, use named actors instead of magic numbers, and assert what the name claims. The "why" of the tooling
   goes in `HELPERS.md` "How it works".
8. **Writer independence.** The test files are written by the `acceptance-test-writer` agent from a brief, not by
   the main session, which has read the code (plan §8).

## Red tests
9. **Bugs are red.** If the system doesn't do what the SRS says, the test fails. No `skip`, no `it.fails`.
   Every failing test becomes a finding (plan §8 step 9).
10. **Two kinds of red**, both visible:
    - `bug`: the implemented behaviour is wrong (e.g. announcing doesn't work).
    - `gap`: part of an implemented use case is missing (e.g. UC-008 has no public/private distinction). Gap tests
      are **not written now** (D-015); they are listed in plan §4.11 and written when the feature is built.
11. **Security-related expectations** stay out of public text (plan, issues, briefs' wording) while their finding
    is open; they are tracked privately and tested like any other case.

## Fixtures and infra (main session)
- Fixtures only build states the system can reach (`HELPERS.md` "Consistent states").
- Data links: fruit → flower → seed → editions. A flower's or fruit's hackathon is only known through
  `participations` rows (member + hackathon + teamId + fruitId).
- `backend/tests/infra/` tests only our own tooling (helpers, fixtures, fakes, reset): no SRS requirement and no
  third-party behaviour.
