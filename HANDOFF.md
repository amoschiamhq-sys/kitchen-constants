# Executor handoff

Updated: 2026-07-23

## Current state

The MVP now includes the independently named meat catalogue, two dry-brine timing bands, and dough formulas with separate liquid and salt calculations.

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
- No database, API, storage, analytics, or deployment changes were made.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder
- Fish & shellfish: Scallops, Prawns, Fish fillet

## Verification baseline

- `npm.cmd test`: 42 passing tests.
- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- Browser verification passed for the new category buttons, timing display, dough salt output, and the 899 px desktop preview with no horizontal overflow.
- Explicit 390 x 844 and 320 x 568 browser viewport checks remain to be completed in the next visual QA pass.

## Next work

1. Complete browser verification at desktop, 390 x 844, and 320 x 568.
2. Independently audit and home-test candidate meat salt ratios before calling them reviewed.
3. Keep Bread, Marinades, and Sauces deferred until a later product decision.
