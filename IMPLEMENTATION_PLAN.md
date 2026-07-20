# Kitchen Constants — Initial Prototype Implementation Contract

## Purpose


Build the first mobile-first, testable Kitchen Constants prototype around a small interaction matrix:

`Home → Meat → Type → (variant or doneness when relevant) → Preparation → Result`

The working paths are:

- Chicken → Whole chicken
- Chicken → Breast → Bone-in / Boneless
- Chicken → Thigh → Bone-in / Boneless
- Beef → Steak → Bone-in / Boneless → Medium-rare / Medium
- Beef → Roast → Medium-rare / Medium
- Pork → Chop → Bone-in / Boneless
- Pork → Tenderloin

The whole-chicken dry-brine screen must expose the confirmed constant before input and calculate salt. Other paths must exercise the same switching model but show an explicit content-review placeholder until their culinary values are approved.

This contract intentionally stops at a representative interaction matrix. It does not implement the broader launch catalogue.

## Current repository diagnosis

The repository currently contains product-planning material only:

- `handover.md`: product requirements and design direction.
- `Frontend-design/SKILL.md`, `Luna Executor/SKILL.md`, and `Sol Planner/SKILL.md`: workflow material, not application source.

There is no existing application entry point, package manifest, route, function, JavaScript handler, stylesheet, database, backend, or automated test suite. There is consequently no legacy behavior to preserve, replace, redirect, or delete, and no duplicate implementation that can conflict.

The repository is not currently initialized as a Git worktree. Diff review during milestone gates must therefore use direct file inspection unless Git is initialized separately with user approval.

## Recommended technical shape

Use a small dependency-free web application:

- Semantic `index.html`.
- ES modules under `src/`.
- One responsive stylesheet under `styles/`.
- Node's built-in `node:test` runner for pure state and calculation tests.
- Hash routes for refreshable, back-button-compatible screens without a server router.
- No build step for the first prototype.

This is the simplest suitable approach for four screens and one calculation. The domain data, state reducer, calculations, and rendering must remain separate so later categories can be added without rewriting the prototype.

## Files expected across the full prototype

The complete prototype should require no more than these nine application/test files:

1. `index.html`
2. `package.json`
3. `src/constants.js`
4. `src/calculator.js`
5. `src/navigation.js`
6. `src/app.js`
7. `styles/main.css`
8. `tests/calculator.test.js`
9. `tests/navigation.test.js`

No generated files, framework scaffolding, asset pipeline, database, or server is permitted in this prototype.

## Product values fixed by the handover

- Recommended dry-brine salt ratio: `1.1%` of chicken weight.
- Practical minimum ratio: `0.9%`.
- Practical maximum ratio: `1.3%`.
- Input base: chicken weight in grams.
- Output: salt in grams.
- Display precision: one decimal place.
- Temperature value: unresolved and must remain an explicit content-review placeholder until separately approved.

The three salt ratios must have one canonical definition in `src/constants.js`. They must never be duplicated as independent numeric literals in rendering or test code.

## State model

### Permitted route states

| State ID | Hash | Visible result |
|---|---|---|
| `home` | `#/` | Brand, tagline, and active Meat choices. Chicken, Beef, and Pork are active; other launch categories are inert. |
| `meat` | `#/<meat>` | Types for the selected meat. |
| `cut` | `#/<meat>/<type>` | Variant choices when the type requires them, otherwise preparation choices. |
| `variant` | `#/<meat>/<type>/<variant>` | Doneness choices when the selected type requires them, otherwise preparation choices. |
| `doneness` | `#/<meat>/<type>/<variant>/<doneness>` | Preparation choices for steak and roast. |
| `dry-brine` | `#/<meat>/<type>/.../dry-brine` | Selected path, ratio or review placeholder, optional weight input, and result. |
| `not-found` | any unknown hash | Short recovery message and a Home action. |

### Permitted calculator states

