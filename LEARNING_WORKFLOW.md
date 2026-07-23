# Learning workflow

Use this file to keep future planning and execution aligned with user feedback.

## Before work

1. Read `PROJECT_BRIEF.md`, `HANDOFF.md`, and the newest `SESSION_UPDATE.md`.
2. Compare the request with the current implementation and `IMPLEMENTATION_PLAN.md`.
3. Identify whether the request changes product behavior, culinary content, visual direction, or only documentation.
4. Stop on conflicts with the latest approved decision; do not silently revive superseded behavior.

## During work

- Turn each user correction into a concrete invariant or acceptance check.
- Add a focused regression test before changing behavior where practical.
- Keep culinary facts separate from interaction and styling changes.
- Preserve reviewed sources and mark uncertain content pending.
- Test repeated use, mobile layout, keyboard focus, invalid-input recovery, and browser history when those surfaces change.

## After work

1. Update `SESSION_UPDATE.md` with what changed and what was verified.
2. Update `HANDOFF.md` when the stable implementation state or next approved action changes.
3. Update `PROJECT_BRIEF.md` only for durable approved product decisions.
4. Update `handover.md` when a release-sized milestone finishes.
5. Record exact test results and unresolved risks; never infer success from a passing unit suite alone.
