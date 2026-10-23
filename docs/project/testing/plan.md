# Acceptance testing plan

Phase 1a: a black-box test safety net, built before any fix and before the release. Every expectation comes from
the SRS and the product owner's clarifications, never from the implementation. `general.md` and `UC-xxx.md` below
refer to files in `../clarifications/`. History of this plan: `history.md`.

Security-related expectations are kept out of this public plan until the related fixes are released.

## 1. Rules
The rules (sources of expectations, black-box, arrange / act / assert, red tests) live in
`.claude/rules/acceptance-tests.md`, which Claude Code loads when working on the tests or these docs.

## 2. Scope
**In scope: the 43 implemented use cases** (✅ or partly implemented in `02-srs-coverage.md`) and every business rule,
functional and information requirement attached to them:
UC-002–008, 018–020, 024, 029, 031, 033–038, 041–044, 047–064, 066, 067; BRU-001, 002, 004, 007–012, 014, 015, 017,
018, 023–025, 032, 034, 036–044, 048; FRQ-001, 003, 005, 007, 011, 017, 020–025; IRQ-001–003, 005–011; NFRQ RBAC.

**Out of scope** (use case not implemented yet, Phase 4–5): UC-001, 009–017, 021–023, 025–028, 030, 032, 039, 040,
045, 046, 065, 068–081 and their rules (BRU-003, 005, 006 partly, 013, 016, 019, 020, 026–031, 033, 035, 045–047;
FRQ-002, 004, 006, 008–010, 012–016, 018, 019, 026).


Closing and publishing editions are not implemented yet (UC-032, UC-072, Phase 4–5), so `CLOSED` and `PUBLISHED`
editions are only created by fixtures here.

## 3. Execution steps
Branch `tests/acceptance` off `release/v1.0.0`, one approval each; from A2 on, one requirement at a time (§8).
Current status: `../README.md` "Now".

| Step | Content |
|---|---|
| A0 | User answers the open questions; vocabulary final (`general.md`) |
| A1 | Infrastructure §6 + `createApp()` split + 1 test (UC-002 empty list) |
| A2 | §4.1 browsing + §4.2 accounts/roles |
| A3 | §4.3 enrolment + §4.4 scientists/seeds |
| A4 | §4.5 editions + §4.6 hackathons |
| A5 | §4.7 groups + §4.8 teams/flowers/rubrics (API + sockets) |
| A6 | §4.9 journey + §4.10 RBAC matrix + status report §7 |
| A7 | CI workflow |
| A8 | Playwright §5 |
| A9 | Baseline: full run, findings logged, report reviewed with the user |


## 4. Test plan per use case
Each line is one test (or a small group). Missing parts of these use cases are listed in §4.11, not tested yet.

### 4.1 Browsing (Guest / User)
**UC-002 View editions**
- Guest sees announced (`ACTIVE`) editions.
- Guest sees published editions, listed apart from ongoing ones (`general.md`, edition states).
- Guest sees `CLOSED` editions, listed together with the ongoing ones (`UC-002.md`).
- Guest does not see not-announced editions.
- With no announced edition, guest gets an empty list.

**UC-003 Edition details**
- Guest gets the full description of an announced edition.
- Published edition: details include its catalogue and a summary of its resulting fruits (UC-003, `general.md`).
- Guest cannot see the details of a not-announced edition.

**UC-004 View hackathons**
- Guest sees announced hackathons, incoming and past.
- Guest does not see not-announced hackathons.
- With none, empty list.
- Authenticated user: hackathons they are enrolled in or participated in are marked as such; others are not.
- Private hackathons: staff only. Staff see not-announced ones too. No filter in the list; `closest` and `active` go with hackathon details (`UC-004.md`).

**UC-006 Explore products / UC-007 Product details** (+ BRU-018)
- Guest lists the seeds, flowers and fruits of an edition; only publicly visible (published) products appear.
- An unpublished seed never appears to a guest or a plain participant (BRU-018).
- Guest gets the details of a published seed, flower and fruit.
- Guest cannot get the details of an unpublished product.

### 4.2 Accounts, authentication, profile
**FRQ-001 Authentication**
- Valid email + password logs in and returns a working session (real local Supabase Auth).
- Wrong password / unknown email is rejected.
- Every restricted operation in §4 rejects a guest (`401`).

**UC-005 registration path** (unregistered user)
- Giving email + full name pre-registers the user and sends an email (UC-005 postcondition).
- A pre-registered user can complete registration and then log in.
- Pre-registering an email that is already registered is rejected.