| State ID | Raw input | Derived output |
|---|---|---|
| `empty` | empty string or whitespace | No amount; neutral helper text. |
| `valid` | a finite positive decimal from `0.1` through `1,000,000` grams | Recommended, minimum, and maximum salt values. |
| `invalid-format` | letters, multiple separators, scientific notation, negative sign, or non-finite input | Inline format error; no calculated values. |
| `out-of-range` | zero, less than `0.1`, or more than `1,000,000` grams | Inline range error; no calculated values. |

Both `.` and `,` are accepted as a single decimal separator. Input is not reformatted while focused. A valid result is calculated from the normalized numeric value, not from a rounded input.

### Route transition table

There are no database changes in any transition.

| Starting state | User action | Database change | Resulting state | UI result |
|---|---|---|---|---|
| `home` | Activate a meat | None | `meat` | Types for that meat replace the home choices. |
| `meat` | Activate a type | None | `cut` | Variant choices or preparation choices appear. |
| `cut` | Activate a variant when offered | None | `variant` | Doneness choices or preparation choices appear. |
| `variant` | Activate a doneness when offered | None | `doneness` | Preparation choices appear. |
| Any selection state | Activate Dry brine | None | `dry-brine` | Constant-first result or content-review placeholder appears. |
| Any non-home route | Activate visible Back | None | Previous parent route | Parent choice screen appears at its prior scroll position where possible. |
| Any valid route | Browser Back/Forward | None | Route represented by the new hash | Exactly one render occurs. |
| Any valid route | Refresh | None | Same route | Same route renders; calculator input resets because persistence is deferred. |
| `not-found` | Activate Home | None | `home` | Home screen appears. |
| Any route | Double-click or rapid repeated activation of the same navigation control | None | Intended destination once | No duplicate listeners, history churn, or duplicate view. |

### Calculator transition table

| Starting state | User action | Database change | Resulting state | UI result |
|---|---|---|---|---|
| `empty` | Enter `1500` | None | `valid` | `16.5 g`, range `13.5–19.5 g`. |
| `valid` | Replace with `750.5` | None | `valid` | All values update immediately from the new weight. |
| `valid` | Clear input | None | `empty` | Result values disappear and neutral guidance returns. |
| Any | Enter malformed text | None | `invalid-format` | Inline error appears; prior result is removed. |
| Any | Enter `0` or a value beyond limits | None | `out-of-range` | Inline range error appears; prior result is removed. |
| `invalid-format` or `out-of-range` | Correct to valid input | None | `valid` | Error clears and correct output appears without reload. |
| `valid` | Re-enter the same value repeatedly | None | `valid` | Output remains identical; no cumulative calculation. |
| Any calculator state | Navigate away and return | None | `empty` | Input is empty; local persistence is deferred. |

### Failure, retry, stale-page, and undo behavior

- There are no requests, so network failure and request retry are not applicable.
- A stale cached HTML page must still recover unknown hashes through `not-found`; cache versioning/service workers are deferred.
- Undo is not a product action in this flow. Users undo input by editing or clearing it, and undo navigation with the browser Back button.
- Rapid input and repeated events must recompute from the current raw value only. No result may depend on the prior result.
- Event listeners must be registered once at application startup. View renders must not add accumulating global listeners.

## Database invariants

No database or persistent store exists in this milestone sequence. Therefore transactions, data repair, historical-row preservation, and database idempotency are not applicable.

The equivalent in-memory invariants are:

1. The displayed salt values are pure functions of normalized chicken weight and the three canonical ratios.
2. Recommended salt is always between the displayed minimum and maximum.
3. Invalid or empty input never leaves a stale calculated result visible.
4. Route state is derived from the current hash; it is not maintained as a second conflicting route variable.
5. Rendering the same state multiple times produces the same visible structure.
6. No user history is created or rewritten because persistence and favourites are deferred.

If malformed local data is discovered during implementation, it indicates accidental persistence outside this contract and must be removed from the prototype rather than migrated. No historical data exists to rewrite.

## Backend contracts

No backend route, API request, server validation, or database operation is permitted. All calculations run locally.

