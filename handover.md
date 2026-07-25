# Kitchen Constants handover

Updated: 2026-07-25

## Outcome

Kitchen Constants is a compact cooking reference for home cooks who want less guessing. The MVP covers meat dry-brining, chef-oriented temperatures, pasta and bread dough ratios, and reusable sauce balances.

The tagline remains: **Measure twice. Season once.**

## Shipped behavior

- Meat, Cut, Detail, and Doneness are canonical choices; Detail and Doneness are shown only when the selected cut offers a meaningful choice.
- Selecting a parent choice immediately selects valid downstream defaults.
- Weight defaults to `100 g` and outputs salt in grams only.
- Dry-brine timing shows Minimum and Best together.
- Ground meat remains under its parent meat and uses separate short timing guidance.
- Pasta & Noodles shows flour weight, liquid or egg grams, and salt grams.
- Bread is active with three baker's-percentage starting formulas; Marinades remain visible as Coming soon and separate from the active Sauces section.
- Sauces are active and task-first, with Stir-fry, Glaze, Dipping, Dressing, and named classics including Vinaigrette.
- Salt type, teaspoons, tablespoons, breadcrumbs, and preparation screens remain absent.
- Chef temperature targets remain primary, with food-safety baselines shown as separate context.
- Pasta ratios now use a clear separator with ingredient subtitles, such as `48% | 2%` with `Water` and `Salt` beneath.
- The support note uses Amos's approved personal-project wording and links `Leave a tip` to <https://ko-fi.com/amoschiam> in a new tab.

## External launch status

- Cloudflare Pages is live at <https://kitchen-constants.pages.dev/> from the `main` branch.
- Amos confirmed the live page is the current version.
- `kitchenconstants.com` was purchased through Cloudflare Registrar, is now Active, and has SSL enabled.
- `https://kitchenconstants.com` was verified over HTTPS at desktop, `390 x 844`, and `320 x 568` with no horizontal overflow or console errors.
- Google Search Console DNS ownership verification succeeded on 2026-07-23.
- The full sitemap URL `https://kitchenconstants.com/sitemap.xml` was submitted and now reports `Success` with 3 discovered pages.
- Recheck Search Console around 2026-07-26 or 2026-07-27; indexing and URL inspection may still be pending.

## Content polish status

- Updated homepage, Guides, and About metadata for natural dry-brining, meat-temperature, pasta-dough, and cooking-reference searches.
- Updated the approved personal About copy, Guides introduction and selected headings, calculator helper text, and support note.
- No existing culinary values, source metadata, calculator behavior, or deployment settings changed; the new Vinaigrette entry is recorded internally as owner-tested with reference material.
- Rendered culinary reference links were removed; source URLs and review metadata remain internal. The compact support link is present in the calculator, Guides, and About footers.
- Automated checks pass: 62 tests, JavaScript syntax, and `git diff --check`.
- This local milestone sequence was not committed or deployed; the live domain state was not changed by this execution. Local in-app browser verification confirmed the updated homepage, Guides, About, and ratio-heavy calculator states.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder

## Dough formulas

- Fresh egg pasta: 50% beaten egg, 1% salt starting point.
- Chinese hand-cut noodles: 48% water, 2% salt starting point.
- Dumpling wrappers: 52% water, 1% salt starting point.

Bread formulas:

- Everyday loaf: 66% water, 2% salt, 1.2% yeast.
- Olive-oil focaccia: 75% water, 2% salt, 1% yeast, 5% olive oil.
- Chinese steamed buns: 55% water, 0.5% salt, 1% yeast, 3% sugar, 2% oil.

All dough inputs default to `100 g` flour. Pasta cooking-water salt is deliberately excluded.

## Content status

Meat and bread ratios remain candidate values by design. Beef ribs, Pork ribs, and Lamb shoulder still have pending internal-temperature guidance because their tender endpoint depends on preparation method. Marinades remain deferred.

Sauce ratios are recorded internally as owner-tested with reference material. Their numeric values and hidden source metadata are unchanged.

## Pre-live URL update

Public canonical page URLs are `/`, `/guides`, and `/about`. The repository metadata and sitemap use these clean URLs; internal `.html` links remain for local file and static-preview compatibility and redirect once on Cloudflare.

## Sauce guidance update — 2026-07-25

- Added Guide 05, “Build a sauce,” before the dough guides.
- The guide covers salty, sweet, acid, umami, fat, heat, and aromatics in a compact task-first format.
- Mixing guidance distinguishes watery ingredients, oil, dried spices or chilli, and delicate fresh herbs without adding chemistry terminology or storage advice.
- Pure salt is described as a separate pinch-to-taste adjustment, not as an equal ratio part.
- Added Vinaigrette after the existing named classics with a `3 Fat : 1 Acid` balance.
- Global role examples now include Worcestershire and Western-style ingredients; user-facing pages do not show culinary sources or citations.

## Verification

- `node --test`: 62 passing tests.
- JavaScript syntax checks and `git diff --check` pass. Browser verification passed at desktop `1280 × 900`, `390 × 844`, and `320 × 568` with no horizontal overflow or console errors; the ratio-heavy pages and final whole-site walkthrough render correctly.

## Completed visual polish - ratio labels

- On sauce result cards, the large ratio number can visually overlap its subtitle, including one-line labels such as `ACID`.
- Cause identified: ratio parts had no shared desktop rows for the large number and its subtitle, allowing the display font's lower glyphs to crowd the label boundary.
- Implemented locally: desktop dough and sauce ratio parts now reserve explicit number and subtitle rows; existing mobile rules remain unchanged.
- Verified with desktop screenshots of Fresh egg pasta, Everyday loaf, Chinese steamed buns, Stir-fry / Balanced, Sesame (Goma), and Dipping / Spicy, plus 390 px and 320 px responsive checks. No value/subtitle intersection, horizontal overflow, or console errors were observed. Not deployed in this handover.

## File roles

- `handover.md`: human-facing release summary.
- `HANDOFF.md`: shorter continuation context for another executor.
- `LAUNCH_SETUP.md`: external account, hosting, domain, and launch checklist; use the current launch status above when resuming.
