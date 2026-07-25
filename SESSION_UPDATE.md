# Session update

Date: 2026-07-25

## MVP execution

- Replaced the inherited visible meat taxonomy with independently named choices.
- Kept Ground meat inside Chicken, Beef, and Pork as requested.
- Retained the current candidate meat salt percentages.
- Replaced single timing sentences with Minimum and Best timing bands.
- Added separate salt percentages and calculated salt grams to Pasta & Noodles formulas.
- Kept pasta cooking-water salt out of scope.
- Added Bread, Marinades, and Sauces as non-interactive Coming soon categories.
- Removed the unused legacy meat catalogue from the runtime data file.
- Corrected temperature strings to render with proper degree and en-dash characters.

## Tests

`npm.cmd test` passes 43 tests with no failures.

## Support and launch preparation

- Updated the support note with Amos's approved personal-project wording.
- Connected the `Leave a tip` action to <https://ko-fi.com/amoschiam>.
- Added `LAUNCH_SETUP.md` with the exact Ko-fi, Stripe, Cloudflare Pages, and optional domain setup checklist.
- Deployed the current `main` branch to Cloudflare Pages at <https://kitchen-constants.pages.dev/>; Amos confirmed the live page is current.
- Purchased `kitchenconstants.com` through Cloudflare Registrar; the domain is now Active and SSL is enabled.

## Verification

- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- The real page was checked at the 899 px desktop preview with no horizontal overflow.
- The real page was checked at a narrow mobile viewport with no horizontal overflow; ratio labels remain paired beneath their percentages.
- The support copy renders in the live local preview.
- The active custom domain was verified over HTTPS at the default desktop viewport, `390 x 844`, and `320 x 568`; no horizontal overflow or console errors were observed.
- The live custom-domain page was checked for all three dough outputs, Lamb Chops at Medium-rare and Medium, and pending Lamb Shoulder guidance.
- Google Search Console DNS ownership verification succeeded on 2026-07-23. The full sitemap URL was submitted and now reports `Success` with 3 discovered pages.
- Content polish updated homepage, Guides, and About metadata; refreshed the approved personal About copy; kept visible Guides and calculator language short and warm; and refined the support note. No culinary values or calculator behavior changed.
- `npm.cmd test` passes 43 tests, all source and test JavaScript syntax checks pass, and `git diff --check` passes. The merged copy changes are live; in-app browser visual verification remains pending because it could not reach the local preview server.
- Removed rendered culinary reference links from calculator cards while preserving source URLs and review metadata internally. Added a compact footer support link to Guides and About, and softened the shared footer wording.

## Remaining launch work

- Recheck Search Console around 2026-07-26 or 2026-07-27; indexing and URL inspection may still be pending.

## Remaining content work

- Independently audit and home-test candidate meat salt ratios before describing them as reviewed.
- Beef ribs, Pork ribs, and Lamb shoulder remain pending internal-temperature guidance.

## Sauce section redesign - 2026-07-24

- Replaced the Sauce Coming soon state with an active, task-first reference: Stir-fry, Glaze, Dipping, and Dressing.
- Added reusable Balanced, Umami, Bright, Nutty, Sweet Glaze, and Spicy profiles plus four named classics: Teriyaki, Sesame (Goma), Peanut, and Sweet & Sour.
- Added the universal Salty + Umami + Sweet + Acid formula, ingredient-role substitutions, and a permanent adjustment guide for common imbalance problems.
- Sauce ratios are source-backed candidate content (`SAUCE_REVIEW`); they remain pending independent review and home testing before being described as reviewed.
- Added canonical sauce routes and focused navigation coverage. Full tests, syntax checks, diff checks, and local desktop/mobile browser verification are the handoff gate.

## Sauce visual polish - 2026-07-24

