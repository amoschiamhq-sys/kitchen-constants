# Executor handoff

Updated: 2026-07-23

## Current state

The MVP now includes the independently named meat catalogue, two dry-brine timing bands, dough formulas with separate liquid and salt calculations, labelled ratio displays, and the approved personal support note.

Cloudflare Pages is now deployed from the `main` branch at <https://kitchen-constants.pages.dev/>. Amos confirmed that the live page is the current version. The custom domain `kitchenconstants.com` is active through Cloudflare Registrar and SSL is enabled.

## Stable invariants

- Meat remains the default category.
- Every active meat cut has non-empty Detail and Doneness choices.
- The first valid downstream choice is selected automatically.
- Weight defaults to `100 g`, remains stable during selection changes, and resets after refresh.
- Salt output is calculated in grams only.
- Current meat salt ratios remain candidate values and were not changed during this milestone.
- Chef temperature guidance remains primary, with food-safety context beneath it.
- Bread, Marinades, and Sauces are visible as non-interactive Coming soon choices.
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

- `npm.cmd test`: 43 passing tests.
- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- Browser verification passed for the ratio labels, support copy, new category buttons, timing display, dough salt output, and the 899 px desktop preview with no horizontal overflow.
- A narrow mobile viewport check passed with no horizontal overflow.
- `https://kitchenconstants.com` was verified over HTTPS at the default desktop viewport, `390 x 844`, and `320 x 568`; the live calculator had no horizontal overflow or console errors.
- The live Pasta & Noodles styles, reviewed Lamb Chops targets, and pending Lamb Shoulder state were confirmed on the custom domain.
- Google Search Console DNS ownership verification succeeded on 2026-07-23, and `https://kitchenconstants.com/sitemap.xml` now reports `Success` with 3 discovered pages.
- Content polish updated page metadata, the About copy, Guides introduction and headings, calculator helper text, and the support note. The local automated checks pass; visual verification of these un-deployed changes remains pending because the in-app browser could not reach the local preview server.
- Rendered culinary reference links were removed from calculator results; source URLs and review metadata remain stored internally. A compact `Leave a tip` link is available in the calculator, Guides, and About footers.

## Launch handoff

1. Recheck Search Console around 2026-07-26 or 2026-07-27. The sitemap is accepted; URL indexing may take days or weeks.
2. Keep `https://kitchen-constants.pages.dev/` as the fallback deployment URL.

## Remaining product work

1. Independently audit and home-test candidate meat salt ratios before calling them reviewed.
2. Keep Bread, Marinades, and Sauces deferred until a later product decision.
