# Executor handoff

Updated: 2026-07-25

Execution status: Pre-live URL and sauce-review cleanup completed locally on 2026-07-25; no deployment performed.

## Current state

The MVP now includes the independently named meat catalogue, two dry-brine timing bands, dough formulas with separate liquid and salt calculations, reusable sauce-balance cards, labelled ratio displays, and the approved personal support note.

Public page URLs use Cloudflare's clean routes: `/`, `/guides`, and `/about`. Sauce ratios are recorded internally as owner-tested with reference material; meat ratios remain candidate values by design.

Cloudflare Pages is now deployed from the `main` branch at <https://kitchen-constants.pages.dev/>. Amos confirmed that the live page is the current version. The custom domain `kitchenconstants.com` is active through Cloudflare Registrar and SSL is enabled.

## Stable invariants

- Meat remains the default category.
- Every active meat cut has non-empty Detail and Doneness choices.
- The first valid downstream choice is selected automatically.
- Weight defaults to `100 g`, remains stable during selection changes, and resets after refresh.
- Salt output is calculated in grams only.
- Current meat salt ratios remain candidate values and were not changed during this milestone.
- Chef temperature guidance remains primary, with food-safety context beneath it.
- Bread and Marinades remain visible as non-interactive Coming soon choices; Marinades remain separate from Sauces.
- Sauces remain task-first: Stir-fry, Glaze, Dipping, and Dressing, with Teriyaki, Sesame (Goma), Peanut, Sweet & Sour, and Vinaigrette as the named classics. Sauces open directly to Stir-fry / Balanced; the temporary Builder hash canonicalizes to that same profile and is not selectable.
- Pasta & Noodles uses flour weight, liquid or egg percentage, and salt percentage.
- Pasta ratio displays use a visual separator with ingredient subtitles, for example `48% | 2%` with `Water` and `Salt` beneath.
- The support note uses Amos's approved wording and links `Leave a tip` to <https://ko-fi.com/amoschiam> in a new tab.
- No database, API, storage, or analytics were added. Cloudflare Pages hosting was configured externally; no runtime deployment code was added.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder
- Fish & shellfish: Scallops, Prawns, Fish fillet

## Verification baseline

- `node --test`: 48 passing tests, including sauce navigation and candidate-content coverage.
- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- Browser verification passed for the ratio labels, support copy, task-first sauce controls, sauce balance cards, timing display, dough salt output, and desktop/mobile previews with no horizontal overflow.
- A narrow mobile viewport check passed with no horizontal overflow.
- `https://kitchenconstants.com` was verified over HTTPS at the default desktop viewport, `390 x 844`, and `320 x 568`; the live calculator had no horizontal overflow or console errors.
- The live Pasta & Noodles styles, reviewed Lamb Chops targets, and pending Lamb Shoulder state were confirmed on the custom domain.
- Google Search Console DNS ownership verification succeeded on 2026-07-23, and `https://kitchenconstants.com/sitemap.xml` now reports `Success` with 3 discovered pages.
- Content polish updated page metadata, the About copy, Guides introduction and headings, calculator helper text, and the support note. Sauce ratios are owner-tested with source URLs and review metadata retained internally. Automated checks and local in-app browser verification pass; no deployment was performed for this redesign.
- Sauce simplification removed the Builder route state, universal formula, Builder link, and standalone adjustment guide; ratios now use `parts`, a same-measure helper, and wrap-safe visual dividers. No deployment was performed.
- Rendered culinary reference links were removed from calculator results; source URLs and review metadata remain stored internally. A compact `Leave a tip` link is available in the calculator, Guides, and About footers.
- Guide 05 now contains the compact sauce-building and mixing guidance; Guides do not render culinary source links or citations.

## Launch handoff

1. Recheck Search Console around 2026-07-26 or 2026-07-27. The sitemap is accepted; URL indexing may take days or weeks.
2. Keep `https://kitchen-constants.pages.dev/` as the fallback deployment URL.

## Remaining product work

1. Keep meat salt ratios labelled as candidate values; no additional meat review is required for this release.
2. Keep Bread and Marinades deferred until a later product decision.

## Sauce guidance execution — 2026-07-25

- Sauces remain before the deferred Bread and Marinades categories.
- Added Vinaigrette after the existing classics with a `3 Fat : 1 Acid` balance; it is recorded internally as owner-tested with reference material.
- Broadened role examples to include Worcestershire, maple syrup, wine or cider vinegar, mustard, olive oil, butter, black pepper, horseradish, shallot, and herbs.
- Added visible `+ Heat` groups and Heat ingredient choices for spicy profiles.
- Added Guide 05, “Build a sauce,” before dough hydration and dough salt; the guide includes concise water/oil/aromatics mixing advice and keeps pure salt outside the equal-parts ratio.
- No culinary references or citations are rendered to users; internal source metadata remains preserved.

## Tomorrow execution handoff — 2026-07-25

### Objective (completed)

Remove Sauce Builder and return Sauces to the same direct, compact interaction used by Meat and Pasta. Users should choose a task and flavour, then immediately see the sauce parts. This is an interaction and presentation cleanup only; do not change candidate culinary ratios, sources, review metadata, profiles, named classics, or task order.

### Current mismatch