- Added `#/sauces/builder` as the compact foundational Sauce Builder entry point above the task-first choices.
- Removed the universal formula from individual profile and classic cards; those cards now show only their own balance and practical guidance.
- Grouped ratio separators with the following ingredient so long ratios such as Sesame (Goma) stay aligned when they wrap.
- Changed the ratio label to `rough parts` and simplified the adjustment note: “Too strong? Add a little water first. Sweet or sour ingredients can soften saltiness, but only dilution reduces it.”
- Tightened the 320 px header spacing so all primary navigation links remain visible.

## Approved sauce simplification for tomorrow - 2026-07-24

- Sauce Builder is no longer part of the approved product direction.
- Tomorrow's implementation should restore direct defaulting to Stir-fry / Balanced and keep the existing task-first profile and classic routes.
- Sauce pages should follow Meat and Pasta: controls followed by exactly two compact result cards.
- Remove the Builder page/link, universal formula, and standalone adjustment guide from the primary sauce flow.
- Keep the selected sauce parts, purpose, ingredient choices, typical uses, additions, and substitutions.
- Do not change candidate ratios, source URLs, review metadata, profile/classic catalogue, or task order.
- The decision was implemented locally on 2026-07-25; Sauce Builder is no longer part of the selectable experience.

## Launch hardening — 2026-07-23

- Added brand assets under `assets/`: scalable favicon, 32 px favicon fallback, Apple touch icon, and a 1200 × 630 social card.
- Added complete Open Graph and Twitter card metadata to the homepage, Guides, and About pages, including canonical `og:url` values and the pasta-aware homepage title.
- Added `_headers` with a conservative initial HSTS policy: `Strict-Transport-Security: max-age=2592000`.
- Added metadata and asset checks; `npm.cmd test` now passes 45 tests.
- Remaining external launch steps are the Cloudflare `www` DNS/redirect setup, deployment, and live verification of HSTS, redirects, assets, and metadata.

## Handover for next session — 2026-07-23

- Draft PR #5 is open from `agent/launch-hardening` (`8973f7f`): <https://github.com/amoschiamhq-sys/kitchen-constants/pull/5>.
- Local checks are green: 45 tests, JavaScript syntax checks, diff check, and desktop smoke test.
- Live state is unchanged: apex HTTPS is `200` without HSTS; `www.kitchenconstants.com` is unresolved.
- Cloudflare account access did not expose the site’s Pages project or DNS zone. Resume by switching to the owning account, then complete the documented `www` redirect, deployment, HSTS, and live verification steps.

## About copy update - 2026-07-24

- Updated the About page footer description to: “A small cooking reference for home cooks, leaving the final touch to you.”
- Updated the About page closing paragraph to: “If you’re the kind of home cook who keeps looking up the same cooking references, I hope you’ll find it useful too.”
- `npm.cmd test` passes 45 tests, all JavaScript syntax checks pass, and `git diff --check` passes. The local About HTML response returned HTTP 200 and contained both updated sentences.

## Shared footer copy update - 2026-07-24

- Replaced the remaining legacy footer wording in Guides and the calculator renderer with: “A small cooking reference for home cooks, leaving the final touch to you.”
- The old wording no longer appears in the public HTML or calculator source. `npm.cmd test` passes 45 tests, all JavaScript syntax checks pass, and `git diff --check` passes.

## Sauce simplification execution - 2026-07-25

- Removed the Sauce Builder data export, route state, renderers, links, and styles.
- Restored direct canonical defaulting to Stir-fry / Balanced and made `#/sauces/builder` a one-time legacy redirect.
- Kept all sauce tasks, profiles, classics, candidate ratios, sources, and review metadata unchanged.
- Reduced sauce pages to the Balance and Use cards, labelled ratios `parts`, added the same-measure helper, and replaced colon separators with wrap-safe visual dividers.
- Focused navigation tests and the complete suite pass: 48 tests. Changed JavaScript passes syntax checks and `git diff --check` passes.
- Browser checks passed at desktop, 390 x 844, and 320 x 568 for the default route, legacy redirect, and Sesame (Goma); no console errors or actual horizontal overflow were observed. The 320 px page naturally uses the vertical scrollbar, so `documentElement.clientWidth` is 305 px while the body remains 320 px wide.
- Candidate sauce ratios remain pending independent review and home testing; no deployment was performed.

