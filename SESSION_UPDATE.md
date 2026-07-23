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
- `npm.cmd test` passes 43 tests, `node --check src/app.js` passes, and `git diff --check` passes. Local browser verification of the un-deployed copy changes remains pending because the in-app browser could not reach the local preview server.
- Removed rendered culinary reference links from calculator cards while preserving source URLs and review metadata internally. Added a compact footer support link to Guides and About, and softened the shared footer wording.

## Remaining launch work

- Recheck Search Console around 2026-07-26 or 2026-07-27; indexing and URL inspection may still be pending.

## Remaining content work

- Independently audit and home-test candidate meat salt ratios before describing them as reviewed.
- Beef ribs, Pork ribs, and Lamb shoulder remain pending internal-temperature guidance.
