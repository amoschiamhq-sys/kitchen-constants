# Kitchen Constants handover

Updated: 2026-07-23

## Outcome

Kitchen Constants is a compact cooking reference for home cooks who want less guessing. The MVP covers meat dry-brining, chef-oriented temperatures, fresh egg pasta, Chinese hand-cut noodles, and dumpling wrappers.

The tagline remains: **Measure twice. Season once.**

## Shipped behavior

- Meat, Cut, Detail, and Doneness are always visible as buttons.
- Selecting a parent choice immediately selects valid downstream defaults.
- Weight defaults to `100 g` and outputs salt in grams only.
- Dry-brine timing shows Minimum and Best together.
- Ground meat remains under its parent meat and uses separate short timing guidance.
- Pasta & Noodles shows flour weight, liquid or egg grams, and salt grams.
- Bread, Marinades, and Sauces are visible as Coming soon but are not interactive.
- Salt type, teaspoons, tablespoons, breadcrumbs, and preparation screens remain absent.
- Chef temperature targets remain primary, with food-safety baselines shown as separate context.
- Pasta ratios now use a clear separator with ingredient subtitles, such as `48% | 2%` with `Water` and `Salt` beneath.
- The support note uses Amos's approved personal-project wording and links `Leave a tip` to <https://ko-fi.com/amoschiam> in a new tab.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder
- Fish & shellfish: Scallops, Prawns, Fish fillet

## Dough formulas

- Fresh egg pasta: 50% beaten egg, 1% salt starting point.
- Chinese hand-cut noodles: 48% water, 2% salt starting point.
- Dumpling wrappers: 52% water, 1% salt starting point.

All dough inputs default to `100 g` flour. Pasta cooking-water salt is deliberately excluded.

## Content status

Meat salt ratios remain candidate values and should be independently audited and home-tested before being described as reviewed. Beef ribs, Pork ribs, and Lamb shoulder still have pending internal-temperature guidance because their tender endpoint depends on preparation method.

## Verification

- `npm.cmd test`: 43 passing tests.
- Syntax checks and `git diff --check` pass. The desktop browser preview at 899 px has no horizontal overflow and the new routes render correctly. A narrow mobile viewport check also passed without horizontal overflow.

## File roles

- `handover.md`: human-facing release summary.
- `HANDOFF.md`: shorter continuation context for another executor.
- `LAUNCH_SETUP.md`: exact external account and hosting checklist for Amos to complete before final deployment.
