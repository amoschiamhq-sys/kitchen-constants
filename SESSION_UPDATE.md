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

`npm.cmd test` passes 42 tests with no failures.

## Remaining verification

- JavaScript syntax checks pass for all source and test modules.
- `git diff --check` passes; only normal line-ending notices remain.
- The real page was checked at the 899 px desktop preview with no horizontal overflow.
- Explicit 390 x 844 and 320 x 568 browser viewport checks remain before release sign-off.
