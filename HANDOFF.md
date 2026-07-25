# Executor handoff

Updated: 2026-07-25

Execution status: Milestones 15–20 completed locally on 2026-07-25; no deployment performed.

## Current state

The working tree currently includes the independently named four-meat catalogue, two dry-brine timing bands, pasta and candidate bread formulas with separate liquid, salt, optional leaven, oil, and sugar calculations, reusable sauce-balance cards, labelled ratio displays, and the approved personal support note.

Milestones 15–20 are implemented and verified locally. Milestone 21 is the next approved action; Marinades remains deferred.

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
- Bread remains active, but its approved next set is Everyday loaf, Olive-oil focaccia, and Chinese steamed buns. Marinades remain visible as a non-interactive Coming soon choice and remain separate from Sauces.
- Sauces remain task-first: Stir-fry, Glaze, Dipping, and Dressing, with Teriyaki, Sesame (Goma), Peanut, Sweet & Sour, and Vinaigrette as the named classics. Sauces open directly to Stir-fry / Balanced; the temporary Builder hash canonicalizes to that same profile and is not selectable.
- Vinaigrette displays `Oil` for its three-part component; broader sauce profiles and the generic ingredient role retain `Fat`.
- Public homepage, Guides, and About pages have accurate JSON-LD; calculator hash permutations remain non-indexable states.
- Four concise reference pages now explain dry-brining, meat temperatures, dough/bread ratios, and sauce ratios. Each has an Article author link to the About page.
- Pasta & Noodles and Bread use flour weight, liquid or egg percentage, salt percentage, and optional leaven percentage. Bread may also expose oil and sugar percentages where the selected style requires them.
- Pasta ratio displays use a visual separator with ingredient subtitles, for example `48% | 2%` with `Water` and `Salt` beneath.
- The support note uses Amos's approved wording and links `Leave a tip` to <https://ko-fi.com/amoschiam> in a new tab.
- No database, API, storage, or analytics were added. Cloudflare Pages hosting was configured externally; no runtime deployment code was added.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder
## Verification baseline

- `node --test`: 62 passing tests, including seafood removal, bread, extras calculation, sauce, navigation, calculation, metadata, conditional-control, and desktop spacing coverage.
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

1. Execute Milestone 21: conditional publishing and live SEO verification, only after explicit authorization.
2. Keep meat salt ratios labelled as candidate values; no additional meat review is required for this release.
3. Keep Marinades deferred until a later product decision.
4. Keep the revised bread ratios and finish temperatures labelled as candidate starting points pending representative home testing.

## Milestone 15 execution — 2026-07-25

- Removed the active Fish & shellfish catalogue and seafood-only runtime data. Former seafood hashes now use the existing not-found recovery state.
- Replaced Ciabatta-style and Sourdough fougasse with Everyday loaf, Olive-oil focaccia, and Chinese steamed buns.
- Added candidate bread finish guidance with method, Celsius-first internal temperature, sensory cue, and after-cooking guidance.
- Extended dough calculation with ordered optional extras; focaccia calculates olive oil and steamed buns calculate sugar and oil grams.
- Preserved Pasta & Noodles calculation behavior and all existing Meat and Sauce values.
- Recorded internal candidate references for baker’s percentage, focaccia, and Chinese steamed buns: King Arthur Baking and The Woks of Life. These values remain pending home testing.
- Focused tests and the complete suite pass: 58 tests. All 7 JavaScript files pass `node --check`; `git diff --check` passes with only line-ending notices.
- Browser verification passed at desktop, `390 × 844`, and `320 × 568` for all Bread styles, weight scaling, invalid weight recovery, removed seafood routes, and removed legacy Bread routes. No actual horizontal overflow or console errors were observed. The desktop ratio number/subtitle spacing issue was addressed in milestone 17.

## Milestone 16 execution — 2026-07-25

