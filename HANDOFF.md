# Executor handoff

Updated: 2026-07-23

## Current state

The MVP now includes the independently named meat catalogue, two dry-brine timing bands, dough formulas with separate liquid and salt calculations, labelled ratio displays, and the approved personal support note.

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
- The support note uses Amos's approved wording and shows an inactive `Leave a tip` action until the Ko-fi URL is added.
- No database, API, storage, analytics, or deployment changes were made.

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

## Next work

1. Follow `LAUNCH_SETUP.md` to create Ko-fi and Stripe accounts and connect the repository to Cloudflare Pages.
2. Bring back the Ko-fi URL and Cloudflare Pages URL; then add the real tip link and finalise deployment.
3. Independently audit and home-test candidate meat salt ratios before calling them reviewed.
4. Keep Bread, Marinades, and Sauces deferred until a later product decision.