## Candidate meat salt-ratio audit - 2026-07-25

- An independent source check found broad support for weighing dry-brine salt as a percentage of meat weight, with common starting points around 0.5-1.5% and higher values reserved for selected large BBQ cuts. See <https://destination-bbq.com/dry-brine-by-weight/> and <https://barbecuefaq.com/dry-brine-calculator/>.
- The current chicken, steak, ribs, pork, and lamb candidates generally sit within or near those broad starting ranges, but the sources do not validate every cut-specific value or the current bone-in and whole-bird basis.
- Ground meat, seafood, enhanced or injected meat, salty rubs, and bone-in weight need separate handling; the sources specifically caution against applying a universal dry-brine percentage to those cases.
- No runtime values, source metadata, or review statuses were changed. The candidate meat ratios remain pending until Amos supplies home-test results for representative cuts.

## Sauce guidance and Vinaigrette execution - 2026-07-25

- Reordered the active categories to Meat, Pasta & Noodles, Sauces, Bread, and Marinades; Marinades remain separate and deferred.
- Added Vinaigrette after the existing four named classics with a `3 Fat : 1 Acid` balance, optional mustard, shallot, herbs, honey, salt, and pepper, and internal owner-tested provenance.
- Broadened sauce role examples beyond Asian ingredients, including Worcestershire under Umami and Western-style vinegar, mustard, olive oil, butter, black pepper, horseradish, shallot, and herbs.
- Restored visible `+ Heat` ratio groups and included Heat ingredient choices in spicy profiles.
- Added Guide 05, “Build a sauce,” before dough hydration and dough salt. It includes concise guidance for dissolving salt and sugar in watery ingredients, mixing dried spices or chilli into oil, and adding delicate fresh herbs last.
- Pure salt remains outside the equal-parts ratio and is presented as a pinch, dissolve, taste, and repeat adjustment.
- Public pages render no culinary source links or citations; internal sauce source metadata remains preserved.

## Pre-live URL and sauce review cleanup - 2026-07-25

- Updated Guides and About canonical URLs, Open Graph URLs, and sitemap entries to `/guides` and `/about`, matching the clean URLs already served by Cloudflare. Kept internal `.html` links for local file and static-preview compatibility.
- Recorded every sauce profile and classic as `reviewed` with `owner-tested-with-reference` metadata, based on Amos's self-testing confirmation; numeric ratios and internal source URLs were preserved.
- Left meat ratio statuses unchanged as candidate values; no extra internal checklist was added.
- Cloudflare certificate and redirect work remains manual. No push, merge, or deployment was performed.

## Seafood and bread expansion - 2026-07-25

- Expanded Fish & shellfish with Salmon, White fish, Tuna, and Trout while preserving Scallops, Prawns, and Fish fillet.
- Added lighter candidate dry-brine starting points: 0.5% for delicate fish and 0.75% for fattier fish, with the existing short seafood timing and hidden fish-brining source metadata.
- Activated Bread with Everyday loaf at 66% water / 2% salt / 1.2% yeast, Ciabatta-style at 76% / 2% / 1.2%, and Sourdough fougasse at 73% water / 1.9% salt / 18% starter.
- Generalized the flour-based dough calculator to show an optional leaven output in grams while preserving Pasta & Noodles behavior.
- Added Guide 08, “How bread ratios stay useful.” It explains baker's percentage as a scaling language, not a recipe or a promise of identical results.
- New seafood and bread values remain candidate starting points pending representative home testing. Marinades remain deferred and no deployment was performed.

## Whole-site correction plan - 2026-07-25