- Added the first-use sentence explaining that the site provides rough ratios and temperatures that scale to what the user is cooking.
- Hid Detail and Doneness groups only when their source arrays contain one choice; canonical hashes and the non-empty data invariants remain unchanged.
- Made existing meat temperature pairs Celsius-first without changing their reviewed numbers or pending states.
- Added unequal-strength sauce guidance, retained the same-measure helper, and marked concentrated ingredient examples in visible role copy.
- Reorganised Guides into Foundations, Meat, Sauces, and Dough & bread with a compact jump menu; Marinades remains absent from Guides.
- Added the non-recipe-book About sentence and aligned the homepage, Open Graph, and Twitter titles to `Kitchen Constants | Cooking Ratios & Temperatures`.
- Focused and complete tests pass: 61 tests. All changed JavaScript files pass `node --check`; `git diff --check` passes with only line-ending notices.
- Browser verification passed at desktop, `390 × 844`, and `320 × 568`: conditional selector states, canonical Back/Forward behavior, sauce caveats, Guide jumps, About copy, no horizontal overflow, and no console errors. Desktop ratio number/subtitle overlap was subsequently addressed in milestone 17.

## Milestone 17 execution — 2026-07-25

- Fixed the desktop ratio-label collision by reserving shared number and subtitle rows for dough and sauce ratio groups at widths above the mobile breakpoint.
- Kept the existing mobile rules intact; 390px and 320px layouts remain readable, operable, and free of horizontal overflow.
- Added a focused CSS regression test for the desktop row contract; no application data, routes, calculations, metadata, sources, or review values changed.
- Completed the outsider walkthrough across Meat, Pasta & Noodles, Sauces, Bread, Guides, and About, including category clicks, canonical history, invalid-weight recovery, support links, keyboard focus, and responsive checks.
- Desktop screenshots were reviewed for Fresh egg pasta, Everyday loaf, Chinese steamed buns, Stir-fry / Balanced, Sesame (Goma), and Dipping / Spicy. Number/subtitle boundaries are distinct and long ratios remain paired.
- Focused and complete tests pass: 62 tests. All changed JavaScript files pass `node --check`; `git diff --check` passes with only line-ending notices.
- Browser verification passed at desktop, `390 × 844`, and `320 × 568` with no horizontal overflow or console errors. No deployment or commit performed.

## Approved correction plan — 2026-07-25

- Remove Fish & shellfish and all seafood-specific active data, tests, and public claims. Old `#/seafood/*` hashes should use the existing not-found recovery rather than silently selecting another food.
- Replace Ciabatta-style and Sourdough fougasse with Olive-oil focaccia and Chinese steamed buns. Keep Everyday loaf.
- Extend bread data and cards only enough to express water, salt, leaven, optional oil/sugar, Celsius-first finish temperature, method, sensory cue, and cooling/rest guidance.
- Add one sentence under “What are you making?” that explains the product as rough ratios and temperatures that scale.
- Hide Detail and Doneness rows when they contain only one valid choice while preserving the non-empty arrays and full canonical route.
- Clarify that sauce parts show balance rather than equal strength and label concentrated ingredient examples.
- Reorganise Guides with a compact Foundations / Meat / Sauces / Dough & bread jump menu; do not add a Marinades guide.
- Update the public homepage title to `Kitchen Constants | Cooking Ratios & Temperatures` and align social metadata.
- Fix the desktop-only number/subtitle overlap in the dough and sauce ratio treatments; keep the currently acceptable mobile layouts stable.
- Baseline before execution: `node --test` passes 56 tests; `node --check` passes for all 7 JavaScript files; `git diff --check` reports only line-ending notices.

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

## Terminology and SEO execution handoff - 2026-07-25

### Approved outcome

- Change only Vinaigrette's visible `3 Fat : 1 Acid` label to `3 Oil : 1 Acid`. Keep every other `Fat` label and the generic `fat` ingredient role unchanged.
- Keep the Guides topic buttons static; no sticky or floating behavior is approved.
- Add the technical SEO foundation, then four focused reference pages that reinforce Kitchen Constants as a scalable cooking reference rather than a recipe book.
- Do not create pages for calculator hash permutations and do not add `Recipe` structured data.

### Execution order

