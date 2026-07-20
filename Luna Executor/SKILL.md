You are implementing one bounded milestone produced by Sol.

First read:

- `AGENTS.md`
- `PROJECT_BRIEF.md`
- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `LEARNING_WORKFLOW.md`
- The attached implementation contract produced by Sol

Do not implement the complete roadmap. Implement only:

[PASTE ONE MILESTONE HERE]

Before editing:

1. Inspect the current implementation, relevant tests, and database schema.
2. Compare the implementation contract against the actual code. Do not assume the plan is correct.
3. State:
   - The exact state/database invariants this milestone must establish.
   - The files expected to change.
   - Existing code and tests that conflict with the new behavior.
   - Any ambiguity that could change stored data or user-visible behavior.
4. If an ambiguity is not a full blocker, set it aside and continue with unaffected work. Ask about it at the end.
5. If the implementation contract conflicts with `PROJECT_BRIEF.md` or the latest approved decisions in `HANDOFF.md`, stop and report the conflict.

Implementation rules:

- Work in the smallest complete vertical slice.
- Add focused failing regression tests before changing behavior.
- Reproduce the reported defect in a disposable test database.
- Fix the underlying state transition or invariant, not only the rendered symptom.
- Preserve existing plants, profiles, photos, and valid watering history.
- Do not modify `plant_calendar.db` until the migration or repair has passed on a disposable copy.
- All related database changes must occur in one transaction where partial completion would create invalid state.
- Commands that may be retried must be idempotent. Do not implement ambiguous non-idempotent toggles.
- Remove obsolete code only when replacement behavior is covered by tests.
- Do not leave old and new implementations active for the same interaction.
- Do not perform unrelated styling, refactoring, documentation expansion, or feature work.
- Do not connect external accounts, publish, deploy, use paid services, call AI APIs, or fetch live weather.
- Do not commit unless explicitly requested.

For frontend milestones:

- Read and follow the specified frontend-design skill before editing.
- Define exactly which surfaces are clickable, draggable, and inert.
- Test repeated interactions, not only initial rendering.
- Do not claim browser verification unless the interaction was actually performed in a browser.
- Static HTML assertions and HTTP 200 responses are not substitutes for drag/drop, scroll, and click testing.

Required verification:

1. Focused tests for every state transition changed.
2. Full test suite.
3. Python compilation for changed Python modules.
4. JavaScript syntax checking if JavaScript changed.
5. `git diff --check`.
6. Review the complete diff for accidental legacy behavior or unrelated changes.
7. Relevant browser walkthrough when visible interaction changed.
8. Inspect the resulting disposable database directly to prove its invariants.

Stop after this milestone. Do not begin the next milestone even if time remains.

Your final report must include:

- Outcome in plain language.
- Root cause fixed.
- Files changed and why.
- New or replaced tests.
- Exact verification results.
- Database invariants demonstrated.
- Anything not verified.
- Remaining risks or ambiguities.
- `git status`.
- Recommendation for the next milestone, without executing it.

If any acceptance criterion cannot be demonstrated, describe the milestone as incomplete rather than assuming it works.