- Reviewed the current site as a first-time home cook and approved a narrower next direction: remove seafood, retain Marinades only as Coming soon, and keep the product focused on scalable ratios rather than recipes.
- Approved the next Bread set as Everyday loaf, Olive-oil focaccia, and Chinese steamed buns. Each Bread Finish card should include a Celsius-first internal temperature plus method, sensory cue, and cooling/rest guidance; all new values remain candidate content pending source reconciliation and home testing.
- Approved hiding singleton Detail and Doneness rows while preserving complete canonical route state.
- Approved clearer first-use positioning, a grouped Guides jump menu, sauce-strength qualification, Celsius-first temperature strings, and the homepage title `Kitchen Constants | Cooking Ratios & Temperatures`.
- Deferred all marinade ratios and guide content. Marinades remain separate from Sauces.
- Recorded the slight desktop-only number/subtitle overlap as a required visual correction. Mobile is currently acceptable and must be regression-tested, not redesigned.
- Sol Planner converted these decisions into milestones 15–17 in `IMPLEMENTATION_PLAN.md`. No product code was changed during planning.
- Planning baseline: all 56 tests pass; all 7 JavaScript files pass `node --check`; `git diff --check` reports only line-ending notices.

## Milestone 17 execution - 2026-07-25

- Fixed the desktop-only number/subtitle collision in dough and sauce ratio groups with explicit desktop grid rows for the number and subtitle treatments.
- Preserved the existing mobile CSS path and verified every listed ratio-heavy page at `390 × 844` and `320 × 568` without horizontal overflow.
- Added a focused metadata/CSS regression test; no data, route, calculation, content value, source, or review metadata changed.
- Completed the outsider walkthrough across category navigation, canonical history, invalid-weight recovery, keyboard focus, Guides jumps, About, support links, and all six ratio-heavy states.
- Verification: 62 tests pass; all changed JavaScript files pass `node --check`; `git diff --check` passes with only line-ending notices; desktop screenshots show distinct number/subtitle boundaries; browser console logs are clean.
- No further implementation milestone is approved. Marinades remains deferred, and no deployment or commit was performed.

## Milestone 16 execution - 2026-07-25

- Added the rough-ratios first-use helper under the category prompt and clarified the About page that Kitchen Constants is not a recipe book.
- Hid only singleton Detail and Doneness groups in the rendered controls while retaining complete arrays and canonical route hashes.
- Changed existing meat temperature pairs to Celsius-first presentation without changing reviewed values or pending temperature states.
- Added the sauce unequal-strength caveat, concentrated ingredient labels, and retained the same-measure instruction.
- Grouped Guides into Foundations, Meat, Sauces, and Dough & bread with jump links; Marinades remains deferred and has no guide.
- Updated the homepage and social title to `Kitchen Constants | Cooking Ratios & Temperatures`.
- Verification: focused and full tests pass (61 tests); all changed JavaScript files pass `node --check`; browser checks pass at desktop, `390 × 844`, and `320 × 568` with no horizontal overflow or console errors. Canonical click, Back, and Forward behavior also pass.
- Remaining: Milestone 17 desktop-only number/subtitle overlap correction. No deployment or commit performed.

## Milestone 15 execution - 2026-07-25

- Removed Fish & shellfish from the active catalogue and deleted seafood-only runtime data. Former seafood hashes now render the existing not-found recovery.
- Replaced Ciabatta-style and Sourdough fougasse with Everyday loaf, Olive-oil focaccia, and Chinese steamed buns.
- Added candidate bread finish guidance with Bake/Steam method, Celsius-first internal temperature, sensory cue, and after-cooking guidance.
- Extended flour calculations with ordered optional extras while preserving the existing Pasta & Noodles output contract.
- Added focused regression tests for the four-meat catalogue, removed routes, Bread styles, candidate Finish data, and oil/sugar calculations.
- Verification: focused tests pass; `node --test` passes 58 tests; `node --check` passes for all 7 JavaScript files; `git diff --check` passes with only line-ending notices; browser checks pass at desktop, `390 × 844`, and `320 × 568` with no actual horizontal overflow or console errors.
- Remaining: singleton controls, Celsius-first meat temperatures, first-use copy, sauce-strength copy, Guides regrouping, metadata title, and the desktop number/subtitle overlap remain for milestones 16–17. No deployment or commit performed.

## Terminology and SEO planning - 2026-07-25