1. Milestone 18: Vinaigrette terminology.
2. Milestone 19: semantic homepage fallback and accurate structured data.
3. Milestone 20: four clean-URL reference pages, internal discovery links, and sitemap coverage.
4. Milestone 21: conditional publishing and live measurement, only after separate explicit authorization.

### Current state and next action

- Milestones 15-20 remain implemented and verified locally.
- Current baseline is 65 passing tests.
- Milestones 18-20 changed only the approved terminology, SEO foundation, reference pages, discovery links, sitemap, and related tests.
- Start with Milestone 21 only after explicit publishing authorization. Stop at its gate and preserve all unrelated working-tree changes.
- Do not commit, publish, deploy, submit a sitemap, or change Search Console state without the authorization required by the relevant milestone.

## Milestone 18 execution - 2026-07-25

- Changed only Vinaigrette's visible ratio label from `3 Fat : 1 Acid` to `3 Oil : 1 Acid` in `src/constants.js`.
- Updated the dedicated Vinaigrette assertion in `tests/navigation.test.js`.
- Confirmed Dressing / Bright still renders `Fat` and the generic sauce `fat` role remains unchanged.
- Focused navigation tests pass: 38 tests. Full suite passes: 62 tests.
- `node --check` passes for `src/constants.js` and `tests/navigation.test.js`; `git diff --check` passes with only existing line-ending notices.
- Browser verification passed at the default desktop viewport, `390 × 844`, and `320 × 568`. Vinaigrette renders `Oil`, with no actual body overflow or console errors. The 320 px root width difference is the normal vertical scrollbar; the body remains 320 px wide.
- No SEO, layout, route, ratio-value, source metadata, review metadata, commit, publish, or deployment changes were made.
- Milestone 19 is the next approved action; do not start it without a new execution instruction.

## Milestone 19 execution - 2026-07-25

- Added a semantic homepage fallback inside the app mount with one H1, the approved rough-ratios positioning, active category links, Guides/About links, and no-JavaScript navigation path.
- Added valid `WebSite` JSON-LD to the homepage, `CollectionPage` JSON-LD to Guides, and `AboutPage`/`Person` JSON-LD to About. No Recipe schema or unsupported fields were added.
- Client startup still replaces the fallback with the existing interactive app; normal rendering has one H1 and no fallback duplicate.
- Focused metadata tests pass: 9 tests. Full suite passes: 64 tests.
- `node --check` passes for `tests/metadata.test.js`; `git diff --check` passes with only existing line-ending notices.
- Source-only fallback checks passed through the local HTTP response. Browser checks passed at desktop, `390 × 844`, and `320 × 568`; no actual body overflow or console errors were found.
- Guides topic navigation remains `position: static` with `top: auto` at 320 px. No sticky or floating behavior was added.
- No new reference pages, sitemap changes, SEO account changes, commit, publish, or deployment were performed.
- Milestone 20 is the next approved action; do not start it without a new execution instruction.

## Milestone 20 execution - 2026-07-25

- Added four static, clean-URL reference pages: Dry-brining Percentages, Meat Internal Temperatures, Dough & Bread Ratios, and Sauce Ratios.
- Each page uses one H1, concise principle-led content, a visible `By Amos Chiam` line, an Article schema block, an author URL pointing to About, a relevant Guides link, and one existing calculator CTA.
- Added a compact Reference pages section to Guides and expanded `sitemap.xml` from three to seven clean URLs.
- No Recipe schema, new cooking values, ingredient lists, step-by-step recipes, Marinades content, sticky navigation, or route-parser changes were added.
- Focused metadata tests pass: 10 tests. Full suite passes: 65 tests. `node --check` passes for `tests/metadata.test.js`; `git diff --check` passes with only existing line-ending notices.
- Browser verification passed for all four pages at desktop, `390 × 844`, and `320 × 568`; each has one H1, no actual body overflow, and no console errors. All four calculator CTAs opened the intended canonical hash states.
- Guides discovery links are present and both `.guide-jump` groups remain `position: static`; keyboard-visible page structure and existing focus contracts were preserved.
- No commit, publish, deployment, sitemap submission, or Search Console mutation was performed.
- Milestone 21 is next and requires explicit authorization because it changes external state.
