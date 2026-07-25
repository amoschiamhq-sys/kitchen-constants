# Session update

Date: 2026-07-23

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
