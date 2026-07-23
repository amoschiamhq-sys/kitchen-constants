# Kitchen Constants handover

Updated: 2026-07-23

## Outcome

The approved calculator redesign is implemented locally. It is a compact, single-page cooking reference with a light cookbook aesthetic and the tagline "Measure twice. Season once."

The launch layer is now included locally: Calculator, Guides and About navigation, an About page credited to Amos Chiam, one concise Guides page covering dry brining, percentages and temperature, search metadata, robots.txt and sitemap.xml. The support prompt is visible beneath results and is intentionally waiting for a real Ko-fi URL before it becomes a live payment link.

The support wording is deliberately brief: "Found this useful? Help keep Kitchen Constants free and independent." The more personal reason for the site belongs in About, where it does not interrupt the calculator flow.

The default view is:

- Chicken / Whole chicken / Whole / Cook through
- Food weight: `100 g`
- Dry-brine ratio: `1.1%`
- Calculated salt: `1.1 g`
- Internal temperature: `165°F / 74°C`

## Shipped behavior

- Meat, Cut, Detail, and Doneness are always visible as buttons.
- Selecting a meat or cut immediately selects its first valid downstream choices.
- Every cut has at least one Detail and Doneness option.
- Weight remains unchanged while switching choices and resets to `100 g` after a full refresh.
- Valid weight edits update salt grams immediately without replacing the focused input.
- Invalid weight clears stale grams and shows an inline correction.
- Partial and old preparation hashes are replaced with canonical selection hashes.
- Browser Back and Forward restore selections.
- Salt type, teaspoons, tablespoons, breadcrumbs, Back controls, and separate preparation screens are absent.
- Lamb Chops, Leg, and Rack provide reviewed Medium-rare and Medium temperature guidance with separate chef-target and USDA-safety wording.
- Finish cards present Chef target as the primary guidance and Food-safety baseline as secondary context.

## Active catalogue

- Chicken: Whole chicken, Breast, Thigh, Ground poultry
- Beef: Steak, Ribeye, Beef ribs, Ground 80/20
- Pork: Chop, Tenderloin, Ribs, Ground pork
- Lamb: Chops, Leg, Rack, Shoulder
- Seafood: Scallops, Shrimp, Fish

## Visual direction

- Light flour-paper background with recipe-paper cards.
- Soft black ink, pandan selected controls, toasted-sesame result emphasis.
- Georgia for brand and headings; Aptos/Segoe UI for controls and body copy.
- The only overt rustic flourish is the narrow sesame recipe-margin rule on result cards.
- Equal meat-button dimensions and compact mobile wrapping.

## Verification

- `node --test`: 37 tests passed, 0 failed.
- JavaScript syntax checks passed for all runtime and test modules.
- `git diff --check` passed apart from existing line-ending notices.
- Browser walkthrough covered defaults, six consecutive selection changes, weight validation and recovery, Back/Forward, refresh, legacy-route recovery, keyboard focus, and console errors.
- Desktop viewport: no horizontal overflow and results begin at 344 px.
- `390 x 844`: no horizontal overflow; equal meat buttons at about 42 px high; results begin at 419 px.
- `320 x 568`: no horizontal overflow; equal meat buttons at about 42 px high; results begin at 545 px.
- Browser console errors: none.
- Lamb browser walkthrough covered Chops, Leg, and Rack at both doneness choices plus the pending Shoulder state.

## Content status

Existing reviewed ratios, timing, sources, and temperature records were retained. Lamb Chops, Leg, and Rack now use reviewed ThermoWorks chef targets for Medium-rare (`130–135°F / 54–57°C`) and Medium (`135–145°F / 57–63°C`), alongside the separately labelled USDA whole-cut baseline of `145°F / 63°C` with at least 3 minutes of rest.

Beef ribs, Pork ribs, and Lamb shoulder deliberately remain at "Awaiting content review". Their `Tender` endpoint depends on the exact cut and cooking method, so recipe-specific smoking or braising targets were not generalized.

## Important files

- `src/constants.js`: catalogue and reviewed cooking content.
- `src/navigation.js`: route parsing, default resolution, canonical hashes, and view model.
- `src/calculator.js`: weight validation and gram calculation.
- `src/app.js`: single-page rendering and interactions.
- `styles/main.css`: responsive cookbook visual system.
- `tests/`: calculation and navigation regression coverage.
- `design-mock.html`: non-production visual reference only.

## Handover files

- `handover.md` is the human-facing project summary, including what is shipped, how it was checked and what remains before launch.
- `HANDOFF.md` is the shorter executor context used when another agent or session continues the work.
- They intentionally overlap on the core invariants, but they serve different readers. Keep `handover.md` as the document to share with a person.

## Suggested next work

1. Add the real Ko-fi URL after the account is created.
2. Confirm `kitchenconstants.com` availability and register it if it is still available.
3. Publish the reviewed local changes through a launch branch and pull request.
4. Connect the private GitHub repository to Cloudflare Pages and submit the sitemap to Google Search Console.

Beef ribs, Pork ribs and Lamb shoulder remain pending. Define preparation-specific `Tender` semantics and review source-backed targets before adding temperatures.