No legacy endpoints exist. The executor must not create a fake API, local server endpoint, form submission, analytics call, or external content request.

## Frontend interaction contract

### Clickable surfaces

- Brand mark/name: returns to Home except when already on Home.
- Active category card: Chicken.
- Active cut card: Whole chicken.
- Active preparation card: Dry brine.
- Back control on the three child screens.
- Home recovery control on the not-found screen.
- Chicken weight input on the dry-brine screen.

Each navigation surface must be a native `<a>` with an `href` matching the destination hash, not a clickable `<div>`. The input must have a visible `<label>`, `inputmode="decimal"`, and a persistent `g` unit.

### Inert surfaces

The future launch categories and unimplemented chicken cuts/preparations may be shown to communicate scope, but they must be visibly marked `Coming later`, use disabled/inert semantics, and must not change the hash. They must not look identical to active controls.

The displayed ratio, output, target-temperature placeholder, thermometer note, decorative ruled lines, and `Kc` mark are not clickable.

### Drag-and-drop

No element is draggable and no drop target exists. Drag start, target highlighting, drop, drag cancellation, occupied-date behavior, and drag failure recovery are explicitly outside the cooking prototype. Native text selection must not be disabled globally.

### Input and rendering

- Use the `input` event so calculations update without a submit button.
- Validation messaging must use a stable inline region associated with the input.
- Derived results must use a polite live region so assistive technology receives changes without excessive interruption.
- The renderer must replace the contents of one main application region or update stable nodes; it must not append duplicate screens.
- Hash changes render the destination at the top on forward navigation. Browser Back should use the browser's scroll restoration where supported; application code must not force a second scroll after `popstate`/`hashchange`.
- Focus moves to the page heading after app-initiated navigation. Browser Back/Forward must not trap focus.
- A failed render must show a recoverable error panel with a Home link and log one diagnostic; it must not leave the previous screen appearing current under the new hash.

## Calculation contract

`src/calculator.js` must export pure functions with no DOM access:

### `parseWeight(rawValue)`

- Input: string.
- Normalize: trim surrounding whitespace and replace one comma with a period.
- Reject: empty as `empty`; more than one separator; signs; exponent notation; non-digits other than the one separator; non-finite values.
- Range: `0.1 ≤ weight ≤ 1,000,000` grams.
- Return a discriminated result: `{ status: 'empty' }`, `{ status: 'invalid-format' }`, `{ status: 'out-of-range' }`, or `{ status: 'valid', grams: number }`.

### `calculateDryBrine(weightGrams, ratios)`

- Preconditions: finite positive weight and a ratio object satisfying `min ≤ recommended ≤ max`.
- Calculate each salt value as `weightGrams × ratio / 100`.
- Return unformatted numeric values.
- Do not round intermediate values.
- Throw a typed error for broken programmer preconditions; user input must be filtered through `parseWeight` first.

### `formatGrams(value)`

- Return one decimal place using the document locale's decimal separator.
- Do not add the `g` suffix; rendering owns the unit.
- Values below `0.05 g` cannot occur because the valid weight floor is `0.1 g`; if future constants make this possible, still display `0.0` rather than silently replacing it with a threshold label.

## Accessibility and responsive contract

- One `<h1>` per screen.
- Tap targets at least `44 × 44 CSS px`.
- Keyboard focus indicator with at least 3:1 contrast against adjacent colours.
- Text contrast at least WCAG AA.
- Layout must remain usable at 320 px CSS width and 200% browser zoom.
- No horizontal scrolling at 320 px.
- Numeric result and unit remain together on the same line.
- The recommended ratio, input, calculated amount, and range must fit within a short phone scroll.
- No hover-only information or interaction.
- Respect `prefers-reduced-motion`; navigation does not require animation.

## Milestones

### Milestone 1 — Domain constants and calculator behavior

#### Scope boundary

Included:

- Create the minimal package manifest and Node test command.
- Define the one canonical dry-brine record.
- Implement input parsing, pure calculation, and formatting.
- Add exhaustive calculator unit tests.

Deferred:

