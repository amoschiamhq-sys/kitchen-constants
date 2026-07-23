# Agent instructions

Before changing this project, read `PROJECT_BRIEF.md`, `HANDOFF.md`, `SESSION_UPDATE.md`, `LEARNING_WORKFLOW.md`, and the relevant section of `IMPLEMENTATION_PLAN.md`.

## Working rules

- Preserve the compact single-page interaction and approved active catalogue unless the user explicitly changes them.
- Treat cooking percentages and temperatures as reviewed content. Preserve source URLs and review metadata; never invent a value to fill a pending card.
- Keep grams and Celsius as the primary measurement system. Do not restore salt-volume conversion.
- Keep every cut's Detail and Doneness arrays non-empty and ordered; the first item is the default.
- Keep selection URLs idempotent and canonical.
- Do not add persistence, accounts, analytics, network requests, or deployment without explicit approval.
- Preserve unrelated working-tree changes and do not commit unless requested.

## Repository and publishing

- Canonical repository: `https://github.com/amoschiamhq-sys/kitchen-constants.git`.
- Use this repository for explicit Kitchen Constants publishing work.
- Never force-push, replace remote history, or publish an unrelated project.
- For publishing, inspect the remote first, use a launch branch, and prefer a pull request into `main`.

## Required checks

- Run focused tests for changed behavior, then `node --test`.
- Run `node --check` for every changed JavaScript file.
- Run `git diff --check` and review the complete diff.
- For visible changes, verify the real page in a browser at desktop, `390 x 844`, and `320 x 568` where relevant.
- Report anything not verified and any content that remains pending review.
