# Product owner clarifications

The product owner's answers where the SRS is silent or ambiguous. Each file holds the **current** answers for one
use case (`general.md`: rules shared by several), and is edited in place when an answer changes. The history of
each answer, with dates, is in `../decisions.md`; every section names the decisions behind it.

Tests and implementation take their expectations from the SRS plus these files, never from the code. A question the
SRS and these files don't settle goes to the product owner before any test or code relies on it.

Before asking or recording an answer, check for an existing one: rule at the top of `../decisions.md`.

| File | Scope |
|---|---|
| `general.md` | Actors and staff hierarchy, vocabulary (SRS terms → API values), HTTP meaning, announcing, state consistency |
| `UC-002.md` | View editions |
| `UC-003.md` | Edition details |
| `UC-004.md` | View hackathons |
| `UC-006.md` | Explore products of an edition (+ BRU-018) |
| `UC-007.md` | Product details (+ BRU-018) |