- Approved a label-only change from `Fat` to `Oil` for Vinaigrette. All other sauce labels and the generic `fat` ingredient role remain unchanged.
- Explicitly rejected sticky or floating Guides topic buttons on both desktop and mobile.
- Approved a technical SEO foundation consisting of meaningful homepage source content and accurate `WebSite`, `CollectionPage`, and `AboutPage`/`Person` structured data. `Recipe` schema is excluded.
- Approved four clean-URL reference pages covering dry-brining by weight, meat internal temperatures, dough and bread ratios, and sauce ratios. They will teach reusable principles, reuse approved content, and link to calculator states without duplicating every hash route.
- Publishing, sitemap submission, Search Console actions, and live measurement remain a conditional final milestone requiring the appropriate explicit authorization.
- Sol Planner converted the decisions into milestones 18-21 in `IMPLEMENTATION_PLAN.md`. Planning changed documentation only.
- Planning baseline: `node --test` passes all 62 tests.

## Milestone 18 execution - 2026-07-25

- Changed Vinaigrette's visible balance label to `Oil` while leaving every other `Fat` label, the generic `fat` role, ratio values, and source/review metadata unchanged.
- Updated the focused navigation assertion and passed 38 focused navigation tests plus all 62 tests.
- `node --check` passed for both changed JavaScript files; `git diff --check` passed with only existing line-ending notices.
- Verified the Vinaigrette card in the real browser at desktop, `390 × 844`, and `320 × 568`; the Oil label is clear, the body has no actual horizontal overflow, and console logs are clean. Dressing / Bright still shows Fat.
- Restored the Vinaigrette route in the local browser for review. No SEO, deployment, commit, or Milestone 19 work was performed.

## Milestone 19 execution - 2026-07-25

- Added the homepage semantic fallback inside `#app`, reusing the existing header, choice buttons, card treatment, and footer. It contains one H1, rough-ratio positioning, active category links, and Guides/About links; no new CSS was needed.
- Added one accurate JSON-LD block to each public static page: `WebSite` on the homepage, `CollectionPage` on Guides, and `AboutPage` with Amos Chiam as the existing public `Person` entity on About.
- Added metadata regression coverage for JSON parsing, schema types/URLs, no Recipe schema, and the source fallback contract.
- Focused metadata tests pass: 9. Full suite passes: 64. `node --check` passes for the changed test file; `git diff --check` passes with existing line-ending notices.
- Browser verification passed for JavaScript-enabled rendering at desktop, `390 × 844`, and `320 × 568`; one H1 remains, the fallback is replaced, body width stays within the viewport, and console logs are clean.
- Source-only homepage verification passed over the local HTTP response. Guides and About schema were parsed in-browser at 320 px; Guides jump navigation remains static (`position: static`, `top: auto`).
- No reference pages, sitemap expansion, sticky navigation, SEO account actions, commit, publish, or deployment were performed. Milestone 20 is next.

## Milestone 20 execution - 2026-07-25

- Added four clean-URL principle pages: `dry-brining.html`, `meat-temperatures.html`, `dough-ratios.html`, and `sauce-ratios.html`.
- Reused the existing static-page visual system: warm paper, Georgia display type, compact content width, sesame card rule, existing header/footer, and ordinary in-flow links.
- Added visible `By Amos Chiam` bylines and Article author markup with `url: https://kitchenconstants.com/about`, matching Google’s author-disambiguation guidance.
- Added Guides discovery links and seven clean sitemap URLs. No Recipe schema, new culinary values, recipe steps, Marinades content, or sticky navigation was added.
- Focused metadata tests pass: 10. Full suite passes: 65. `node --check` passes for the changed test file; `git diff --check` passes with existing line-ending notices.
- Browser verification passed for all four pages at desktop, `390 × 844`, and `320 × 568`; all calculator CTAs opened the intended hash routes, with no actual overflow or console errors. Guides discovery links and static jump navigation were verified at 320 px.
- No commit, deployment, sitemap submission, or Search Console action was performed. Milestone 21 is now the next approved action and requires explicit publishing authorization.