- `#/sauces` resolves canonically to `#/sauces/stir-fry/balanced`.
- `#/sauces/builder` is accepted only as a temporary legacy path and canonicalizes once to the same default profile.
- Sauce pages render the task/profile controls followed by exactly two result cards.
- Sesame (Goma) keeps each ratio group intact and uses subtle dividers without leading punctuation when it wraps.

### Implemented changes

1. Remove `SAUCE_BUILDER` data and every Builder card/link renderer and style.
2. Make `#/sauces` resolve canonically to `#/sauces/stir-fry/balanced`, matching the first-valid-choice behavior used elsewhere.
3. Treat `#/sauces/builder` as a temporary legacy path that canonicalizes once to `#/sauces/stir-fry/balanced`; do not keep it as a selectable state.
4. Keep the task-first controls and all existing flavour profiles and named classics unchanged.
5. Keep exactly two primary result cards:
   - `Balance`: selected profile/classic, parts, short purpose, and relevant ingredient choices.
   - `Use`: typical uses, optional additions, and common substitutions.
6. Remove the standalone universal formula and full-width adjustment guide from the primary sauce flow.
7. Label the ratio simply `parts` and add one short helper: `Use the same spoon or cup for every part.`
8. Replace visible colon separators with subtle visual dividers so a wrapped ratio never starts with punctuation.
9. Preserve the useful 320 px header-spacing fix already present in `styles/main.css`.

### Expected files

- `src/constants.js`: remove Builder data; preserve sauce catalogue values and source/review metadata.
- `src/navigation.js`: remove Builder selection/model behavior; restore direct defaulting and canonicalization.
- `src/app.js`: remove Builder and adjustment renderers; keep the two sauce result cards.
- `styles/main.css`: remove Builder/adjustment rules and refine ratio dividers; preserve unrelated responsive fixes.
- `tests/navigation.test.js`: restore task/profile defaults and add the legacy Builder canonicalization check.
- `PROJECT_BRIEF.md`, `HANDOFF.md`, `SESSION_UPDATE.md`, and `IMPLEMENTATION_PLAN.md`: reconcile final state after execution.

### Acceptance result

- Selecting Sauces immediately shows Stir-fry / Balanced and its parts.
- No Sauce Builder, universal formula, Builder link, or standalone adjustment guide is rendered.
- Stir-fry, Glaze, Dipping, Dressing, and Classics remain in the approved order.
- Balanced, Umami, Bright, Nutty, Sweet Glaze, Spicy, and all four named classics remain available.
- Sesame (Goma) wraps cleanly at 320 px without a leading or stranded separator.
- Sauce pages visually match the existing category → controls → two-card result rhythm.
- All candidate ratios, sources, and review metadata remain unchanged.

### Verification gate

Run focused navigation tests, then `node --test`; run `node --check` for every changed JavaScript file; run `git diff --check` and review the complete diff. Verify the real page at desktop, `390 x 844`, and `320 x 568`, including the default sauce route, one profile, and Sesame (Goma), with no console errors or horizontal overflow. Do not commit, publish, or deploy unless explicitly requested.

## Launch hardening status — 2026-07-23

- Added the favicon, Apple touch icon, social-card asset, complete Open Graph/Twitter metadata, and a pasta-aware homepage title locally.
- Added a Cloudflare Pages `_headers` rule for an initial HSTS policy of `max-age=2592000` with no subdomain inclusion or preload.
- Added metadata and asset regression tests; the suite now passes 45 tests.
- External Cloudflare work remains: add the proxied `www` record, create the permanent path/query-preserving redirect to `https://kitchenconstants.com`, deploy these changes, then verify the live HSTS and metadata responses.

## Tomorrow handover — 2026-07-23

- Launch-hardening work is committed on `agent/launch-hardening` at `8973f7f`.
- Draft PR: <https://github.com/amoschiamhq-sys/kitchen-constants/pull/5>.
- Validation is complete: 45 tests pass, all JavaScript files pass `node --check`, `git diff --check` passes, and the desktop browser smoke test passes.
- The live apex currently returns `200` without `Strict-Transport-Security`; `www.kitchenconstants.com` still does not resolve.
- Cloudflare access is the only remaining blocker. The connected account showed no Kitchen Constants Pages project or DNS zone.
- On resume: sign into the Cloudflare account that owns the site, configure the proxied `www` record and permanent path/query-preserving redirect, merge/deploy PR #5, enable HSTS at `max-age=2592000` with subdomains/preload off, then verify live headers, redirects, assets, and metadata.

## Pre-live URL and sauce review update — 2026-07-25

- Changed public Guides and About canonicals, Open Graph URLs, and sitemap entries from `.html` paths to `/guides` and `/about`, matching Cloudflare's existing clean-URL behavior. Internal `.html` links remain so local file and static previews continue to work; Cloudflare redirects them once in production.
- Recorded all sauce profiles and classics as `reviewed` using `owner-tested-with-reference`; ratio values and internal source URLs were unchanged.
- Meat ratios remain candidate values without an additional review checklist or launch blocker.
- Cloudflare account changes remain manual. The live apex currently returns `200` with HSTS active; wait for `www` certificate provisioning before checking the final redirect.
- No push, merge, or deployment was performed for this update.
