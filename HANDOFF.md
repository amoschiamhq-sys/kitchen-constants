# Executor handoff

Updated: 2026-07-23

## Current state

The approved redesign milestones and Continuation Milestone 6 in `IMPLEMENTATION_PLAN.md` are implemented and verified locally. The public launch layer is also prepared locally with Calculator, Guides and About pages, basic search metadata, robots.txt and sitemap.xml. The shipped behavior and evidence are recorded in `handover.md` and this handoff.

## Stable invariants

- Five active meat categories use the approved compact cut matrix.
- Every active cut has non-empty ordered Detail and Doneness choices.
- Known partial routes resolve to the first downstream choices and are replaced with a canonical hash.
- The default weight is `100 g`; selection changes preserve it; a reload resets it.
- Salt output is `weight x percentage / 100` in grams only.
- Empty or invalid weight never leaves stale grams visible.
- Lamb Chops, Leg, and Rack expose reviewed Medium-rare and Medium chef targets with a separate USDA whole-cut safety baseline.
- Finish cards present Chef target first and Food-safety baseline as secondary context.
- Beef ribs, Pork ribs, and Lamb shoulder remain explicitly pending because their `Tender` endpoint is method-dependent.
- No database, API, storage migration, or external account is involved.
- The support prompt is present beneath results, but it needs Amos's real Ko-fi URL before it can accept contributions.

## Validation baseline

- Full suite: 37 passing tests.
- Syntax and diff checks: passing.
- Browser: calculator defaults, lamb selection, Guides, About, 390 x 844 and 320 x 568 were checked; no horizontal overflow or console errors. Lamb shoulder remains pending.

## Open work

- Add the real Ko-fi URL.
- Confirm and register the preferred domain.
- Publish via a launch branch and pull request, then connect the private repository to Cloudflare Pages.
- Submit the sitemap in Google Search Console after the domain is live.
- A future source-backed review may address Beef ribs, Pork ribs, or Lamb shoulder, but must define preparation-specific `Tender` semantics before publishing a target.

## Working-tree note

The repository contains uncommitted user and session changes. Inspect `git status` and the complete diff before editing; do not discard or overwrite unrelated work.