- HTML, navigation, DOM rendering, CSS, temperature research, other categories, persistence, and browser testing.

Maximum change: four files — `package.json`, `src/constants.js`, `src/calculator.js`, `tests/calculator.test.js`.

Dependencies that must be stable:

- Ratios `1.1%`, `0.9%`, and `1.3%` from the handover.
- Grams as input and output unit.
- One-decimal display precision.

#### Current-code diagnosis

No functions or tests exist. Nothing is replaced or deleted. The executor must not modify `handover.md` or the planning/skill folders.

#### Automated tests

Module: `tests/calculator.test.js`.

- `parseWeight returns empty for blank input`.
- `parseWeight accepts integer grams`.
- `parseWeight accepts one dot decimal separator`.
- `parseWeight accepts one comma decimal separator`.
- `parseWeight rejects letters, signs, exponent notation, and repeated separators`.
- `parseWeight rejects zero and values outside the supported range`.
- `calculateDryBrine returns 16.5, 13.5, and 19.5 grams for 1500 grams`.
- `calculateDryBrine does not accumulate rounding across repeated calls`.
- `calculateDryBrine rejects invalid programmer preconditions`.
- `formatGrams always emits one decimal place`.
- `canonical dry-brine ratios remain ordered and use chicken weight as their basis`.

#### Gate

The executor must stop after:

1. Focused calculator tests pass.
2. The complete available suite passes (identical to focused tests at this stage).
3. `node --check` passes for every JavaScript file.
4. All four changed files are reviewed directly for accidental UI or unrelated scope.
5. Browser verification is reported as not applicable because no UI exists yet.

### Milestone 2 — Multi-meat route state and semantic screens

#### Scope boundary

Included:

- Add the HTML shell.
- Implement hash parsing for home, meat, type, variant, doneness, preparation, and not-found states.
- Render the Home screen and working Chicken, Beef, and Pork interaction paths.
- Support the conditional variant and doneness steps without exposing irrelevant choices.
- Preserve the selected path in the result screen and provide direct Change links to each prior decision.
- Connect the tested calculator functions to the whole-chicken dry-brine weight input.
- Show explicit content-review placeholders for unreviewed meat/type combinations; do not invent ratios or temperatures.

Deferred:

- Final visual styling, decorative notebook details, favourites, persistence, temperature value research, and other functional categories.

Maximum change: four new/changed runtime/test files — `index.html`, `src/navigation.js`, `src/app.js`, `tests/navigation.test.js` — plus the necessary data additions to `src/constants.js` and import adjustments to Milestone 1 files.

Dependencies that must already be stable:

- Milestone 1 calculator API and tests.
- Hash route table in this contract.

#### Current-code diagnosis

Milestone 1 has no DOM handlers. This milestone adds one application initializer, one hash listener, and one delegated input listener. No handler may be registered on each render. No existing behavior should be removed.

#### Automated tests

Module: `tests/navigation.test.js`.

- `parseRoute maps every supported multi-meat hash to one route state`.
- `parseRoute maps unknown and malformed hashes to not-found`.
- `route parent mapping returns the correct Back destination for meat, type, variant, and doneness states`.
- `repeated parsing is idempotent`.
- `route render model exposes Chicken, Beef, and Pork types`.
- `whole chicken does not offer a bone-in/boneless step`.
- `breast, thigh, chop, and steak expose bone-in/boneless only where applicable`.
- `steak and roast expose only medium-rare and medium doneness`.
- `changing meat or type clears the non-persisted weight`.
- `changing a compatible variant preserves weight but changes the selected path`.
- `dry-brine render model exposes constants before weight input`.
- `unreviewed paths expose placeholders rather than invented culinary values`.
- `empty and invalid calculator states cannot expose stale output`.
- `same input dispatched repeatedly produces the same render model`.

Calculator edge cases remain in `tests/calculator.test.js` and must continue passing.

#### Gate

Stop after focused navigation tests, complete suite, JavaScript syntax checks, direct diff/file review, and a basic browser walkthrough of every route, refresh, Back, Forward, invalid hash, valid input, correction from invalid input, and repeated navigation.

