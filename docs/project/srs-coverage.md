# SRS coverage

Assessed 2026-10-17: how much of each SRS requirement the current code covers.
- **Source:** SRS v1.0 (2026-06-24), from the Proteus project (kept private, D-033).
- **Bugs:** referenced by public issue number (#…).

**Method**: every OAS operation was mapped to its controller/service (real vs. `mockup`), plus data-model fields,
sockets and frontend features. **Not** verified by clicking through the UI → treat as a strong estimate; confirm
each item when its phase starts.

Legend: ✅ implemented · 🟡 partial / mocked / broken · ❌ missing · ❓ unclear

**Scope**: everything in the SRS *should exist* (post-hackathon and notifications included).

---

## 1. Summary by area
| Area | ✅ | 🟡 | ❌ | Key notes |
|---|---|---|---|---|
| Browse (UC-001–007) | 5 | 2 | 0 | Methodology endpoint is a mock; frontend has a static `Format` page |
| Profile & likes (UC-008–016) | 1 | 6 | 2 | edit/view profile, contributions, likes are **mocks** |
| Scientists & seeds (UC-017–026, 039, 040, 080) | 5 | 3 | 5 | no deliver→review→reopen workflow; invitation has no status |
| Staff mgmt (UC-027–038, 041–046) | 9 | 6 | 3 | announce/close/start hackathon broken by **#225** |
| Live hackathon (UC-047–067) | 15 | 4 | 1 | ratings in memory (**#229**); rubric submission/locking missing; no auto-suggestions |
| Post-hackathon (UC-068–081) | 0 | 1 | 11 | fruit CRUD is a mock; whole stage missing |
| Notifications (FRQ-005–015) | 0 | 1 | 10 | only 3 emails exist (quick register, scientist pre-registration, registration completed) |

## 2. Use cases
| ID | Name | Status | Evidence / notes |
|---|---|---|---|
| UC-001 | View eco-SciArt methodology format | 🟡 | `getEditionMethodology` mock; static frontend `features/hackathons/Format.jsx` |
| UC-002 | View list of editions | ✅ | `getEditions` |
| UC-003 | View edition details | ✅ | `getEditionDetails` (catalogue shown only if `catalogLink` set) |
| UC-004 | View list of hackathons | ✅ | `getHackathons` (+ enrolment marking) |
| UC-005 | Join a hackathon | ✅ | `joinMeHackathon`, quick-register email |
| UC-006 | Explore products of an edition | ✅ | `getSeeds`, `getFlowers`, `getFruitsByEdition` |
| UC-007 | View product details | ✅ | `get{Seed,Flower,Fruit}Details` |
| UC-008 | View my profile | ✅ | `getCurrentUser`; no public/private distinction (FRQ-004) |
| UC-009 | Modify my profile | 🟡 | `editUser` **mock** |
| UC-010 | View other users' profile | 🟡 | `getUserInfo` **mock** |
| UC-011 | Withdraw from a hackathon | ❌ | no endpoint |
| UC-012 | View my creations in a past hackathon | 🟡 | `getUserHackathonContributions` **mock** |
| UC-013 | Take draft notes about a seed | ❌ | no model/endpoint |
| UC-014 | Like a seed | 🟡 | `likeSeed` **mock** (model `SeedLikes` exists) |
| UC-015 | Unlike a seed | 🟡 | `unlikeSeed` **mock** |
| UC-016 | View liked seeds of an edition | 🟡 | `getLikedSeedsOfUser` **mock** |
| UC-017 | Apply as inspiring scientist | ❌ | no endpoint |
| UC-018 | View collaborating editions | ✅ | `getMyScientistEditions` |
| UC-019 | View my seeds of an edition | ✅ | `getMyEditionSeeds` |
| UC-020 | Create a seed | ✅ | `createSeed` (+ Drive template, FRQ-022) |
| UC-021 | Invite collaborator to seed | 🟡 | `ScientistInvitation` has `seedId` but **no status** (IRQ-012) |
| UC-022 | View collaboration invitations | ❌ | — |
| UC-023 | Accept/decline invitation | ❌ | — |
| UC-024 | Fill out seed information | ✅ | `updateSeed` (Drive template) |
| UC-025 | Deliver seed | ❓ | `IN_REVIEW` state exists; explicit deliver + facilitator notification (FRQ-009) not found |
| UC-026 | Delete a seed | 🟡 | `deleteSeed` **mock** |
| UC-027 | Modify user roles | ❌ | no endpoint (FRQ-002) |
| UC-028 | Delete user | ❌ | no endpoint (also GDPR, NFRQ-009) |
| UC-029 | Create edition | ✅ | `createEdition` (+ Drive folder, FRQ-020) |
| UC-030 | Delete edition | 🟡 | `deleteEdition` **mock** (BRU-003 not enforced) |
| UC-031 | Announce edition | ✅ | `announceEdition` (BRU-004 completeness check: verify) |
| UC-032 | Close edition | ❌/🟡 | edition state `CLOSED` exists; frontend Close button is `console.log`; BRU-005/006/008 not enforced |
| UC-033 | Manage scientist invitations | ✅ | `modifyScientistEditions` (BRU-007/008: verify) |
| UC-034 | View list of users | ✅ | `getUsers` |
| UC-035 | Invite scientists to edition | ✅ | `inviteScientistToEdition` + email (FRQ-007 partly) |
| UC-036 | Modify edition | ✅ | `updateEdition` (BRU-044: verify) |
| UC-037 | Create hackathon | ✅ | `createHackathon` (+ flower master template, FRQ-021) |
| UC-038 | Modify hackathon | ✅/⚠ | `updateHackathon` — **#226** (meet link), BRU-012/038: verify |
| UC-039 | View seeds waiting for review | ❌ | — |
| UC-040 | Review seed | 🟡 | `publishSeed` **mock** |
| UC-080 | Re-open seed | ❌ | — |
| UC-041 | Announce hackathon | 🟡 | via `nextHackathonPhase` PLANNED→OPEN — **broken (#225)**; `publishHackathon` mock |
| UC-042 | View users enrolled | ✅/🟡 | `getHackathonUsers` **mock**, but participants come with hackathon details for staff |
| UC-043 | Close hackathon | 🟡 | OPEN→CLOSED — **broken (#225)** |
| UC-044 | Start hackathon | 🟡 | via phase advance; BRU-011 (evaluators+seeds+date) to verify |
| UC-045 | Delete hackathon | 🟡 | `deleteHackathon` **mock** (BRU-013, FRQ-012) |
| UC-046 | Modify methodology format | ❌ | — |
| UC-047 | Enter ongoing hackathon | ✅ | `hasConfirmedAssistance` |
| UC-048 | Develop conceptual map | ✅ | sockets `diagramming.js` + `@xyflow/react` |
| UC-049 | Submit conceptual map | ✅ | `submitConceptualMap` (voice-only: verify BRU-024) |
| UC-050 | Rate seed | 🟡 | sockets; **in memory only (#229)** |
| UC-051 | Present conceptual map | ✅ | group presentations |
| UC-052 | Submit seed ratings | 🟡 | `submit_ratings` socket; not persisted (#229), BRU-042 |
| UC-053 | Develop flower | ✅ | Drive flower template |
| UC-054 | Submit flower | ✅ | `submitFlower` / `reopenFlower` |
| UC-055 | View presenting flower | ✅ | team presentations |
| UC-056 | Present flower | ✅ | team presentations |
| UC-057 | Manage assistance control | ✅ | `updateParticipation` |
| UC-058 | Create exploring groups | ✅ | manual drag-and-drop (no suggestion, FRQ-023) |
| UC-059 | Follow up group work | ✅ | management view |
| UC-060 | Manage group presentations | ✅ | sockets |
| UC-061 | Create co-creation teams | ✅ | manual, shows ratings (no suggestion, FRQ-024) |
| UC-062 | Follow up team work | ✅ | management view |
| UC-063 | Manage team presentations | ✅ | sockets |
| UC-064 | Fill out rubric | ✅/🟡 | rubric Drive docs created per evaluator×flower (FRQ-025) |
| UC-065 | Submit rubrics | ❌ | no delivery status / locking (IRQ-011, BRU-043) |
| UC-066 | View hackathon management process | ✅ | `HackathonManagement` |
| UC-067 | End hackathon | 🟡 | phase advance to FINISHED; BRU-014 (all rubrics submitted) not enforced |
| UC-068 | View evaluation results | ❌ | — |
| UC-069 | Select teams to be funded | ❌ | no "funded" field |
| UC-070 | Follow up fruit deliveries | ❌ | no fruit deadlines (IRQ-006) |
| UC-071 | Review fruit | ❌ | — |
| UC-072 | Upload catalogue | ❌/🟡 | `Edition.catalogLink` exists; no upload flow (BRU-030) |
| UC-073 | Decide to continue in team | ❌ | — (BRU-027, FRQ-026) |
| UC-074 | Develop fruit | 🟡 | `createFruit`/`updateFruit` **mocks**; `Fruit` model has visions/seedDescription |
| UC-075 | Submit fruit | ❌ | — (FRQ-014) |
| UC-076 | Manage exhibition images | ❌ | — |
| UC-077 | Add curator's vision | ❌/🟡 | `curatorVision` column exists; no flow |
| UC-078 | View fruits waiting for review | ❌ | — |
| UC-079 | Publish fruit | 🟡 | `publishFruit` **mock** (BRU-028) |
| UC-081 | Re-open fruit | ❌ | — (BRU-029, FRQ-015) |

## 3. Information requirements (data model gaps)
| IRQ | Gap |
|---|---|
| IRQ-001 User | no public/private flags (FRQ-004); no seed notes; `tags`, `interests`, `clusterNumber` flagged for deletion in WIP TODOs |
| IRQ-002 Seed | "original author" vs collaborators distinction: verify in `SeedScientists`; status lifecycle incomplete |
| IRQ-004 Fruit | other/exhibition images, related documentation, authors (separate from flower authors) |
| IRQ-005 Edition | logo/seed master template live in Drive (OK); invited scientists ✅ |
| IRQ-006 Hackathon | fruit deadlines ❌; current presenting group/team only in socket memory |
| IRQ-007 Participant | seed ratings not persisted (#229) |
| IRQ-010 Team | funded flag ❌; resulting fruit via `Participation.fruitId` |
| IRQ-011 Rubrics | only Drive docs; no delivery status/evaluator link in DB |
| IRQ-012 Invitations | no invitation status (accepted/declined/pending) |

## 4. Business rules — notable gaps (verify each when implementing)
BRU-003 (edition deletion), BRU-004/010 (announce only when complete; hackathon needs announced edition),
BRU-005/006/008 (edition closing effects), BRU-011 (start conditions), BRU-012/038 (edit locks), BRU-013 (hackathon
deletion), BRU-014/043 (ending & rubric locking), BRU-016–019 (seed ownership/review/reopen), BRU-020 (withdrawal),
BRU-025/048 (evaluator read-only, who can enter), BRU-026–029 (funding, leaving, fruit publish/reopen),
BRU-033 (scientist applications), BRU-039 (hackathon seeds must be published & from parent edition),
BRU-040/036/035 (no edits after delivery), BRU-042 (ratings locked after submission), BRU-047 (seed invitation scope).

## 5. Functional & non-functional
- **Notifications** missing: FRQ-005, 006, 008, 009, 010, 011, 012, 013, 014, 015 (FRQ-007 partial via pre-registration email).
- **FRQ-002** role management ❌ · **FRQ-004** profile visibility ❌ · **FRQ-023/024** suggestions ❌ · **FRQ-026** ❌.
- **FRQ-016/018/019** collaborative editing is delegated to Google Docs.
- **NFRQ-009 GDPR** ❌ (no deletion/export) · **NFRQ-017 backups** ❌ (Supabase free tier suggested by keep-alive cron)
  · **NFRQ-019 file size limits** ❌ · **NFRQ-011 i18n** ❌ · **NFRQ-003 docs** 🟡 (CLAUDE.md only, no README)
  · **NFRQ-010/005** collaborative consistency 🟡 (in-memory socket state, single instance).
- ✅ NFRQ-007/008/012/013/014/015, NFRQ-002/004 largely.
