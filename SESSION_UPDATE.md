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
- Added a visually ready but inactive `Leave a tip` action until the Ko-fi URL exists.
- Added `LAUNCH_SETUP.md` with the exact Ko-fi, Stripe, Cloudflare Pages, and optional domain setup checklist.

## Verification

- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- The real page was checked at the 899 px desktop preview with no horizontal overflow.
- The real page was checked at a narrow mobile viewport with no horizontal overflow; ratio labels remain paired beneath their percentages.
- The support copy renders in the live local preview.

## Remaining work

- Amos must create and verify the Ko-fi and Stripe accounts.
- Amos must connect the GitHub repository to Cloudflare Pages and test the free deployment.
- Add the real Ko-fi URL to the `Leave a tip` action after account setup.
- Add the final custom domain only if desired.