### Milestone 3 — Behavioral hardening and accessibility

#### Scope boundary

Included:

- Correct focus movement, live-region behavior, validation association, and scroll behavior.
- Verify rapid input, double activation, repeated navigation, refresh, and recovery.
- Fix behavioral defects only.

Deferred:

- Visual polish, typography tuning, decorative styling, temperature research, and expanded content.

Maximum change: three subsystems — `index.html`, `src/app.js`, and the existing tests. No new runtime subsystem.

Dependencies that must already be stable:

- Milestone 2 route and calculator rendering behavior.

#### Automated tests

Extend the existing two test modules; do not add a third unless the executor can do so without a DOM dependency.

- `rapid calculator updates keep only the latest derived state`.
- `double navigation activation resolves to one destination state`.
- `navigating away and returning resets non-persisted calculator state`.
- `not-found recovery returns a valid home render model`.
- `route models provide one heading and accessible names for active controls`.
- `error and result regions are mutually exclusive`.

#### Gate

Stop after focused tests, complete suite, syntax checks, direct diff/file review, and the full manual browser script below. No styling work may begin until the behavioral gate passes.

### Milestone 4 — Mobile-first visual system

#### Scope boundary

Included:

- Add `styles/main.css`.
- Implement the warm off-white, charcoal, and one muted food-accent palette.
- Create the restrained notebook-inspired card and ruled-line treatment.
- Style the `Kc` text mark, navigation choices, constants, input, results, placeholder, focus, error, disabled, and not-found states.
- Verify phone, tablet, and desktop layouts.

Deferred:

- Custom raster illustrations, web-font downloads, dark mode, animation, final logo assets, favourites, search, metric/imperial toggle, and additional calculator flows.

Maximum change: `styles/main.css`, plus no more than minor semantic class additions to `index.html` and `src/app.js`.

Dependencies that must already be stable:

- All Milestone 3 behavior and browser checks.

#### Automated tests

All existing behavior tests must remain unchanged and pass. Styling must not require rewriting behavioral assertions. Add no snapshot tests for pixel values.

#### Gate

Stop after focused and complete tests, JavaScript syntax checks, direct diff/file review, and browser verification at 320×568, 390×844, 768×1024, and a desktop viewport. Check 200% zoom, keyboard-only use, visible focus, no horizontal overflow, and reduced-motion mode.

### Milestone 5 — Reviewed temperature content (separate approval)

#### Scope boundary

Included only after explicit product approval:

- Research authoritative sources for professional whole-chicken target temperature guidance, including the role of hold time.
- Record source notes and review date in the canonical content record.
- Replace the placeholder with approved wording and value.
- Add content tests that prevent an unreviewed value from appearing.

Deferred:

- Advanced pasteurization charts, medical-risk modes, government/professional comparison UI, cooking time, oven settings, and other foods.

Maximum change: canonical content data, the dry-brine render content, and the relevant tests; no new subsystem.

Dependencies that must already be stable:

- A product decision on whether the app shows a single conservative endpoint, a professional endpoint plus hold-time note, or a more detailed time-and-temperature model.
- Approved authoritative sources.

This milestone must not silently choose a temperature. The placeholder remains correct until this decision is made.

## Scenario matrix

### Kitchen Constants scenarios