**UC-008 View my profile** (+ IRQ-001)
- Authenticated user gets their own information: email, full name, and the optional fields if set (gender, age
  range, affiliations, areas of interest/description, social networks), plus roles.

**BRU-001 / FRQ-003 Multiple roles**
- A user who is both facilitator and inspiring scientist can do both kinds of operations.
- Roles returned for that user include both.

**BRU-002 Role scope**
- Staff roles are global: a facilitator can act on every edition/hackathon.
- Evaluator role is per hackathon: an evaluator of H1 has no evaluator view of H2.
- The same user can be evaluator of two hackathons. (#228)
- Inspiring scientist role is per edition: scientist of E1 cannot create seeds in E2 (also BRU-034).

### 4.3 Hackathon enrolment
**UC-005 Join a hackathon** (+ IRQ-007, FRQ-005)
- Participant joins an announced, upcoming hackathon giving roles and reasons → enrolled; roles and reason stored and
  readable.
- Joining a hackathon that is not announced, closed, ongoing or ended is rejected.
- Joining twice doesn't create a second enrolment.
- After joining, UC-004 marks that hackathon as enrolled for the user.

**UC-042 View enrolled users**
- Facilitator gets the list of enrolled participants; empty list when none.
- Participant / guest rejected.

### 4.4 Inspiring scientists and seeds
**UC-035 Invite scientists to an edition** (+ FRQ-007, BRU-008, BRU-033)
- Facilitator invites an existing user → that user becomes inspiring scientist of the edition (visible via UC-018).
- Facilitator invites an unknown email → pre-registration + invitation email.
- Inviting to a not-yet-public edition works (BRU-033).
- Inviting to a closed edition is rejected (BRU-008).
- Participant rejected.

**UC-033 Manage scientist invitations** (+ BRU-007, BRU-008, BRU-044)
- Designer sees the editions list for a scientist, marked invited / not invited.
- Designer adds and removes editions → reflected for the scientist (UC-018).
- Facilitator cannot manage these invitations (designer-only, `general.md`).
- Removing an edition where the scientist already created a seed is cancelled (BRU-007).
- Adding a closed edition is cancelled (BRU-008, BRU-044).
- Participant rejected.

**UC-018 View collaborating editions**
- Scientist sees exactly the editions they were invited to, with incoming / ongoing / past distinguished.
- A user who is not a scientist gets an empty list or is rejected.

**UC-019 My seeds of an edition**
- Scientist gets the seeds they created or collaborate on in that edition; not other scientists' seeds.
- Empty list when none.

**UC-020 Create a seed** (+ BRU-034, BRU-015, FRQ-022, IRQ-002)
- Scientist invited to the edition creates a seed → it exists, is editable (in progress), belongs to that one
  edition, and the creator is stored as original author.
- An empty seed template document is generated for it (Drive fake receives the request, based on the edition's master
  template).
- Scientist not invited to that edition is rejected (BRU-034).
- The same scientist can create several seeds in the same edition (BRU-034).
- Plain participant rejected.
- The new seed is not publicly visible (BRU-018).

**UC-024 Fill out seed information** (+ BRU-017, IRQ-002)
- Author updates the seed fields → persisted and readable.
- Optional video, presentation and podcast links are stored.
- Another scientist who is not author or collaborator is rejected.
- Once delivered (in review / published), the scientist can no longer edit it (BRU-017).

### 4.5 Editions (staff)
**UC-029 Create edition** (+ FRQ-020, IRQ-005)
- Designer creates an edition with name, year, descriptions, logo → exists and is not announced.
- Facilitator cannot create an edition (designer-only, `general.md`).
- An empty seed master template is generated (Drive fake).
- Participant / guest rejected.

**UC-031 Announce edition** (+ BRU-004)
- Designer announces a fully specified, not-announced edition → guest now sees it (UC-002).
- Facilitator cannot announce an edition (designer-only, `general.md`).
- Announcing an edition missing any of name, year, short description or long description is cancelled (BRU-004,
  `general.md`). One test per missing field.
- Announcing an already announced edition is rejected.
- Participant rejected.

**UC-036 Modify edition** (+ BRU-044)
- Facilitator modifies edition information → persisted.
- A `CLOSED` edition's descriptions can still be edited (`general.md`, edition states).
- A `PUBLISHED` edition can't be edited at all (`general.md`, edition states).
- After announcement, changes to name and year are reversed (not applied); other changes are applied (BRU-044).
- Participant rejected.

### 4.6 Hackathons (staff)
**UC-037 Create hackathon** (+ BRU-009, FRQ-021, IRQ-006)
- Facilitator creates a hackathon under a not-closed edition → exists, not announced, linked to the edition.
- An empty flower master template is generated (Drive fake).
- Creating under a closed edition is rejected (BRU-009).
- Type on-site / hybrid stores a location; online / hybrid stores a meet link (IRQ-006).
- An online / hybrid hackathon can be created without a meet link (it's only required before start, `general.md`).
- Participant rejected.

**UC-038 Modify hackathon** (+ BRU-012, BRU-038, BRU-039)
- Facilitator modifies information → persisted.
- After announcement, changes to dates, type and edition are reversed (BRU-038).
- Before start, evaluators and seeds can be changed; after start the change is reversed (BRU-012, BRU-038).
- Seeds must be published and from the parent edition; otherwise rejected (BRU-039).

**UC-041 Announce hackathon** (+ BRU-010, FRQ-011)
- Facilitator announces a complete hackathon whose edition is announced → guest sees it (UC-004) and users can join
  (UC-005). (#225)
- Parent edition not announced → cancelled (BRU-010).
- Hackathon information incomplete → cancelled (BRU-010). Every attribute is required, except location for an
  online hackathon. The meet link is never required to announce (`general.md`). One test per missing attribute and
  type.
- Participant rejected.

**UC-043 Close hackathon**
- Facilitator closes an announced hackathon with participants → closed; a new join is now rejected.
- Hackathon with no enrolled participants → cancelled.
- Participant rejected.

**UC-044 Start hackathon** (+ BRU-011, BRU-037)
- Facilitator starts a closed hackathon with evaluators, seeds, start date ≤ today and ≥ 1 participant → started.
- No evaluators → rejected. No seeds → rejected. Start date in the future → rejected. No participants → rejected.
- Online or hybrid hackathon without a meet link → rejected; on-site without one → allowed (`general.md`).
- Participant rejected.

### 4.7 Ongoing hackathon — groups
**UC-047 Enter ongoing hackathon** (+ BRU-048, IRQ-006)
- Assistance is marked by the facilitator, not by the participant (`general.md`); see UC-057.
- Enrolled participant marked as assisting can open the ongoing hackathon and gets the current phase's section.
- A participant cannot mark their own (or anyone's) assistance.
- Not-enrolled user cannot enter (BRU-048).
- Hackathon not ongoing → cannot enter.
- Admins, facilitators and the hackathon's evaluators can enter (BRU-048).

**UC-057 Assistance control**
- Facilitator lists assisting participants; adds and removes one manually → reflected.
- Participant cannot change someone else's assistance.

**UC-058 Create exploring groups** (+ BRU-032, BRU-041, IRQ-008)
- Facilitator creates one group per seed and assigns assisting participants → groups list shows members and seed.
- Exactly one group voice per group (BRU-032): assigning a second voice is rejected or replaces the first.
- A participant can't be in two groups of the same hackathon (BRU-041).
- Non-assisting participants are not part of grouping (IRQ-006 assisting participants).
- The hackathon can't move on to group work while an assisting participant has no group or a group has no voice
  (consequence of UC-058 + BRU-032).
- Participant / evaluator cannot create groups (BRU-025, RBAC).

**UC-048 Develop conceptual map** (+ FRQ-017, BRU-040, IRQ-009)
- Two members of the same group connected by socket: a change from one reaches the other.
- The map content is stored: after everyone disconnects, reading the map returns the last content (IRQ-009).
- After delivery, edits from members are not applied (BRU-040).

**UC-049 Submit conceptual map** (+ BRU-024)
- Group voice delivers → map delivery status is "delivered".
- A member who is not the voice is rejected (BRU-024). A non-member is rejected.
- Delivering twice is rejected.

**UC-059 Follow up group work**
- Facilitator lists the groups and sees each map's progress and delivery status.
- Facilitator reopens a delivered map → members can edit it again and it must be delivered again; reopening a map
  that is not delivered is rejected; participants cannot reopen (`general.md`: a requirement, user decision).

**UC-060 Manage group presentations / UC-051 Present map** (+ BRU-025, IRQ-006)
- Facilitator sets the presenting group → all participants in the hackathon room receive it.
- The group voice's group receives "your turn" (UC-051).
- The current presenting group is stored: a client that connects later gets it (IRQ-006).

**UC-050 Rate seed / UC-052 Submit ratings** (+ BRU-023, BRU-042, IRQ-007)
- Participant rates a presented seed 1–5; values outside 1–5 are rejected.
- Participant can rate their own group's seed (BRU-023).
- Submitting before rating all presented seeds is rejected.
- After submitting, changing a rating is rejected (BRU-042).
- Ratings are stored: still available after a server restart (IRQ-007). (#229)
- Facilitator receives the submitted ratings (input for team creation).

### 4.8 Ongoing hackathon — teams, flowers, rubrics
**UC-061 Create co-creation teams** (+ BRU-032, BRU-041, IRQ-010)
- Only after group presentations have ended.
- Facilitator creates teams per seed, assigns assisting participants and one team speaker each.
- One speaker per team (BRU-032); one team per participant (BRU-041).
- Can't move on to team work while an assisting participant has no team or a team has no speaker.
- Facilitator can see participants' ratings and disciplines while forming teams.

**UC-053 Develop flower** (+ IRQ-003)
- Team member sees the seed, the conceptual maps created for that seed, and the flower template link.
- Each team has its own flower template generated from the hackathon's master template (Drive fake).

**UC-054 Submit flower** (+ BRU-024, BRU-036)
- Team speaker delivers → flower delivered.
- Non-speaker member rejected; non-member rejected; delivering twice rejected.
- After delivery, members can't edit the flower information (BRU-036).

**UC-062 Follow up team work**
- Facilitator lists teams and each flower's progress and delivery status.
- Facilitator reopens a delivered flower → editable again, must be delivered again; reopening an open flower is
  rejected; participants cannot reopen (`general.md`).

**UC-063 Manage team presentations / UC-055 View presenting flower / UC-056 Present flower** (+ BRU-025)
- Facilitator sets the presenting team → assisting participants and evaluators receive it, with a summary of the
  flower and its original seed (UC-055).
- The team speaker's team receives "your turn" (UC-056).
- The current presenting team is stored (IRQ-006).

**UC-064 Fill out rubric** (+ FRQ-025, IRQ-011)
- When flowers are delivered / presented, one empty rubric exists per evaluator × flower (Drive fake).
- Evaluator gets the link to their own rubric for a chosen team.

**UC-066 View hackathon management process** (+ BRU-025)
- Facilitator and evaluator see: assisting participants, groups or teams, maps or flowers.
- Evaluator cannot perform any management action (assign, advance phase, set presenting) (BRU-025).
- Participant cannot see the management view.

**UC-067 End hackathon** (+ BRU-014)
- Facilitator ends the hackathon after team presentations → it appears as past (UC-004).

### 4.9 Full journey (one test)
Edition created → announced → scientist invited → seed created and (fixture) published → hackathon created →
announced → 4 participants join → closed → started → enter → groups → maps delivered → presentations + ratings →
teams → flowers delivered → presentations → rubrics → ended. Acts only through the API/sockets; each step asserts the
SRS postcondition. This test is expected to be red while any step is broken; it shows the first broken step.

### 4.10 RBAC matrix (NFRQ "Role-based access control")
One table-driven test: every restricted operation above × {guest, participant, scientist of another edition,
evaluator, facilitator} → allowed or rejected exactly as the actor column of its UC says.

### 4.11 Deferred: missing parts of implemented use cases (not tested now)
Written when the feature is built (Phase 4–5). Kept here so nothing is forgotten.
- UC-008 View my profile: The response distinguishes public from private information.
- UC-005 Join a hackathon: Joining sends a confirmation email (UC-005 postcondition, FRQ-005).
- UC-035 Invite scientists to an edition: Existing user invited → is notified by email (FRQ-007).
- UC-041 Announce hackathon: Registered users are notified of the new hackathon (FRQ-011).
- UC-058 Create exploring groups: System proposes an initial grouping (FRQ-023).
- UC-061 Create co-creation teams: System proposes teams from ratings and disciplines (FRQ-024, BRU-022).
- UC-064 Fill out rubric: Rubric delivery status is stored (IRQ-011).
- UC-067 End hackathon: Ending while some rubric is not submitted is rejected (BRU-014).
- UC-032 / UC-072: closing an edition, uploading the catalogue, publishing it (catalogue compulsory).


## 5. UI acceptance (Playwright, "the system shows…")
Same black-box rule; only through the browser. Chromium in CI.
1. UC-002/003/004/006/007: guest browses editions, hackathons and products; unannounced items never show.
2. FRQ-001 + UC-008: login as participant and facilitator; profile page shows the user's data; logout.
3. UC-005: participant joins an open hackathon and then sees it marked as enrolled.
4. UC-029/031/037/041: facilitator creates and announces an edition and a hackathon from the forms.
5. UC-058/066: facilitator assigns assisting participants to groups and voices in the management view.
6. UC-048/FRQ-017: two browsers in the same group see each other's map changes.


## 6. Infrastructure (minimal, keeps tests black-box)
- **Real**: Express app, Postgres and Supabase Auth from the local testing stack (`backend/db/test/supabase`).
- **Boundary fakes** for third-party services only (never our own modules):
  - `googleapis` → in-memory Drive that records created/renamed/shared files and returns fake links.
  - `resend` → in-memory outbox; tests assert "user X received an email about Y".
- **Fixtures**: SQL/Sequelize inserts used only in *arrange*; one builder per precondition named after the SRS
  (`anAnnouncedEdition()`, `aClosedHackathonWithParticipants(n)`, `anOngoingHackathonAt('GROUP_PRESENTATION')`).
- **Tokens**: real login once per base user (cached), plus forged tokens for FRQ-001.
- **Isolation**: DB reset per test file; files run one at a time (shared DB).
- **App bootstrap**: the tests need to start the app in-process. This needs a small `createApp()` split of
  `server.js` with no behaviour change. It's the only production-code change in this phase.


## 7. Reporting
- Test names start with requirement IDs, so the run doubles as a **requirements status report**: a small script turns
  the Vitest JSON output into `requirements-status.md` (per UC/BRU/FRQ: pass, bug, gap).
- First full run = the baseline. Red tests are logged as in §8 step 9.
- **CI**: runs everything on every push/PR to `develop` and `main` and publishes the report. While Phase 2 is open the
  acceptance job is informative (doesn't block merges); lint, build and any test that was green before are blocking,
  so nothing that works can silently break. Once Phase 2 is done, the whole suite blocks.


## 8. Writing the tests black-box
The main session has read the implementation, so a fresh agent writes the tests from the SRS and the clarifications
only. The main session owns everything that needs the schema.

| Who | Does | Never |
|---|---|---|
| Main session | Test infrastructure (§6): `createApp()`, boundary fakes, fixtures, tokens, status report; their helper API in `backend/tests/HELPERS.md` is all the agent gets. Briefs, review, findings, commits | Writes test files |
| `acceptance-test-writer` agent | One test file + its coverage map, from one brief | Reads `backend/src`, `frontend/src`, test support code or private material (a hook enforces it) |

### Per-requirement workflow
| # | Step | Details |
|---|---|---|
| 1 | Name the requirement | Quote its SRS text. Ask the user what the SRS doesn't settle, **including the exact allowed response fields per role** (the YAML validation is incomplete; never use it). |
| 2 | Check for existing answers | Before asking or recording: rule at the top of `../decisions.md`. |
| 3 | Record new answers | `../clarifications/<UC>.md` (current truth) + a row in `../decisions.md` (history). |
| 4 | Add missing fixtures | Propose (files, why, infra tests) → go → build → document in `backend/tests/HELPERS.md` → separate commit. |
| 5 | Write the brief | `briefs/<ID>.md` from the template in `briefs/README.md`: SRS text, link to the clarification file, vocabulary, numbered cases `**B<n>**`, fixture notes. |
| 6 | Launch the agent | With only the brief's path. It writes the test file and `briefs/<ID>.coverage.json`, self-checks each case, runs, lints and reports. Its rules live in `.claude/agents/acceptance-test-writer.md`; the hook `.claude/agents/hooks/black-box-guard.py` blocks other reads, writes and commands. |
| 7 | Check coverage | `python3 -I docs/project/tools/check_brief_coverage.py docs/project/testing/briefs/<ID>.md tests/acceptance/<file>.test.js`: every case has a test, no test without a case, no stale names. |
| 8 | Review | Each case's assertions against the brief and the SRS. Run the suite; split tests so each red has one cause. |
| 9 | Log reds | `T<n>` in the private findings register (cause checked in code); a bug issue unless security-related. |
| 10 | Close | Show the user, commit on approval, update the status (`../README.md` "Now", then the board item). |
