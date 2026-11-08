# Product owner clarifications

The product owner's answers where the SRS is silent or ambiguous. Each file holds the **current** answers for one
use case (`general.md`: rules shared by several), and is edited in place when an answer changes. The history of
each answer, with dates, is in `../decisions.md`; every section names the decisions behind it.

Tests and implementation take their expectations from the SRS plus these files, never from the code. A question the
SRS and these files don't settle goes to the product owner before any test or code relies on it.

Before asking or recording an answer, check for an existing one: rule at the top of `../decisions.md`.

An answer that changes the SRS text is a `pending` row in the SRS changes file, read together with the SRS; the
files here only point to it (e.g. "pending SRS change, D-049 Q4") instead of repeating it.

| File | Scope |
|---|---|
| `general.md` | Actors and staff hierarchy, vocabulary (SRS terms → API values), HTTP meaning, announcing, state consistency |
| `UC-002.md` | View editions |
| `UC-003.md` | Edition details |
| `UC-004.md` | View hackathons |
| `UC-006.md` | Explore products of an edition (+ BRU-018) |
| `UC-007.md` | Product details (+ BRU-018) |
| `UC-044.md` | Start hackathon |
| `UC-047.md` | Enter ongoing hackathon |
| `UC-048.md` | Develop conceptual map |
| `UC-050.md` | Rate seed |
| `UC-052.md` | Submit seed ratings |
| `UC-053.md` | Develop flower |
| `UC-057.md` | Manage assistance control |
| `UC-058.md` | Create exploring groups |
| `UC-059.md` | Follow up group work |
| `UC-061.md` | Create co-creation teams |
| `UC-062.md` | Follow up team work |
| `UC-064.md` | Fill out rubric |
| `UC-066.md` | View hackathon management process |