| Scenario | Given | When | Then | Automated coverage |
|---|---|---|---|---|
| First use | Home loads with no stored state | User follows Chicken → Whole chicken → Dry brine | Ratio and range are visible before input; calculator is empty | Navigation render-model tests plus browser script |
| Repeated use | Calculator has already accepted several values | User replaces the weight five times | Each result is calculated only from the newest value | Calculator idempotency tests plus browser script |
| Integer input | Dry-brine screen is open | User enters `1500` | Recommended `16.5 g`; range `13.5–19.5 g` | Exact calculator test |
| Decimal input | Dry-brine screen is open | User enters `750,5` | Input is accepted and output uses the normalized value | Parser tests |
| Invalid then retry | A valid result is visible | User enters `12kg`, then corrects to `1200` | Stale result disappears during error; corrected output is `13.2 g`, range `10.8–15.6 g` | State/render-model tests |
| Clear/undo input | A result is visible | User clears the field | Neutral empty state returns, with no old values | Render-model tests |
| Move away and use again | A valid weight is entered | User navigates Home and returns through the flow | Input returns empty because persistence is deferred | Navigation test and browser script |
| Double-click | User is on a choice screen | User rapidly activates the same link | One destination renders with no duplicated content/listeners | Navigation idempotency test and browser script |
| Refresh | Dry-brine route is visible | User refreshes | Same route and constants render; input resets | Browser script |
| Stale/unknown route | Browser opens an unknown hash | Page initializes | Recoverable not-found screen appears with Home link | Route parser test |
| Boundary minimum | Dry-brine screen is open | User enters `0.1` | Valid one-decimal result is shown | Parser/calculator tests |
| Boundary maximum | Dry-brine screen is open | User enters `1000000` | Valid result is shown without overflow | Parser/calculator tests |
| Out of range | Dry-brine screen is open | User enters `0` or `1000000.1` | Range error appears and no amount is shown | Parser tests |
| Phone boundary | App is viewed at 320 px width | User traverses every route and enters a weight | No horizontal scrolling; controls remain operable | Browser gate |
| Long session | App remains open without reload | User completes five route cycles and several input/edit/clear cycles | Controls continue working, viewport does not jump, and no duplicate content appears | Manual browser script |

### Skill-prescribed scheduling scenarios that are not applicable

The planning skill names plant scheduling, occupied dates, watering recurrences, forecasts, month boundaries, and a six-month horizon. Kitchen Constants has no plants, groups, dates, watering records, recurrence, forecast, drag-and-drop, or database. These scenarios must not be implemented by analogy:

- Same-date events: not applicable.
- Dragging a plant to an occupied date: not applicable.
- Dragging a group to an occupied date: not applicable.
- Watering today, in the past, or in the future: not applicable.
- Undoing, moving, and recording again: covered only by editing/clearing calculator input and navigating away/back; no history mutation exists.
- Forecast coverage ending before the next recurrence: not applicable.
- Existing malformed or duplicated occurrence state: not applicable; no persisted occurrences exist.
- Month boundaries and six-month horizon: not applicable.

## Manual browser script

Use realistic whole-chicken weights. Perform the script in one browser session without manually reloading except where the script explicitly requires a refresh.

1. Open `#/` at a desktop viewport. Confirm the `Kc` brand, tagline, active Chicken choice, and visibly inert future categories.
2. Use only the keyboard to activate Chicken, Whole chicken, and Dry brine. Confirm the heading receives focus after each navigation and the viewport starts at the expected position.
3. Confirm `1.1%` and `0.9–1.3%` are visible before entering any weight. Confirm the target-temperature area says content review is required and does not invent a number.
4. Enter `1500`. Confirm `16.5 g` and `13.5–19.5 g`.
5. Without leaving the screen, replace the value consecutively with `1200`, `1750`, `2200`, `950`, and `750,5`. Confirm every result changes once and remains based on the current value only. This is the required sequence of at least five consecutive calculation interactions; drag-and-drop is not part of this product.
6. Perform three edit/clear cycles without reload: clear → `1400`; clear → `2000`; clear → `1100`. After each clear confirm no stale amount remains; after each entry confirm a new result appears.
7. Enter `12kg`. Confirm the valid result disappears and an inline error appears. Correct it to `1200` and confirm the error clears and `13.2 g`, `10.8–15.6 g` appear.
8. Enter `0`, `0.1`, `1000000`, and `1000000.1` in turn. Confirm the two boundary values are valid and the two outside values are errors.
9. Activate Back to Whole chicken, Back to Chicken, and Back to Home. Then repeat the complete forward path five consecutive times using a mix of visible Back links and browser Back/Forward. Confirm there are no duplicate screens or dead controls.
10. On the dry-brine route, refresh once. Confirm the same route returns, the input is empty, and the constant remains visible.
11. Change the hash to `#/unknown`. Confirm the recovery screen appears. Activate Home and confirm recovery.
12. Scroll partway down on a choice screen if the viewport permits, navigate forward, and use browser Back. Confirm the application does not cause an unexpected second viewport jump.
13. Repeat steps 2–8 at 320×568 and 390×844. Confirm no horizontal overflow, truncation, or unit wrapping. At desktop size, set browser zoom to 200% and repeat the forward path.
14. Throughout the session, inspect the console. Confirm no uncaught exceptions and no repeated diagnostic messages from duplicate listeners.
15. Since there is no database, assert in developer tools that no Local Storage, Session Storage, IndexedDB, cookie, or network write was created by these actions.

## Rejected behavior and tests that must not be introduced

- Do not hide the constant until a weight is entered.
- Do not calculate salt from the previously rounded salt result.
- Do not accept units embedded in the numeric field.
- Do not make future options appear active.
- Do not add a submit button when direct input feedback is sufficient.
- Do not persist weight input in this prototype.
- Do not silently redirect unknown hashes to Home; show recoverable not-found state.
- Do not add click handlers during every render.
- Do not encode the currently unreviewed chicken temperature as fact.
- Do not use screenshots or visual snapshots as the sole evidence of behavior.

No existing tests encode rejected behavior because no suite exists.

## Milestone evidence report template

After every milestone, the executor must stop and report:

1. Files added or changed.
2. Exact focused test command and observed result.
3. Exact complete-suite command and observed result.
4. Exact syntax-check command and observed result.
5. Direct diff/file review findings.
6. Browser checks performed and observed result, or why browser verification is not yet applicable.
7. Known issues or deviations.
8. Confirmation that the next milestone has not started.

## Ambiguities requiring product decisions

1. **Chicken target temperature.** Recommended default: retain an explicit content-review placeholder through Milestone 4, then run Milestone 5 only after approving the safety/content model and sources.
2. **Static stack.** Recommended default: dependency-free HTML/CSS/ES modules with Node built-in tests, as specified. A framework would add setup and interpretation without helping the first four screens.
3. **URL behavior.** Recommended default: hash routes so refresh and browser navigation work on static hosting without server configuration.
4. **Unimplemented choices.** Recommended default: show the other launch choices as visibly inert `Coming later` items to test information architecture without implying they work.
5. **Decimal locale.** Recommended default: accept both comma and dot, while formatting output using the browser locale.
6. **Weight upper bound.** Recommended default: use a generous technical ceiling of `1,000,000 g` to reject overflow and obvious mistakes without imposing a narrow product assumption.
7. **Input persistence.** Recommended default: none for this prototype. Favourites and saved inputs are later features.
8. **Git setup.** Recommended default: do not initialize or configure version control as part of implementation; use direct file review unless the user separately asks for Git.

## Execution prompt — Milestone 2 only

Implement only Milestone 2 from `IMPLEMENTATION_PLAN.md`: build the semantic, hash-routed multi-meat interaction matrix for Chicken, Beef, and Pork, including conditional bone-in/boneless and doneness choices, direct Change links, the whole-chicken dry-brine calculator connection, and explicit placeholders for unreviewed content. Do not add final visual styling, persistence, temperature values, or additional launch categories. Preserve `handover.md`, the Sol Planner contract, and all skill folders. Run focused navigation tests, the complete suite, JavaScript syntax checks, direct file review, and the required browser walkthrough; then stop and report evidence using the milestone evidence template. Do not begin Milestone 3.
## Product-direction amendment (supersedes the earlier step-by-step prompt)

The interface is now intentionally single-page. Meat, cut, variant, and doneness choices stay on one screen and update the same result area in place. Salt guidance and internal-temperature guidance are sibling result cards on that page; breadcrumbs, Back links, and separate preparation screens are retired. Hashes remain only as optional deep-link state for a selected choice.
