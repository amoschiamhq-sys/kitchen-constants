# Kitchen Constants — Approved Redesign Implementation Contract

## Objective

Bring the existing single-page calculator into line with the approved interaction and visual direction without adding unrelated features.

The page’s single job is to let a home cook choose a meat, cut, detail, and doneness; immediately see the dry-brine percentage and internal-temperature guidance; and optionally change a default `100 g` weight to calculate salt in grams.

The approved masthead copy is:

> Measure twice. Season once.

This contract is for implementation by another coding model. It does not authorize implementation during the planning pass.

## Approved product decisions

These decisions supersede conflicting statements in the older plan and implementation notes:

1. The interface is one compact page. Meat, Cut, Detail, Doneness, Prepare, and Finish remain visible together.
2. All choice controls are buttons or native links styled as buttons. Selection dropdowns are not used.
3. Selecting a meat automatically selects that meat’s first cut, first detail, and first doneness.
4. Selecting a cut automatically selects that cut’s first detail and first doneness.
5. Detail is always visible and always has at least one choice, even where only one meaningful detail exists.
6. Doneness is always visible and always has at least one choice, even where only one finish applies.
7. Results appear immediately; the user never has to complete a second screen or explicitly open a preparation.
8. Weight defaults to `100 g`, remains editable, and is preserved while switching selections in the same browser session.
9. The dry-brine percentage is the dominant result. Salt remains authoritative in grams.
10. Salt type, teaspoon estimates, tablespoon estimates, and volume conversions are removed.
11. Breadcrumbs, Back controls, separate preparation screens, and the large introductory hero are removed from the primary flow.
12. Lamb uses proper cuts—Chops, Leg, Rack, and Shoulder. Bone-in and Boneless are details, not cuts.
13. The active version-one catalogue is the compact catalogue shown in the approved mock. Previously added extra beef and pork choices are deferred.
14. Meat buttons have consistent dimensions. No item grows because its copy is longer.
15. The layout is mobile-first and compressed. The controls must not force excessive scrolling before results begin.
16. The final direction is a light, lightly rustic cookbook—not dark, clinical, overtly Chinese or Singaporean, faux-vintage, handwritten, or “nerdy.” Singaporean and actuarial influence appears only as quiet food awareness, precision, and disciplined hierarchy.
17. Finish cards present the Chef target as the primary temperature guidance and the Food-safety baseline as secondary context. Safety remains visible where relevant but does not lead the cooking decision.

## Approved active catalogue

The ordering in this table defines every default.

| Meat | Cuts in order | Detail choices in order | Doneness choices in order |
|---|---|---|---|
| Chicken | Whole chicken; Breast; Thigh; Ground poultry | Whole chicken: Whole. Breast: Bone-in, Boneless. Thigh: Bone-in, Boneless. Ground poultry: Ground. | Whole chicken: Cook through. Breast: Cook through. Thigh: Tender. Ground poultry: Cook through. |
| Beef | Steak; Ribeye; Beef ribs; Ground 80/20 | Steak: Bone-in, Boneless. Ribeye: Bone-in, Boneless. Beef ribs: Bone-in. Ground 80/20: Ground. | Steak and Ribeye: Medium-rare, Medium. Beef ribs: Tender. Ground 80/20: Cook through. |
| Pork | Chop; Tenderloin; Ribs; Ground pork | Chop: Bone-in, Boneless. Tenderloin: Boneless. Ribs: Bone-in. Ground pork: Ground. | Chop and Tenderloin: Recommended. Ribs: Tender. Ground pork: Cook through. |
| Lamb | Chops; Leg; Rack; Shoulder | Chops: Bone-in, Boneless. Leg: Bone-in, Boneless. Rack: Bone-in. Shoulder: Bone-in, Boneless. | Chops, Leg, and Rack: Medium-rare, Medium. Shoulder: Tender. |
| Seafood | Scallops; Shrimp; Fish | Scallops: Shucked. Shrimp: Peeled. Fish: Fillet. | Each: Cook through. |

For an unreviewed culinary value, render the selected Detail and Doneness normally and keep the result card in a stable “Awaiting content review” state. Do not invent a percentage or temperature merely to fill the card.

## Approved visual system

Use the fixed palette from `design-mock.html` as the visual reference, not the host application theme:

| Token | Value | Use |
|---|---:|---|
| Flour paper | `#F1EEE6` | Page background |
| Recipe paper | `#FAF8F2` | Result cards and inputs |
| Soft ink | `#20231F` | Primary copy and temperature values |
| Pandan leaf | `#6F7D68` | Selected controls |
| Deep pandan | `#596652` | Selected-control fill and high-contrast accents |
| Toasted sesame | `#A97A3C` | Dry-brine percentage and the result-card spine |
| Warm stone | `#D8D2C5` | Borders and inactive structure |
| Brick spice | `#965846` | Validation and error states only |

Typography:

- Brand, field labels, and card headings: `Georgia, "Times New Roman", serif`.
- Body and controls: `Aptos, "Segoe UI", Arial, sans-serif`.
- Numbers: body face with `font-variant-numeric: tabular-nums`; no monospace utility face.

Signature element:

- Result cards use one narrow toasted-sesame vertical “recipe margin” rule. This is the only overt rustic flourish.
- Remove the repeating ruled-paper background, rotated badge treatment, heavy notebook styling, and blocky monospace captions.

The exact working reference is `design-mock.html`. Production code must not import it or depend on it.

## Current-code diagnosis

The current implementation is functional and its complete test suite passes: `38` tests, `0` failures when run with `node --test`. Passing tests are not sufficient because several tests encode behavior the user has rejected.

The working tree already contains user and prior-session changes. The executor must preserve unrelated edits and inspect the diff before each milestone.

### `src/constants.js`

- `SALT_TYPES` and `DEFAULT_SALT_TYPE` support the rejected salt-type dropdown and must be deleted.
- `SOURCE_RATIOS` contains the approved percentages, but also includes deferred catalogue entries.
- `MEAT_CATALOG` currently models optional `variants` and optional `doneness`. That permits incomplete selections and causes result movement. Replace this with non-empty `details` and non-empty `doneness` arrays for every active cut.
- Lamb is currently modelled as `Boneless lamb` and `Bone-in lamb` cuts. Replace these with Chops, Leg, Rack, and Shoulder, with bone state represented as Detail.
- Beef currently exposes ten cuts and Pork five. Reduce the active catalogue to the approved compact matrix above; remove or explicitly quarantine orphaned active records so they cannot appear in navigation.
- `typeRecord()` currently derives preparation records and optional variant/doneness maps. Refactor it so every cut exposes one dry-brine record, optional dry-brine overrides by Detail, and temperature guidance by Doneness.
- Keep existing reviewed source URLs and review metadata. Do not rewrite historical review dates merely because records move.

### `src/calculator.js`

- `parseWeight()`, `calculateDryBrine()`, and `formatGrams()` remain relevant.
- `calculateSpoonMeasures()` exists only for the rejected tsp/tbsp feature and must be deleted.
- Preserve one-decimal gram formatting and pure calculation behavior.

### `src/navigation.js`

- Imports of `SALT_TYPES`, `DEFAULT_SALT_TYPE`, and `calculateSpoonMeasures()` must be removed.
- `parseRoute()` currently supports route kinds `home`, `meat`, `cut`, `variant`, `doneness`, and `preparation`, including `/dry-brine` and `/internal-temperature` suffixes. The redesigned page does not navigate to preparation screens.
- `getRouteChoices()`, `parentRoute()`, `getPreparationViewModel()`, `getContentForRoute()`, and `isKnownPreparationSlug()` belong to the retired multi-screen flow and must be removed unless a remaining test proves a separate need.
- `getBreadcrumbs()` is legacy and must be deleted with its tests and CSS.
- `getSinglePageViewModel()` currently accepts `saltTypeSlug`, returns `saltType` and `spoonResult`, and treats missing variant/doneness as incomplete. Replace it with a resolved-selection model that always supplies valid defaults for known partial routes.
- `routeToHash()` should produce canonical selection hashes only; it must not include preparation segments.

### `src/app.js`

- Imports of salt types and state field `saltTypeSlug` must be removed.
- `renderWeightInput()` currently creates a separate full-width input card and salt-type `<select>`. Move the weight field into the Prepare result card and remove the select and its help copy.
- `renderSaltCard()` currently renders tsp/tbsp output and a salt-type explanation. Delete both.
- `renderSelectionControls()` conditionally omits Detail and Doneness. It must render Meat, Cut, Detail, and Doneness in a stable order every time.
- Labels `Choose a meat`, `Choose a cut`, `Choose the detail`, and `Choose the finish` become the compact labels `Meat`, `Cut`, `Detail`, and `Doneness`.
- `getPageSelection()` defaults only Meat and Cut. It must delegate to a pure resolver that also defaults Detail and Doneness.
- `renderRoute()` currently adds a large eyebrow, H1, lede, selection block, separate input card, and a selection-summary H2. Replace this with the compact masthead, controls, and two result cards.
- `renderHeader()` must include the visible tagline `Measure twice. Season once.` and no top-right breadcrumbs.
- The salt-type change listener and focus-restoration branch must be deleted.
- Keep one delegated weight listener and one `hashchange` listener. Weight edits should update stable output nodes or restore focus and caret without keyboard flicker.

### `styles/main.css`

- Existing palette is close but not exact; it also uses blue/green theme inheritance in the inline mock and a repeating ruled-paper background in production.
- Remove `.breadcrumbs`, `.back-link`, salt-select styles, `.volume-estimate`, retired preparation-screen styles, and any other selectors left without markup.
- Remove the oversized hero scale, `Courier New` utility face, rotated mark, heavy notebook shadows, and large vertical gaps.
- Implement the approved fixed palette and cookbook typography.
- Keep visible keyboard focus, reduced-motion support, 320 px support, and no page-level horizontal overflow.

### Existing tests that encode rejected behavior

Replace or delete these expectations:

- `calculateSpoonMeasures converts grams using the selected salt density`.
- `calculateSpoonMeasures rejects invalid salt densities`.
- `single-page dry-brine model exposes salt density and timing guidance` insofar as it tests salt type and spoon output; retain timing coverage separately.
- `route choices expose the reviewed meats and expanded beef cuts` because the active catalogue is now compact.
- `single-page selections wait for required detail before showing results` because defaults must make every known selection complete.
- `breadcrumbs provide direct Change links for each prior decision`.
- Preparation-route and Back-parent expectations that exist only for the retired multi-screen flow.

Keep and adapt tests for calculation purity, malformed input, reviewed ratios, reviewed temperatures, source metadata, route idempotency, invalid routes, and stale-result prevention.

## State model

### Permitted application states

1. `resolved`: known Meat, Cut, Detail, and Doneness; results are visible.
2. `resolved-valid-weight`: resolved selection plus a valid weight; calculated grams are visible.
3. `resolved-invalid-format`: resolved selection plus malformed weight; inline error is visible and no stale grams remain.
4. `resolved-out-of-range`: resolved selection plus a weight outside `0.1–1,000,000 g`; inline error is visible and no stale grams remain.
5. `review-pending`: resolved selection whose culinary percentage or temperature is not reviewed; the relevant result card remains in place and says `Awaiting content review`.
6. `not-found`: the hash contains an unknown Meat, Cut, Detail, or Doneness; show a compact recovery action.

There is no incomplete known-selection state. Known partial hashes are resolved to the first permitted downstream choices.

### Default state

`Chicken → Whole chicken → Whole → Cook through`, weight `100`.

Expected first render:

- Dry-brine percentage: `1.1%`.
- Calculated salt: `1.1 g`.
- Internal temperature: reviewed whole-chicken guidance.

### Transition table

There are no database changes in any transition.

| Starting state | User action | Database change | Resulting state | UI result |
|---|---|---|---|---|
| Any resolved state | Select a Meat | None | First Cut, first Detail, and first Doneness for that Meat | All four groups remain visible; both result cards update immediately; weight is preserved. |
| Any resolved state | Select a Cut | None | Same Meat plus first Detail and first Doneness for that Cut | Detail and Doneness buttons are replaced in place; results update immediately. |
| Any resolved state | Select a Detail | None | Same Meat/Cut/Doneness plus selected Detail | Salt ratio and calculated grams update; temperature remains appropriate to selected Doneness. |
| Any resolved state | Select a Doneness | None | Same Meat/Cut/Detail plus selected Doneness | Temperature guidance updates; salt calculation remains unchanged unless data explicitly says otherwise. |
| Any resolved state | Enter a valid weight | None | `resolved-valid-weight` | Salt grams update on input; no submit action. |
| Valid weight | Replace with malformed text | None | `resolved-invalid-format` | Old grams disappear; specific inline correction message appears. |
| Invalid weight | Correct to a valid value | None | `resolved-valid-weight` | Error clears and grams return immediately. |
| Any resolved state | Clear weight | None | Resolved selection with empty weight | Percentage stays visible; calculated grams show a neutral prompt, never stale output. |
| Any state | Browser Back/Forward | None | Selection represented by history entry | One render; weight remains current for the session; focus is not trapped. |
| Direct known partial hash | Load or refresh | None | Resolved first downstream choices | Page renders useful results immediately; URL is canonically replaced without adding history. |
| Legacy preparation hash | Load or refresh | None | Equivalent canonical single-page selection | Old `/dry-brine` or `/internal-temperature` suffix is removed with `replaceState`; one render. |
| Unknown hash | Load or navigate | None | `not-found` | Compact recovery message and `Use defaults` action. |
| Any selection | Double-click or rapid repeated activation | None | Same intended selection | No duplicate listeners, duplicate history entries, or cumulative calculation. |

### Undo, retry, stale-page, and failed-request behavior

- Undo selection: use browser Back. Undo weight editing: edit or clear the field.
- Retry: no network request exists. Correcting input is the only retry flow.
- Double-click: native hash links target a desired state, not a toggle; repeated activation is idempotent.
- Stale page: known old preparation hashes redirect once to canonical selection hashes. Unknown values do not silently coerce to another meat.
- Failed request: not applicable because calculations and catalogue reads are local. Source links are ordinary outbound links and do not affect app state.
- Refresh: resets weight to `100` because persistence is deferred, while preserving the canonical selection encoded in the hash.

## Data and database invariants

No database, API, local storage, session storage, cookie, or service worker is part of this scope. Transaction boundaries, row repair, historical event rewriting, and database rollback are not applicable.

Equivalent in-memory invariants:

1. Every active Meat has at least one Cut.
2. Every active Cut has at least one Detail and at least one Doneness.
3. The first Cut, Detail, and Doneness are always valid defaults.
4. Every resolved selection belongs to the active catalogue; no cross-meat object may survive a Meat change.
5. A reviewed dry-brine percentage is a finite, non-negative number with one canonical definition.
6. Calculated salt is always `weight × percentage / 100`, with no volume-density conversion.
7. Invalid or empty weight never leaves stale calculated grams visible.
8. Doneness changes cannot alter dry-brine output unless the content record explicitly defines a different percentage.
9. Rendering the same selection and weight repeatedly produces identical visible values.
10. Existing source URLs and review dates are preserved when content records are reorganized.
11. No migration is needed. If obsolete salt-type or spoon state is discovered in code, remove it rather than persisting or translating it.

## Backend contracts

No backend route, request body, database operation, or server response is permitted.

- Validation occurs in `parseWeight()`.
- Selection validation occurs in pure navigation/catalogue functions.
- Calculations run locally through `calculateDryBrine()`.
- Do not add fetch calls, fake endpoints, analytics, or persistence.
- Legacy hash routes are client-side redirects, not server redirects.

## Frontend interaction contract

### Clickable surfaces

- Brand: resets to the default selection at `#/`.
- Every Meat, Cut, Detail, and Doneness choice: native `<a>` or `<button>` with a visible label and pressed/current state.
- Food weight: native text input with `inputmode="decimal"` and default value `100`.
- Source links: ordinary links opening in a new tab with accessible warning text.
- Not-found recovery: native link/button labelled `Use defaults`.

### Inert surfaces

- Brand mark, tagline, card titles, badges, percentages, temperatures, timing, safety text, and decorative sesame rules are not clickable.
- No hidden choice row, breadcrumb, chevron, dropdown, copy button, or share button is introduced.

### Drag and drop

No element is draggable and no drop target exists. Drag start, target highlighting, occupied targets, drop, cancellation, drag failure, and drag scroll restoration are outside this product. Native page scrolling and text selection remain enabled.

### Listener and rendering behavior

- Register global listeners once at application start.
- Do not attach accumulating listeners after `innerHTML` replacement.
- Use desired-state URLs rather than toggles.
- Selection changes may re-render the page once.
- Weight input should update stable result/error nodes without replacing the focused input. If implementation retains full rerendering, caret position and mobile keyboard continuity are mandatory.
- Preserve the raw weight across selection changes in memory.
- Do not force the page to the top on every selection. Keep the current viewport stable unless the user follows a not-found recovery link.

## Responsive and accessibility contract

- One compact masthead; no oversized hero.
- Meat choices form one equal-height row when space allows and a balanced wrapped grid on small screens.
- Cut buttons use a compact wrapping grid; Detail and Doneness use wrapping button rows.
- Desktop: Prepare and Finish cards are two columns.
- Mobile: result cards stack in one column.
- At `390 × 844`, the first result card must begin within one viewport or no more than one short swipe from the top for the longest active choice set.
- At `320 × 568`, all controls remain operable with no page-level horizontal overflow; a short vertical scroll is acceptable.
- Minimum interactive target: `42 px`, with `44 px` preferred where it does not materially increase scrolling.
- Selected controls use both fill and `aria-pressed="true"` or `aria-current`, not colour alone.
- Focus indicators have at least 3:1 contrast against adjacent colours.
- Text and controls meet WCAG AA contrast.
- The ratio, weight, salt grams, and temperature use tabular numerals where supported.
- No essential information is hover-only.
- Respect `prefers-reduced-motion`.

## Scenario matrix

### Product scenarios

| Scenario | Given | When | Then |
|---|---|---|---|
| First use | The app opens at `#/` | No action is taken | Chicken, Whole chicken, Whole, and Cook through are selected; `100 g`, `1.1%`, `1.1 g`, and temperature guidance are visible. |
| Repeated use | A user has changed selections several times | The same selection is chosen again | Route, controls, and results are identical; no duplicate event occurs. |
| Meat defaulting | Beef is not selected | Beef is selected | Steak, Bone-in, and Medium-rare become selected immediately and results appear. |
| Cut defaulting | Lamb is selected | Shoulder is selected | Bone-in and Tender become selected immediately; result-card positions do not move. |
| Singleton Detail | Pork Tenderloin is selected | The page renders | Detail remains visible with one selected Boneless button. |
| Singleton Doneness | Chicken Breast is selected | The page renders | Doneness remains visible with one selected Cook through button. |
| Valid weight | Whole chicken and `100` are selected | Weight becomes `1500` | Salt changes from `1.1 g` to `16.5 g`; `1.1%` stays visible. |
| Invalid then retry | A valid result is visible | Weight becomes `12kg`, then `750.5` | Stale grams disappear with the error; correction shows the new grams without reload. |
| Double-click | A Meat or Cut control is available | It is rapidly activated twice | Only the intended desired state is represented; listeners and history do not duplicate. |
| Browser history | Five selection changes have been made | Back and Forward are used | Each historical selection is restored once without viewport jump. |
| Legacy deep link | An old `/dry-brine` hash is opened | The page loads | It is replaced by the equivalent canonical selection hash and renders one page. |
| Unknown deep link | A hash contains an unknown cut | The page loads | Not-found recovery appears; no unrelated default is silently substituted. |
| Pending content | A selected cut lacks a reviewed value | The page renders | Selection remains complete; the relevant result card says `Awaiting content review` without collapsing. |
| Mobile boundary | The app is `320 px` wide | Every meat is selected in turn | No horizontal page scrolling or clipped controls occurs. |

### Sol Planner template scenarios that do not belong to this product

The named planning skill contains calendar/plant scenarios. They are explicitly closed as follows so an executor does not invent those subsystems:

| Required template scenario | Given / When / Then disposition |
|---|---|
| Same-date events | Given this app has no event or date state, when multiple interactions occur on one date, then date is irrelevant and no event record is created. |
| Dragging a plant to an occupied date | Given there are no plants, dates, or draggable surfaces, when a drag gesture is attempted, then only native scrolling/text selection may occur and app state is unchanged. |
| Dragging a group to an occupied date | Given there are no plant groups or occupied targets, when a group drag is attempted, then no drag state or target highlighting exists. |
| Watering today, in the past, and in the future | Given there is no watering or date model, when the user uses the calculator on any date, then calculations depend only on current selection and weight. |
| Undoing, moving, and recording again | Given there are no records, when the user goes Back, chooses another selection, and re-enters a weight, then only current in-memory UI state changes. |
| Forecast coverage ending before the next recurrence | Given there is no forecast or recurrence, when the app is used beyond any date horizon, then behavior is unchanged. |
| Existing malformed or duplicated occurrence state | Given there is no persistent occurrence data, when the app loads, then only the hash is validated; unknown hashes produce not-found. |
| Month boundaries and the six-month horizon | Given no date calculations exist, when a month boundary passes, then no behavior changes. |

## Automated test contract

### `tests/calculator.test.js`

Keep or adapt:

- `parseWeight returns empty for blank input`.
- `parseWeight accepts integer grams`.
- `parseWeight accepts one dot or comma decimal separator`.
- `parseWeight rejects malformed and out-of-range input`.
- `calculateDryBrine returns 1.1 grams for 100 grams at 1.1 percent`.
- `calculateDryBrine returns 16.5 grams for 1500 grams at 1.1 percent`.
- `calculateDryBrine is idempotent across repeated calls`.
- `calculateDryBrine rejects invalid programmer preconditions`.
- `formatGrams emits one decimal place`.

Delete all `calculateSpoonMeasures` tests. Add a static import-level check that the removed export is not referenced anywhere in `src/` or tests, or enforce this through diff review and syntax checks if a source-scan test would be brittle.

### `tests/navigation.test.js`

Add or replace with:

- `catalogue exposes exactly the approved five meats in order`.
- `catalogue exposes the approved compact cuts in order`.
- `lamb uses proper cuts and bone state only as detail`.
- `every active cut has at least one detail and one doneness`.
- `default selection is chicken whole whole cook-through`.
- `selecting each meat resolves its first cut detail and doneness`.
- `selecting each cut resolves its first detail and doneness`.
- `known partial hashes resolve to valid canonical selections`.
- `canonical selection hashes round-trip idempotently`.
- `legacy preparation hashes map to canonical single-page selections`.
- `unknown meat cut detail and doneness hashes remain not-found`.
- `single-choice detail and doneness groups remain present`.
- `weight defaults to 100 and remains valid on first render`.
- `selection changes preserve raw weight`.
- `dry-brine percentage is visible before and after weight edits`.
- `invalid weight removes stale calculated grams`.
- `doneness changes temperature without changing salt calculation`.
- `unreviewed content returns a stable pending result model`.
- `view model contains no saltType or spoonResult fields`.
- `breadcrumb and preparation-screen APIs are no longer exported`.

Do not treat a green `38/38` legacy suite as completion. Rejected tests must be removed and the new behavior must be tested.

## Manual browser script

Run this without manually reloading except at the explicit refresh step. The skill’s required five drags are replaced by five consecutive selection changes because this product intentionally has no drag surface.

1. Open `#/` at a desktop width around `900 px`.
2. Confirm the exact tagline `Measure twice. Season once.` and no breadcrumb, Back link, salt-type dropdown, tsp, or tbsp copy.
3. Confirm Chicken → Whole chicken → Whole → Cook through is selected and the weight is `100`.
4. Confirm `1.1%` is visually dominant in toasted sesame and `1.1 g` is visible.
5. Make at least five consecutive selection changes without reload: Beef → Ribeye → Boneless → Medium → Lamb → Shoulder → Boneless.
6. After every change, confirm all four control groups remain present, a valid default is selected, card positions do not collapse, and the viewport does not jump unexpectedly.
7. Confirm Lamb presents Chops, Leg, Rack, and Shoulder as cuts—not Boneless lamb/Bone-in lamb.
8. Run several weight cycles without reload: `100 → 1500 → 12kg → 750.5 → 0 → 100`.
9. Confirm valid grams, invalid-format error, correction, out-of-range error, and final recovery. No stale value may remain behind an error.
10. Rapidly activate the same Cut twice and confirm one selected state and no duplicate reaction.
11. Use Back five times and Forward five times. Confirm one state change per history entry, retained in-session weight, and no viewport jump.
12. Open a legacy preparation hash and confirm one canonical replacement with useful results.
13. Refresh once. Confirm the selection remains represented by the canonical hash and weight returns to `100`.
14. Open an unknown hash and confirm the compact recovery action.
15. Resize to `390 × 844`. Confirm equal meat-button dimensions, no horizontal overflow, visible tagline, readable selected controls, and results within one viewport or one short swipe.
16. Resize to `320 × 568`. Confirm no clipping or page-level horizontal scrolling and all controls remain operable.
17. Check keyboard-only navigation, visible focus, and screen-reader names for every control group.
18. Check browser console: no errors.
19. Database assertion: not applicable by design. Confirm the implementation contains no database, fetch, local-storage, session-storage, cookie, or service-worker writes.

## Milestones

### Milestone 1 — Catalogue and resolved-selection model

#### Scope boundary

Included:

- Replace optional variants/doneness with non-empty Detail and Doneness records.
- Install the approved compact catalogue and proper lamb cuts.
- Add pure default-selection, partial-route resolution, and canonical-hash helpers.
- Replace navigation tests that expect incomplete selections or the expanded catalogue.

Deferred:

- Salt-type and spoon removal, DOM rendering, layout copy, CSS, browser styling checks, and handover updates.
- Keep the existing salt-volume APIs temporarily so the current application remains runnable until Milestone 2 removes the entire feature atomically.

Maximum change: three files—`src/constants.js`, `src/navigation.js`, and `tests/navigation.test.js`.

Dependencies that must already be stable:

- Approved catalogue table.
- Existing reviewed salt percentages, temperatures, source URLs, and review dates.
- Current application imports must continue resolving at the end of the milestone.

#### Current-code replacement

- Replace optional/incomplete selection semantics with a resolver that always returns valid downstream defaults for known states.
- Retire expanded Beef/Pork choices from the active catalogue.
- Keep legacy preparation and salt-volume APIs only as temporary compatibility code; do not extend them or add new tests for them.

#### Gate

Stop and report evidence after:

1. Focused navigation/catalogue tests pass.
2. Complete test suite passes.
3. `node --check` passes for every JavaScript file.
4. Importing `src/app.js` in the browser produces no missing-export error.
5. Diff review confirms no new culinary values were invented and source metadata is preserved.
6. A basic browser smoke check confirms the existing page still loads; redesigned interaction is explicitly deferred.

### Milestone 2 — Remove salt-volume behavior atomically

#### Scope boundary

Included:

- Delete `SALT_TYPES`, `DEFAULT_SALT_TYPE`, and `calculateSpoonMeasures()`.
- Remove `saltTypeSlug`, salt-type view-model fields, the dropdown, tsp/tbsp output, its help copy, focus branch, and change listener.
- Replace calculator and navigation tests that encode salt density or spoon output.
- Keep timing guidance and authoritative grams output.

Deferred:

- Compact control structure, default-weight placement, route cleanup, final visual styling, and documentation updates.

Maximum change: six files—`src/constants.js`, `src/calculator.js`, `src/navigation.js`, `src/app.js`, `tests/calculator.test.js`, and `tests/navigation.test.js`.

Dependencies that must already be stable:

- Milestone 1 catalogue and resolved-selection model.
- Grams remain the only authoritative salt output.

#### Gate

Stop and report evidence after:

1. Focused calculator and view-model tests pass.
2. Complete suite passes.
3. JavaScript syntax and import checks pass.
4. Repository search finds no runtime reference to salt type, teaspoon, tablespoon, salt density, or spoon output.
5. Browser smoke check confirms calculation in grams still works and the rejected dropdown/output are absent.
6. Diff review confirms timing and source metadata remain intact.

### Milestone 3 — Stable compact single-page interaction

#### Scope boundary

Included:

- Render Meat, Cut, Detail, and Doneness on every known state.
- Default all downstream choices immediately.
- Set raw weight to `100` on initialization and move the field into Prepare.
- Show Prepare and Finish results immediately.
- Remove breadcrumbs, preparation screens, Back controls, hero copy, and selection-summary heading.
- Implement canonical hash replacement for partial and legacy routes.
- Preserve weight and viewport across selection changes.

Deferred:

- Final palette, typography, cookbook styling, micro-spacing polish, and documentation updates.

Maximum change: three files—`src/app.js`, `src/navigation.js`, and `tests/navigation.test.js`.

Dependencies that must already be stable:

- Milestone 1 resolver APIs.
- Milestone 2 gram-only view model.

#### Gate

Stop and report evidence after:

1. Focused interaction-model tests pass.
2. Complete test suite passes.
3. JavaScript syntax checks pass.
4. Diff review confirms all retired route UI and listeners are removed.
5. Browser verification covers defaults, five selection changes, weight validation/recovery, Back/Forward, refresh, legacy redirect, and no console errors.
6. Styling does not begin until this behavioral gate passes.

### Milestone 4 — Light cookbook visual system and compression

#### Scope boundary

Included:

- Apply the exact fixed palette, typography, sesame result-card spine, compact masthead, and approved tagline.
- Use consistent button dimensions and stable wrapping grids.
- Remove clinical/notebook visual remnants and dead selectors.
- Tune desktop, `390 × 844`, and `320 × 568` layouts.
- Preserve accessibility and reduced-motion behavior.

Deferred:

- New illustrations, photography, custom web fonts, dark mode, overt cultural motifs, animation, favourites, copy/share, search, imperial units, and new culinary categories.

Maximum change: three files—`styles/main.css`, `src/app.js`, and `index.html` only if metadata cleanup is required.

Dependencies that must already be stable:

- Milestone 3 behavior and markup roles.
- `design-mock.html` as a visual reference only.

#### Gate

Stop and report evidence after:

1. Focused and complete tests pass unchanged.
2. JavaScript syntax checks pass.
3. CSS and markup diff review finds no dead breadcrumb, select, spoon, or preparation-screen styles.
4. Desktop and both mobile viewport checks pass.
5. Screenshot comparison confirms no blue text/accent inheritance, no dark background, and no excessive rustic decoration.
6. Keyboard focus and contrast checks pass.

### Milestone 5 — Final hardening and documentation reconciliation

#### Scope boundary

Included:

- Execute the complete manual browser script.
- Fix only defects discovered by that script.
- Update `handover.md` to remove superseded salt-type/spoon/breadcrumb claims and record the final approved behavior and aesthetic.
- Decide whether `design-mock.html` remains as a clearly labelled design reference or is removed after production matches it.

Deferred:

- All new product features and catalogue expansion.

Maximum change: affected defect files plus `handover.md`; no speculative refactor.

Dependencies that must already be stable:

- Milestones 1–4 have passed their gates.

#### Gate

Stop and report final evidence after:

1. Focused tests for any defect pass.
2. Complete suite passes.
3. Syntax checks pass.
4. Final diff review preserves unrelated working-tree changes.
5. Full browser script passes with no console errors or viewport jumps.
6. Documentation matches the shipped behavior and contains no rejected salt-volume or multi-screen guidance.

## Ambiguities and recommended defaults

1. **Unreviewed slow-cook temperatures.** Recommended default: keep `Awaiting content review` for any ribs, lamb shoulder, or similar endpoint not already supported by reviewed source data. A Doneness button may exist without inventing a temperature.
2. **Seafood Detail wording.** Recommended default: use Shucked, Peeled, and Fillet as the single visible details. If the weight basis later covers shell-on or whole fish, add those only with reviewed percentages.
3. **Preparation route compatibility duration.** Recommended default: keep client-side legacy hash redirects for this release, remove them only after confirming no saved links depend on them.
4. **Weight persistence after refresh.** Recommended default: reset to `100`; retain only in memory during the current page session. Do not add storage without a separate decision.
5. **Pending-content visibility.** Recommended default: keep the full card height and show an explicit pending message so layout does not move.
6. **Extra former catalogue entries.** Recommended default: defer them outside the active catalogue. Do not expose Sirloin, T-bone / Porterhouse, Strip steak, Filet / Tenderloin, Ground 90/10, Roast, or Pork belly until compactness and content are separately reconsidered.

## Continuation milestone 6 — Reviewed lamb doneness temperatures

### Planning decision

This is the only approved continuation milestone. It resolves the pending temperature cards for lamb Chops, Leg, and Rack where the active Doneness choices map directly to reviewed chef targets.

The reviewed evidence is:

- ThermoWorks' chef-recommended table groups beef, veal, and lamb roasts, steaks, and chops at `130–135°F / 54–57°C` for Medium-rare and `135–145°F / 57–63°C` for Medium. It also distinguishes carryover guidance for individual chops and larger roasts: <https://blog.thermoworks.com/chef-recommended-tw-approved/>
- USDA FSIS gives lamb chops and roasts a safe minimum of `145°F / 63°C` followed by at least 3 minutes of rest: <https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat-catfish/lamb-farm-table>

The chef target and the USDA safety baseline must remain visibly distinct. Do not imply that the lower chef target is the USDA minimum.

### Required skills

None. This milestone is a bounded catalogue-content and test change; no specialist UI, document, or deployment workflow is required.

### Scope boundary

Included:

- Add lamb-specific reviewed Medium-rare and Medium temperature guidance.
- Apply both choices to active Lamb Chops, Leg, and Rack.
- Preserve the existing source URL, safety-source URL, and a review date of `2026-07-23`.
- Add focused data/view-model tests for all three cuts and both doneness choices.
- Confirm the rendered Finish card shows reviewed guidance for representative Lamb routes.

Deferred:

- Beef ribs, Pork ribs, and Lamb shoulder remain `needs-review`. Their active `Tender` endpoint is method- and cut-dependent; recipe-specific smoking or braising targets are not approved as universal constants.
- No catalogue, route, layout, styling, dry-brine ratio, timing, or copy redesign.
- No database, storage, API, deployment, or new dependency.

Maximum product change: two files — `src/constants.js` and `tests/navigation.test.js`. Mandatory coordination updates to `HANDOFF.md` and `SESSION_UPDATE.md` do not count toward this maximum.

### Exact implementation contract

1. Add dedicated lamb Medium-rare and Medium records to `CHEF_TEMPERATURES`. Do not alias or silently reuse the beef records even though the reviewed numeric ranges match.
2. Use these exact peak targets:
   - Medium-rare: `130–135°F / 54–57°C`
   - Medium: `135–145°F / 57–63°C`
3. Guidance must explain carryover without pretending every lamb cut has the same pull offset: approximately `5°F / 2°C` early for chops and `10–12°F / 5–6°C` early for larger roasts, followed by resting to the target.
4. Safety copy must state: `USDA whole-cut baseline: 145°F / 63°C with at least 3 minutes of rest.`
5. Allow reviewed temperature records to supply their own `reviewedOn`; retain `2026-07-20` as the fallback for all existing records and set only the new lamb records to `2026-07-23`.
6. Wire both lamb records through `temperaturesByDoneness` for Chops, Leg, and Rack in the active `MEAT_CATALOG` only.
7. Do not populate the legacy catalogue or any `Tender` cut.

### State transition table

| Selection | Before | After |
|---|---|---|
| Lamb Chops / Medium-rare or Medium | `needs-review`, no target | `reviewed`, selected lamb target |
| Lamb Leg / Medium-rare or Medium | `needs-review`, no target | `reviewed`, selected lamb target |
| Lamb Rack / Medium-rare or Medium | `needs-review`, no target | `reviewed`, selected lamb target |
| Beef ribs / Tender | `needs-review`, no target | unchanged |
| Pork ribs / Tender | `needs-review`, no target | unchanged |
| Lamb shoulder / Tender | `needs-review`, no target | unchanged |

### Focused test cases

1. Resolve canonical routes for Chops, Leg, and Rack at each of Medium-rare and Medium.
2. Assert the target changes from `130–135°F / 54–57°C` to `135–145°F / 57–63°C` with doneness.
3. Assert each reviewed lamb result includes the USDA `145°F` / 3-minute safety baseline, the chef source, the USDA safety source, and `reviewedOn: 2026-07-23`.
4. Assert Beef ribs, Pork ribs, and Lamb shoulder remain stable pending records with a null target.
5. Preserve every existing test.

### Gate

Stop and report evidence after:

1. The new focused lamb and pending-content tests pass.
2. The complete `node --test` suite passes.
3. `node --check` passes for every JavaScript file under `src` and `tests`.
4. Diff review confirms only approved lamb guidance was added and all dry-brine values, existing reviewed temperatures, routes, and presentation remain unchanged.
5. Browser verification confirms representative Lamb Chops, Leg, and Rack selections show the correct reviewed Finish card, both Doneness buttons update it, Lamb shoulder remains pending, and the console has no errors.
6. `HANDOFF.md` and `SESSION_UPDATE.md` record the result and remaining pending cuts.

## Current Luna execution prompt

Implement only Continuation milestone 6 from `IMPLEMENTATION_PLAN.md`. Add dedicated, source-backed lamb Medium-rare and Medium guidance and wire it only to active Lamb Chops, Leg, and Rack. Preserve distinct chef-target and USDA-safety language, source metadata, and a `2026-07-23` review date. Keep Beef ribs, Pork ribs, and Lamb shoulder pending; do not generalize recipe-specific tender temperatures. Add the specified focused tests, run the full gate including browser checks, update `HANDOFF.md` and `SESSION_UPDATE.md`, then stop.

## Category expansion milestone 7: Pasta & Noodles, Chinese noodles, and dumpling wrappers

Status: implemented locally on `agent/launch-milestone`; verify and publish with the existing draft pull request.

The product is no longer meat-only. Keep Meat as the default top-level category, then allow each category to define its own stable button choices and result cards. The first added category is Pasta & Noodles, with Fresh egg pasta, Chinese hand-cut noodles, and Dumpling wrappers.

### Product decisions

- Keep the existing warm, light cookbook interface and compact single-page flow.
- Keep the category switcher above the module-specific controls.
- Use flour weight as the input for dough modules and keep the default at `100 g` so the percentage is easy to understand.
- Show the calculated liquid or egg amount immediately; do not add pasta cooking-water salt.
- Keep the explanatory copy short and practical. Explain hydration as liquid weight relative to flour weight.
- Keep Bread and Pickles as future categories until their inputs, ratios, and evidence model are defined.

### Content and source policy

- Do not cite or depend on Saltyourmeat.com. Current meat percentages are candidate values and need an independent audit plus home testing before they are described as reviewed.
- Use culinary references, recipe conversions, community experience, and Amos's own tests for taste-oriented ratios, with transparent status and source links.
- Reserve official sources for safety-sensitive topics such as food safety, fermentation, canning, or curing ingredients.
- Current dough reference points are: Pasta Evangelists for fresh egg pasta, Omnivore's Cookbook for Chinese fresh noodles, and Red House Spice for dumpling wrappers.

### Implementation contract

1. Add a reusable category catalogue without breaking existing meat routes or defaults.
2. Add pure dough hydration calculation and validation tests.
3. Route `#/pasta`, `#/pasta/fresh-egg`, `#/pasta/chinese-hand-cut`, and `#/pasta/dumpling-wrappers` to canonical stable selections.
4. Render each style with its own ratio, flour input, calculated liquid or egg output, rest guidance, finishing guidance, and source link.
5. Preserve Meat's Chef target first and Food-safety baseline second presentation.
6. Update Guides, project brief, handover, executor handoff, and session notes.
7. Verify desktop and 390 px mobile layouts, no horizontal overflow, default values, all three dough outputs, and no console errors.

### Gate

Stop only after the complete test suite, JavaScript checks, diff checks, browser smoke checks, documentation update, and existing draft PR update all pass. Leave the local calculator open on the Pasta & Noodles module for handoff testing.

## Historical first-milestone execution prompt (completed)

Implement only Milestone 1 from `IMPLEMENTATION_PLAN.md`. Replace the optional variant/doneness catalogue with the approved compact Meat → Cut → Detail → Doneness matrix, including proper lamb cuts and non-empty defaults for every cut. Add pure selection-defaulting, partial-route resolution, and canonical-hash behavior with focused navigation tests. Preserve all reviewed percentages, temperatures, source URLs, review dates, and the temporary salt-volume compatibility APIs required by the current app; do not invent missing culinary values. Do not redesign the DOM or CSS and do not begin salt-volume removal. Run focused tests, the complete suite, JavaScript syntax/import checks, a basic browser smoke check, and a careful diff review, then stop and report evidence before Milestone 2.
## MVP refinement milestone 8: independent taxonomy, two timing bands, and dough salt

Status: implemented locally; browser and final static checks remain as the handoff gate.

### Approved decisions

- Replace the inherited visible taxonomy while retaining Ground meat inside its parent meat.
- Keep the existing meat salt percentages as candidate values pending independent audit and home testing.
- Show dry-brine Minimum and Best timing together without a timing selector.
- Keep flour at 100% for dough formulas and show liquid or egg and salt as separate percentages and gram outputs.
- Keep Bread, Marinades, and Sauces visible as non-interactive Coming soon categories.
- Do not add marinade or sauce formula content to the MVP.

### Implemented changes

1. Removed the unused legacy meat catalogue from runtime data.
2. Renamed the visible meat choices to Whole bird, Ground meat, Prawns, and Fish fillet where appropriate.
3. Added timing objects with `minimum` and `best` values to dry-brine content.
4. Extended dough calculation to return flour, liquid, salt, hydration, and salt percentage.
5. Added salt starting points to fresh egg pasta, Chinese hand-cut noodles, and dumpling wrappers.
6. Added Coming soon category treatments for Bread, Marinades, and Sauces.
7. Updated the brief, handoff, handover, session notes, and Guides copy.

### Gate

The full unit suite must pass, every changed JavaScript file must pass `node --check`, `git diff --check` must pass, and the browser must verify the default meat route, category buttons, Minimum/Best timing, dough salt output, Coming soon treatment, and 320 px / 390 px layouts without console errors or horizontal overflow.

## Sauce section redesign milestone 9

Status: implemented locally; sauce content remains candidate material pending independent review and home testing.

### Approved decisions

- Make Sauces active and organise the section by task first: Stir-fry, Glaze, Dipping, then Dressing. Keep named classics in a separate compact route.
- Teach flavour roles and reusable ratios instead of long recipes or cooking instructions.
- Include Balanced, Umami, Bright, Nutty, Sweet Glaze, and Spicy profiles, with Teriyaki, Sesame (Goma), Peanut, and Sweet & Sour as the only named cards.
- Keep the universal Salty + Umami + Sweet + Acid formula and a permanent adjustment guide visible in the sauce flow.

### Implemented changes

1. Added source-backed sauce catalogue data with review metadata, role substitutions, uses, and canonical profile/classic routes.
2. Added task-first selection controls and one-screen balance/use cards that reuse the existing Kitchen Constants visual language.
3. Added mobile wrapping rules and navigation tests for defaulting, canonicalisation, profile choices, and candidate metadata.

### Gate

Run the complete test suite, JavaScript syntax checks, diff checks, and browser smoke checks at desktop, 390 px, and 320 px before handoff. Do not deploy or mark candidate sauce ratios as reviewed in this milestone.

## Sauce visual polish milestone 10

Status: implemented locally; sauce content remains candidate material pending independent review and home testing.

### Approved decisions

- Keep Sauce Builder as a distinct foundational entry point directly under the Sauces category selector and before task choices.
- Keep the task-first order unchanged: Stir-fry, Glaze, Dipping, Dressing, then named classics.
- Keep the universal formula in Sauce Builder only; profile and classic cards show their own ratios without repeating the general formula.
- Treat each ratio separator and value as one visual unit, and use `rough parts` to avoid implying false precision.

### Implemented changes

1. Added the canonical `#/sauces/builder` route and compact builder card with ingredient roles and substitutions.
2. Removed the repeated universal formula from individual sauce cards and added a small Builder link on detail routes.
3. Grouped ratio markup and added long-ratio layout rules for Sesame (Goma) and other four- or five-part balances.
4. Simplified the concentrated-sauce adjustment guidance and tightened the narrowest header layout.

### Gate

Run the complete test suite, JavaScript syntax checks, diff checks, and browser smoke checks at desktop, 390 px, and 320 px. Confirm the Builder formula appears once on its route, never on detail cards, and no ratio separator becomes stranded when a card wraps.

## Sauce simplification milestone 11

Status: implemented locally on 2026-07-25. This milestone supersedes the Sauce Builder decisions in milestone 10; no deployment was performed.

### Approved decisions

- Remove Sauce Builder completely from the selectable product experience.
- Open Sauces directly to Stir-fry / Balanced, following the existing first-valid-downstream-choice rule.
- Keep the approved task order, flavour profiles, named classics, candidate ratios, sources, and review metadata unchanged.
- Follow the existing Kitchen Constants rhythm: category controls, module controls, then two compact result cards.
- Show the selected sauce parts and practical uses; do not show a universal formula, glossary, or standalone troubleshooting panel.

### Implementation contract

1. Delete the Builder data export, Builder card/link rendering, Builder-specific view model, and Builder CSS.
2. Restore `#/sauces` canonicalization to `#/sauces/stir-fry/balanced`.
3. Canonicalize the temporary `#/sauces/builder` path once to the same default profile so existing local links do not break.
4. Retain task and flavour controls plus the existing Balance and Use cards.
5. Use the label `parts` with the helper `Use the same spoon or cup for every part.`
6. Remove visible colon punctuation from ratio layout and use subtle dividers that remain clean when wrapped.
7. Remove the full-width adjustment guide from profile and classic routes.
8. Preserve the separate 320 px header-spacing fix and all unrelated Meat/Pasta behavior.
9. Update focused navigation tests and reconcile all project documentation after implementation.

### Non-goals

- Do not change any sauce ratio, ingredient example, use, substitution, source URL, status, or review date.
- Do not add recipes, quantities in fixed units, cooking instructions, persistence, analytics, or network requests.
- Do not redesign Meat, Pasta, the global category control, support note, or footer.
- Do not commit, open a pull request, publish, or deploy without explicit approval.

### Gate

Run focused sauce tests, the full `node --test` suite, `node --check` for all changed JavaScript, and `git diff --check`. Review the complete diff. In the real browser verify desktop, `390 x 844`, and `320 x 568`: Sauces defaults directly to Stir-fry / Balanced, only two result cards render, Sesame wraps without punctuation artifacts, the task/profile controls remain canonical, there is no horizontal overflow, and the console is clean.

### Tomorrow execution prompt

Implement only Sauce simplification milestone 11 from `IMPLEMENTATION_PLAN.md`. Remove Sauce Builder, its route state, links, data, styles, and the standalone adjustment guide. Restore Sauces to the canonical Stir-fry / Balanced default while redirecting the temporary Builder hash once to that default. Preserve every candidate culinary value, source, review field, task/profile/classic choice, and the 320 px header fix. Keep the existing two-card Balance / Use presentation, label ratios as parts with one same-measure helper, replace visible colon separators with wrap-safe dividers, update tests and project documents, run the full required gate, and stop without committing or deploying.

## Sauce guidance and Vinaigrette milestone 12

Status: implemented locally on 2026-07-25; no deployment performed.

### Approved decisions

- Keep Marinades separate from Sauces and place active Sauces before the deferred categories.
- Add a static Sauce Builder guide before the dough guides; do not restore an interactive Builder route.
- Keep the guide short and practical: balance roles, taste-based adjustment, pure salt as a separate pinch, and a concise water/oil/aromatics mixing note.
- Broaden ingredient-role examples to include Western and global ingredients. Worcestershire belongs under Umami.
- Show optional heat as `+ Heat`, including the Heat choices in spicy profiles.
- Add Vinaigrette after the existing named classics with a `3 Fat : 1 Acid` starting balance.
- Keep culinary references and review metadata internal; render no source links or citations to users.

### Implementation contract

1. Reorder `CATEGORY_CATALOG` to Meat, Pasta & Noodles, Sauces, Bread, Marinades.
2. Add Vinaigrette at the end of `SAUCE_CATALOG.classics` so Teriyaki remains the default classic.
3. Preserve the flexible ratio markup; remove narrow-screen dividers and use spacing so wrapped values stay readable and paired.
4. Update Guide 05 and renumber Dough Hydration and Dough Salt to 06 and 07.
5. Preserve all existing sauce sources internally and record the new Vinaigrette as owner-tested with reference material.
6. Update focused tests and reconcile project handoff documents.

### Gate

Run focused sauce and Guides tests, the complete `node --test` suite, `node --check` for every changed JavaScript file, and `git diff --check`. Verify the default sauce route, Spicy, Sesame (Goma), Vinaigrette, Guides, and the category order at desktop, `390 x 844`, and `320 x 568`. Confirm no horizontal overflow, readable ratio groups, visible `+ Heat`, no rendered culinary citations, and no console errors. Do not commit, publish, or deploy.

## Pre-live URL and sauce review milestone 13

Status: implemented locally on 2026-07-25; Cloudflare work remains manual and no deployment was performed.

### Approved decisions

- Use Cloudflare's clean public URLs: `/`, `/guides`, and `/about`.
- Treat the user's self-testing confirmation as sufficient owner testing for the existing sauce ratios.
- Keep meat ratios as candidate values without adding a review checklist or making them a launch blocker.
- Keep Cloudflare certificate, DNS, redirect, push, merge, and deployment actions outside the agent's scope unless separately authorized.

### Implementation contract

1. Update Guides and About canonical and Open Graph URLs to their clean paths.
2. Update `sitemap.xml` to the same clean paths; keep physical `.html` links for local file/static-preview compatibility.
3. Change sauce review metadata to `reviewed`, `2026-07-25`, and `owner-tested-with-reference`; preserve all ratios and hidden source URLs.
4. Update metadata and sauce tests for clean URLs and owner-tested sauce records.
5. Reconcile current handoff and session notes without changing historical execution records.

### Gate

Run focused metadata and sauce tests, the complete `node --test` suite, `node --check` for all JavaScript files, `git diff --check`, local-reference and asset smoke checks, and browser verification at desktop, `390 x 844`, and `320 x 568`. Confirm clean local routes, no overflow, no console errors, reviewed sauce metadata, unchanged meat candidate values, and no deployment activity.

## Seafood and bread expansion milestone 14

Status: implemented locally on 2026-07-25; seafood and bread values remain candidate starting points and no deployment was performed.

### Approved decisions

- Keep Meat as the default category and expand only the existing Fish & shellfish selection plus the deferred Bread category.
- Use lighter seafood dry-brine starting points than meat: 0.5% for delicate fish and 0.75% for fattier fish, with short refrigerated timing.
- Use baker's percentage for Bread: flour is 100%, water expresses hydration, salt stays near 2%, and yeast or starter is a separate adjustable leaven percentage.
- Keep the module compact and practical: selected style, ratio display, flour input, calculated grams, rest guidance, and finishing guidance. Do not add recipes, bake schedules, or fixed-volume conversions.
- Keep seafood and bread values candidate until Amos home-tests representative entries. Keep food-safety temperature guidance separate from taste and texture ratios.

### Implemented changes

1. Added Salmon, White fish, Tuna, and Trout under Fish & shellfish with candidate ratios and internal source metadata.
2. Activated Bread with Everyday loaf, Ciabatta-style, and Sourdough fougasse baker's-percentage styles.
3. Generalized dough routing and calculation to support Bread and optional leaven gram outputs without changing Pasta & Noodles defaults.
4. Added bread guidance to Guides and reconciled the project brief, handoff, handover, and session notes.

### Gate

Run focused seafood, bread, and calculator tests, then `node --test`; run `node --check` for every changed JavaScript file and `git diff --check`. Verify the default Bread route, all bread styles, Salmon and White fish seafood routes, Guides, and the existing Meat/Pasta/Sauce defaults at desktop, `390 x 844`, and `320 x 568`. Confirm no horizontal overflow, readable three-part ratios, correct optional leaven grams, no console errors, and no rendered culinary citations.

## Current approved correction — milestones 15–17

Status: milestones 15–17 implemented locally on 2026-07-25; no further implementation milestone is approved. These milestones supersede milestone 14's seafood catalogue and provisional Ciabatta-style / Sourdough fougasse bread set. They also supersede the older rule that singleton Detail and Doneness rows must always be visible.

### Product outcome

Kitchen Constants should make sense to a first-time home cook as a compact reference for scalable starting points, not as a recipe collection. The next release should:

1. Remove seafood from the active product instead of trying to make a weak seafood section look complete.
2. Keep Bread focused on three recognisable, broadly useful styles: Everyday loaf, Olive-oil focaccia, and Chinese steamed buns.
3. Pair each bread ratio with a Celsius-first internal temperature and a practical sensory cue.
4. Explain the product's purpose immediately, qualify sauce ratios for unequal ingredient strength, and organise Guides by topic.
5. Hide control rows that offer no choice while preserving complete route state.
6. Keep Marinades separate and deferred. Do not add marinade ratios, cards, or a guide.
7. Correct the slight desktop-only collision between ratio numbers and their subtitles without redesigning the acceptable mobile layouts.

### Shared technical invariants

- Meat remains the default category, followed by Pasta & Noodles, Sauces, Bread, and Marinades.
- Marinades remains a disabled Coming soon category.
- Every meat cut keeps non-empty ordered `details` and `doneness` arrays; the first item remains the default even when its row is not rendered.
- Canonical hashes remain idempotent. Hiding a singleton control does not shorten or alter its canonical hash.
- Weight remains in memory only, defaults to `100 g`, and is preserved while changing selections.
- Grams and Celsius remain primary. No volume conversion, persistence, account, analytics, backend, fetch, or deployment work is authorised.
- Reviewed sauce ratios, meat ratios, temperature values, source URLs, review dates, and review statuses remain unchanged except for reordering an existing Fahrenheit/Celsius pair for presentation.
- New bread ratios and temperatures remain `candidate` content until source reconciliation and representative home testing are recorded.
- Public pages render no culinary citations. Source URLs and review metadata remain internal.
- The compact single-page interaction, cookbook palette, typography, toasted-sesame card rule, keyboard focus, and reduced-motion behavior remain intact.

## Milestone 15 — Remove seafood and install the approved bread set

### Required skills

- **Frontend Design:** required because catalogue changes, a five-part ratio, and the revised Finish card alter visible UI. The registered skill is not available in the current skill catalogue; use the checked-in `Frontend-design/SKILL.md` as the documented fallback.
- **Browser control:** required for the desktop, `390 × 844`, and `320 × 568` acceptance checks.

### Scope boundary

Included:

- Remove Fish & shellfish from `MEAT_CATALOG` and remove seafood-only ratios, timing, temperature helpers, metadata, and tests that become unreachable.
- Make every former `#/seafood/*` hash resolve to the existing `not-found` state with the `Use defaults` recovery action. Do not silently redirect seafood URLs to Meat or Bread.
- Keep Everyday loaf and replace Ciabatta-style and Sourdough fougasse with Olive-oil focaccia and Chinese steamed buns.
- Extend the dough calculation model to calculate optional oil and sugar grams without changing Pasta & Noodles output.
- Replace the generic bread Finish copy with structured method, Celsius-first internal temperature, sensory cue, and after-cooking guidance.
- Preserve candidate status and internal provenance for every new bread value.

Deferred:

- First-use positioning, singleton-control hiding, sauce-strength copy, Guides restructuring, metadata/title changes, and global Celsius-first meat temperature presentation belong to milestone 16.
- Desktop ratio spacing belongs to milestone 17.
- Marinades remain entirely deferred.
- No publishing, deployment, commit, pull request, or external Cloudflare change.

Expected product files:

- `src/constants.js`
- `src/calculator.js`
- `src/navigation.js`
- `src/app.js`
- `tests/calculator.test.js`
- `tests/navigation.test.js`

Mandatory coordination files after the gate:

- `HANDOFF.md`
- `SESSION_UPDATE.md`

### Current-code diagnosis

- `MEAT_CATALOG` currently contains a fifth entry with slug `seafood`, seven types, seafood-only source ratios, `CHEF_TEMPERATURES.seafood`, `TIMING.seafood`, and `SEAFOOD_DRY_BRINE_METADATA`.
- `parseRoute()` treats an unknown first segment as not-found, so deleting the seafood catalogue record naturally gives the approved legacy behavior without adding a redirect branch.
- `BREAD_CATALOG` currently contains Everyday loaf, Ciabatta-style, and Sourdough fougasse.
- `calculateDoughRatio()` and `renderDoughCalculation()` understand only liquid, salt, and optional leaven. Focaccia needs calculated oil; steamed buns need calculated sugar and oil.
- `renderDoughFinishCard()` currently renders only `rest` and a single `finish` sentence under the fixed heading “Rest, then shape.” It cannot express method, temperature, cue, and after-cooking guidance distinctly.

### Exact content contract

Keep these values as approved candidate starting points:

| Style | Ordered flour-relative parts | Finish temperature | Method and sensory cue |
|---|---|---|---|
| Everyday loaf | Water `66%`; Salt `2%`; Instant yeast `1.2%` | `90°C / 194°F` | Bake; crust browned and crumb set; cool before slicing. |
| Olive-oil focaccia | Water `75%`; Salt `2%`; Instant yeast `1%`; Olive oil `5%` | `96°C / 205°F` | Bake; deep colour with a crisp underside; pan and finishing oil are outside the dough ratio; rest briefly before cutting. |
| Chinese steamed buns | Water `55%`; Salt `0.5%`; Instant yeast `1%`; Sugar `3%`; Oil `2%` | `88°C / 190°F` | Steam; temperature is secondary to a set, springy crumb with no wet dough; stand briefly before serving. |

Do not add ingredient quantities beyond the calculated flour-relative grams. Do not add mixing sequences, kneading schedules, proof times, pan sizes, bake times, steaming times, fillings, toppings, or recipe steps.

### Data and calculation contract

- Preserve `calculateDoughRatio(flourGrams, percentages)` and its existing `flour`, `liquid`, `salt`, and optional `leaven` outputs for compatibility.
- Add optional ordered `extras` input records with stable `slug`, `label`, and finite non-negative `percentage`.
- Return calculated extras in the same order; do not use display labels as object keys.
- Define bread ratio parts and calculated output parts from one ordered source of truth so the card cannot display a percentage that is omitted from gram calculations.
- Keep Pasta & Noodles styles free of extras and byte-for-byte equivalent in visible calculation behavior.
- Store structured bread finish fields for method, target temperature, sensory cue, and after-cooking guidance. Do not reuse the meat `safety` field because bread temperatures are doneness cues, not food-safety baselines.
- Record source URL(s), methodology, review status, and review date for each candidate style. If the evidence cannot support an approved number, stop with that style pending rather than inventing provenance.

### State-transition table

| Starting state | Action or URL | Resulting state | Visible result |
|---|---|---|---|
| Any resolved meat selection | Reload after seafood removal | Same resolved meat selection | No change to meat ratio or temperature. |
| `#/seafood`, `#/seafood/salmon`, or any former seafood hash | Load or navigate | `not-found` | Existing recovery card and `Use defaults`; no silent replacement. |
| `#/bread` | Load or navigate | Everyday loaf | Canonical `#/bread/everyday-loaf`; three calculated parts and structured Finish card. |
| Old `#/bread/ciabatta-style` | Load or navigate | `not-found` | Existing recovery card; no guessed migration. |
| Old `#/bread/sourdough-fougasse` | Load or navigate | `not-found` | Existing recovery card; no guessed migration. |
| `#/bread/olive-oil-focaccia` | Load or navigate | Olive-oil focaccia | Four ordered percentages and four calculated gram outputs. |
| `#/bread/chinese-steamed-buns` | Load or navigate | Chinese steamed buns | Five ordered percentages and five calculated gram outputs. |
| Any Bread style with valid flour weight | Change style | Selected style, same raw flour weight | All calculated parts and Finish guidance update once. |
| Any Bread style with malformed or empty weight | Correct input | Valid dough result | No stale previous-style grams remain. |

### Persistence and rollback invariants

- No database or browser storage is involved.
- Refresh resets flour weight to `100 g`; the canonical Bread hash remains.
- Browser Back/Forward moves between valid Bread selections or not-found legacy paths without duplicate history entries.
- Rollback is deletion of the new style records and extras support; no data migration or repair is required.

### Backend and integration contract

- No backend route, request, response, database operation, network request, or new dependency is permitted.
- Existing Cloudflare clean page routes remain untouched.
- Hash-route parsing is the only integration boundary affected.

### Frontend interaction and design contract

- Tokens: retain the existing flour paper, recipe paper, soft ink, pandan, toasted sesame, warm stone, and brick-spice variables.
- Typography: retain Georgia for display/data emphasis and Aptos/Segoe UI/Arial for body and controls.
- Layout: retain category → Style → two result cards. The Make card shows ordered ratio parts and all calculated grams; the Finish card shows Proof/rest, Method, Internal temperature, Look and feel, and After cooking in that order.
- Signature: retain the single toasted-sesame recipe-margin rule on result cards.
- Interactions: style links remain native canonical hash links; flour input updates locally without submit.
- States: valid, empty, invalid-format, out-of-range, not-found, and candidate-content metadata remain explicit.
- Rejected patterns: no recipe timeline, tabs, accordion, ingredient checklist, carousel, illustrations, new badges, safety framing for bread temperature, or fixed cooking time.
- Accessibility: the visual ratio's accessible name must enumerate every ordered part; calculated outputs must remain in one atomic live region; method and cue labels must be real text.

### Automated scenarios

1. The active meat catalogue contains exactly Chicken, Beef, Pork, and Lamb in order.
2. No runtime export or test references seafood-only ratios, metadata, timing, or temperature records.
3. All former seafood hashes parse as not-found.
4. Bread defaults to Everyday loaf and exposes exactly Everyday loaf, Olive-oil focaccia, and Chinese steamed buns in order.
5. At `500 g` flour, each style produces the exact water, salt, yeast, oil, and sugar grams implied by its percentages.
6. Extras preserve order and reject invalid percentages.
7. Pasta calculation snapshots remain unchanged and expose no extra output rows.
8. Bread ratio accessible labels include every visible part.
9. Each Bread Finish model has method, Celsius-first temperature, sensory cue, and after-cooking guidance.
10. All three bread records remain candidate and carry internal source/review metadata.
11. Invalid and empty flour input never leaves stale calculated parts.
12. Route parsing and hash generation remain idempotent for every retained category.

### Manual verification

- Desktop: open all three Bread styles, use `100`, `500`, blank, and `12kg`, then use Back/Forward. Confirm exact outputs, no stale values, and no recipe-like clutter.
- `390 × 844` and `320 × 568`: repeat all three styles and confirm every ratio/output remains readable with no horizontal overflow.
- Open at least three old seafood hashes and both removed bread hashes; confirm the existing not-found recovery and clean console.
- Recheck representative Meat, Pasta, and Sauce routes for unchanged values and controls.

### Gate

Stop after milestone 15 and report evidence. The gate requires:

1. Focused calculator/navigation tests pass.
2. Full `node --test` passes.
3. `node --check` passes for every JavaScript file under `src` and `tests`.
4. `git diff --check` passes and the complete diff is reviewed.
5. Browser checks pass at desktop, `390 × 844`, and `320 × 568` with no console errors or horizontal overflow.
6. Diff review confirms no meat, pasta, or sauce culinary value changed; no source metadata was fabricated; no marinade work began.
7. `HANDOFF.md` and `SESSION_UPDATE.md` record the result and any bread content still pending review.

## Milestone 16 — Clarify the product, controls, sauce caveat, Guides, and metadata

### Required skills

- **Frontend Design:** required for the first-use sentence, conditional control rows, Guides information architecture, and card copy hierarchy. Use the checked-in `Frontend-design/SKILL.md` fallback because the skill is not registered in the current catalogue.
- **Browser control:** required for interaction, accessibility, metadata-page, and responsive verification.

### Scope boundary

Included:

- Add one explanatory sentence under “What are you making?”
- Hide Detail or Doneness when its array contains only one valid item; render either row normally when it offers two or more.
- Make every displayed meat temperature Celsius-first without changing either numeric value.
- Add the approved sauce strength qualification and concentrated-ingredient labels.
- Add a compact Guides jump menu and reorganise the existing eight cards into Foundations, Meat, Sauces, and Dough & bread.
- Add the approved “not a recipe book” sentence to About.
- Update homepage title and matching social title metadata.

Deferred:

- Ratio spacing is milestone 17.
- Marinades remain Coming soon with no guide.
- No new culinary ratios, new sauce profiles, new bread styles, or deployment.

Expected product files:

- `src/app.js`
- `src/constants.js`
- `styles/main.css` only for the jump menu and conditional-layout cleanup
- `index.html`
- `guides.html`
- `about.html`
- `tests/navigation.test.js`
- `tests/metadata.test.js`

Mandatory coordination files after the gate:

- `HANDOFF.md`
- `SESSION_UPDATE.md`

### Current-code diagnosis

- `renderCategoryControls()` passes only a heading and choices to `renderChoiceGroup()`, so the purpose sentence needs an explicit optional description slot rather than a decorative pseudo-element.
- `renderSelectionControls()` always renders the Detail/Doneness pair even when one or both arrays have a single item.
- Reviewed temperature strings in `CHEF_TEMPERATURES` are Fahrenheit-first.
- `renderSauceBalanceCard()` currently says only “Use the same spoon or cup for every part,” and `renderSauceRoleChoices()` says ingredient roles can overlap but not that ingredient strengths differ.
- Guides are one ungrouped list of eight cards and have no jump menu.
- About explains the origin but does not explicitly say the product is not a recipe book.
- Homepage `<title>` and `twitter:title` still say “Brining, Temperatures, Pasta & Sauces.”

### Exact copy and information architecture

- Under “What are you making?” add: `Rough ratios and temperatures that scale to what you’re cooking.`
- About add: `Kitchen Constants is not a recipe book. It offers scalable starting points, then leaves the final adjustment to you.`
- Sauce ratio helper: `Parts show balance, not equal strength. Start with half a part when using concentrated ingredients, then taste.`
- Sauce closing note: `One ingredient can fill more than one role, and strengths vary. Start with the balance, then adjust gradually.`
- Mark these role examples as concentrated in visible copy wherever they appear: fish sauce, miso, gochujang, mirin, and Worcestershire.
- Preserve the same-measure instruction, but place it after the strength qualification: `Use the same spoon or cup for every part.`
- Public homepage title: `Kitchen Constants | Cooking Ratios & Temperatures`.
- Make `og:title` and `twitter:title` use the same public title. Preserve canonical URLs and descriptions unless a seafood reference remains.

Guides order and grouping:

| Group | Existing cards in order |
|---|---|
| Foundations | How we choose the numbers; Why salt percentages work |
| Meat | What is dry brining?; Why temperature beats the clock |
| Sauces | Build a sauce |
| Dough & bread | How dough hydration works; Why dough has its own salt ratio; How bread ratios stay useful |

The jump menu links to the four group headings. Preserve the eight existing cards and their substantive guidance; renumber them to match the new order. Do not add a Marinades group or guide.

### State-transition table

| Selection or page | Before | After |
|---|---|---|
| Chicken / Whole bird | Detail and Doneness singleton rows visible | Both rows hidden; canonical hash still includes `whole/cook-through`. |
| Chicken / Breast | Detail has two choices, Doneness one | Detail visible; Doneness hidden. |
| Beef / Steak | Detail and Doneness each have two | Both visible and interactive. |
| Lamb / Rack | Detail one, Doneness two | Detail hidden; Doneness visible. |
| Any selection changed via Back/Forward | All rows rebuilt | Only meaningful rows render; selected state and focus remain correct. |
| Sauce profile/classic | Equal-measure helper only | Strength qualification, same-measure helper, and concentrated labels visible. |
| Guides load or jump link | Ungrouped scroll | Four-topic jump menu moves to labelled group headings without changing URL routes. |
| Any reviewed meat Finish card | Fahrenheit first | Same values, Celsius first. |

### Persistence and data invariants

- Hiding controls is presentation only; do not mutate, empty, or reorder `details` or `doneness`.
- `resolveSelection()`, `routeToHash()`, and `canonicalSelectionHash()` must continue to include default singleton slugs.
- Weight and history behavior remain unchanged.
- Temperature reordering changes strings only; sources, statuses, dates, guidance, and safety copy remain attached to the same records.
- Sauce ratios and ingredient membership remain unchanged. “Concentrated” is a presentation annotation, not a multiplier or automatic calculation.

### Backend and integration contract

- No backend, storage, analytics, or network integration.
- No sitemap route changes.
- Preserve local `.html` navigation and clean production canonicals.

### Frontend interaction and design contract

- Tokens and typography: unchanged.
- Layout: category heading, one muted explanatory sentence, choices, meaningful secondary controls, then two result cards. Hidden singleton rows consume no empty grid space.
- Guides: one compact, text-first jump menu above grouped cards; group headings encode real hierarchy and do not become decorative numbered tiles.
- Signature: toasted-sesame card rule remains the only rustic flourish.
- Interaction: native choice links and jump links; selected choices retain `aria-current`; hidden choices remain represented by the route and screen title context.
- States: all combinations of zero, one, or two visible secondary rows must remain stable. Zero visible rows must not leave an empty `.selection-pair`.
- Rejected patterns: no tooltip-only explanation, modal onboarding, tutorial carousel, sticky table of contents, recipe cards, marinade teaser content, or automatic sauce scaling.
- Accessibility: group descriptions are associated with headings; jump links have clear names; heading hierarchy remains sequential; keyboard focus is not sent to a hidden control.

### Automated scenarios

1. Category helper text is present once in the rendered app source/DOM.
2. Singleton Detail and Doneness groups are omitted while multi-choice groups remain.
3. Canonical hashes for hidden singleton values are unchanged and round-trip idempotently.
4. Selection changes and Back/Forward preserve focus on the activating visible choice.
5. All reviewed temperature targets render Celsius first and retain exactly the same Celsius/Fahrenheit numbers.
6. Sauce ratios, sources, review dates, and statuses are unchanged.
7. Sauce copy includes the unequal-strength warning and the concentrated ingredient annotations.
8. Guides expose four group targets and the exact eight-card order above.
9. Guides contain no Marinades section or link.
10. Homepage `<title>`, `og:title`, and `twitter:title` match the approved title.
11. Public metadata and visible copy contain no seafood claims.
12. About contains the approved non-recipe-book sentence.

### Manual verification

- Check Chicken Whole bird, Chicken Breast, Beef Steak, and Lamb Rack to exercise zero, one, and two visible Detail/Doneness rows.
- Use keyboard navigation and Back/Forward across those states; confirm no focus loss, empty gap, duplicate history, or changed canonical hash.
- Check representative poultry, beef, pork, and lamb Finish cards for Celsius-first display and unchanged values.
- Check Balanced, Spicy, Sesame (Goma), Vinaigrette, and one Worcestershire-containing profile for readable strength guidance.
- On Guides, use every jump link and verify heading order and return navigation.
- Verify homepage, Guides, and About at desktop, `390 × 844`, and `320 × 568`; confirm no console errors or horizontal overflow.

### Gate

Stop after milestone 16 and report evidence. The gate requires:

1. Focused navigation and metadata tests pass.
2. Full `node --test` passes.
3. `node --check` passes for every changed JavaScript file.
4. `git diff --check` passes and the complete diff is reviewed.
5. Browser and keyboard checks pass for all conditional-control states, representative temperatures and sauces, Guides jumps, and all three page types.
6. Diff review confirms no ratio, temperature number, source, review status/date, or marinade behavior changed.
7. `HANDOFF.md` and `SESSION_UPDATE.md` record the result.

## Milestone 17 — Desktop ratio-label spacing and final whole-site hardening

### Required skills

- **Frontend Design:** required because the fix changes visible typographic rhythm. Use the checked-in `Frontend-design/SKILL.md` fallback because the skill is not registered in the current catalogue.
- **Browser control:** required for computed-style inspection, screenshots, and responsive regression checks.

### Scope boundary

Included:

- Fix the slight number/subtitle overlap visible in desktop web mode for dough and sauce ratio groups.
- Preserve the currently acceptable mobile treatment.
- Run the final outsider/home-cook walkthrough across the full site and fix only regressions introduced by milestones 15–17.
- Reconcile final handoff/session documentation.

Deferred:

- Any new feature, content category, visual redesign, recipe detail, marinade implementation, persistence, publishing, or deployment.

Expected product file:

- `styles/main.css`

Conditional files only if browser evidence proves markup or a regression test must change:

- `src/app.js`
- `tests/metadata.test.js`
- `tests/navigation.test.js`

Mandatory coordination files:

- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `handover.md` only after all product gates pass

### Current-code diagnosis

- Dough ratios use nested inline flex/grid with `.ratio-value { line-height: 1 }`, `.ratio-ingredient { line-height: 1.1 }`, and a small local gap. The subtitle row has no shared reserved height across adjacent parts.
- Sauce ratios use auto-flow columns; each `.sauce-ratio-part` owns its own number and label rows. Labels have a minimum height, but the number row does not, so desktop font scaling can visually compress the boundary.
- Mobile overrides reduce ratio size and remove sauce dividers; the user reports mobile is already acceptable.

### CSS correction contract

- At desktop widths, give dough ratio parts a shared reserved number row and subtitle row with an explicit row gap.
- Do the same for sauce ratio parts, using a number row tall enough for the largest desktop clamp value and a subtitle row that supports two lines.
- Keep each number bound to its own subtitle as one unbreakable semantic group.
- Do not solve the issue by shrinking all numbers, hiding labels, increasing card height excessively, or applying transforms/absolute positioning.
- Avoid selector-specificity escalation. Prefer one desktop rule set and retain existing narrow-screen overrides unless screenshots prove a regression.
- Preserve tabular numerals, sesame emphasis, current card heading alignment, long-ratio wrapping behavior, and visible dividers where already approved.

### State-transition table

| Viewport/content | Before | After |
|---|---|---|
| Desktop Everyday loaf | Number/subtitle boundary slightly crowded | Distinct shared rows; no glyph collision. |
| Desktop Chinese steamed buns | Five parts may crowd | Every number remains paired with its subtitle and fits within the card. |
| Desktop Balanced sauce | Number/subtitle boundary slightly crowded | Consistent vertical rhythm. |
| Desktop Sesame (Goma) / Spicy | Long ratio compresses unevenly | No overlap, stranded label, or clipped part. |
| `390 × 844` and `320 × 568` | Acceptable mobile layout | No material visual change or overflow regression. |

### Persistence, backend, and integration invariants

- This milestone changes no application state, route, data, calculation, persistence, backend, metadata, or network behavior.
- A CSS rollback must fully restore the prior layout without content repair.

### Frontend interaction and design contract

- Tokens, typography families, card structure, and sesame signature remain unchanged.
- Numbers remain visually dominant, but subtitles must read as clearly separate labels.
- Hover, focus, selected, invalid, pending, and Coming soon states remain unchanged.
- Rejected patterns: no smaller global type scale, tooltip labels, scrolling ratio strips, horizontal card overflow, absolute-positioned labels, or mobile redesign.

### Automated and manual scenarios

- Automated suite remains green; add a source-level regression assertion only if a stable semantic hook is introduced.
- At a desktop viewport around `1280 × 900`, inspect and screenshot:
  - Pasta / Fresh egg
  - Bread / Everyday loaf
  - Bread / Chinese steamed buns
  - Sauces / Stir-fry / Balanced
  - Sauces / Classics / Sesame (Goma)
  - Sauces / Dipping / Spicy
- Repeat the same ratio-heavy pages at `390 × 844` and `320 × 568`.
- Confirm no overlap by visual inspection and, where useful, compare element bounding boxes for each value/subtitle pair.
- Complete an outsider walkthrough from homepage to Meat, Pasta, Sauces, Bread, Guides, and About. Confirm the site explains itself without recipe-like density.
- Check keyboard focus, no horizontal overflow, no console errors, canonical routes, Back/Forward, invalid-weight recovery, and support links.

### Gate

Stop after milestone 17 and report final evidence. The gate requires:

1. Focused tests, then full `node --test`, pass.
2. `node --check` passes for every changed JavaScript file.
3. `git diff --check` passes and the complete diff is reviewed.
4. Desktop screenshots show no number/subtitle collision on every listed ratio-heavy page.
5. `390 × 844` and `320 × 568` remain visually stable with no overflow.
6. Whole-site browser walkthrough has no console errors and no unresolved first-time-home-cook contradiction.
7. `HANDOFF.md`, `SESSION_UPDATE.md`, and, if the complete release-sized change is finished, `handover.md` match the implemented state.
8. Stop without committing, publishing, or deploying unless separately authorised.

## Prior execution status

Milestones 15–17 are implemented and verified locally. Keep Marinades deferred, preserve candidate-content labels and internal source metadata, and do not commit, publish, or deploy without explicit authorization.

---

## Approved terminology and SEO plan - milestones 18-21

### Shared constraints

- Kitchen Constants remains a compact cooking reference, not a recipe book.
- Preserve all approved calculator ratios, temperatures, sources, review metadata, route behavior, calculations, and category order unless a milestone explicitly names a change.
- Vinaigrette is the only place where the visible ratio label changes from `Fat` to `Oil`. The generic ingredient role remains `fat`, and every other visible `Fat` label remains.
- Keep the Guides topic navigation in normal document flow. Do not add sticky, floating, fixed, or mobile bottom navigation.
- Keep grams and Celsius primary.
- Keep calculator selection hashes idempotent and canonical. Do not generate public pages, canonical tags, or sitemap entries for hash combinations.
- SEO reference pages must teach reusable principles from approved content. They must not become recipes, invent cooking values, expose internal source metadata, or use `Recipe` schema.
- Internal links may retain `.html` for reliable local static previews; public canonical, Open Graph, and sitemap URLs use clean production paths.
- Preserve unrelated working-tree changes. No milestone authorizes analytics, accounts, persistence, new network requests, a commit, or deployment unless stated.

### Planning baseline

- `node --test`: 62 tests pass on 2026-07-25.
- The homepage has complete title, description, canonical, Open Graph, and Twitter metadata, but its source body currently contains only the JavaScript app mount.
- Guides and About are static, crawlable pages with clean public canonicals.
- `robots.txt` allows crawling and points to `sitemap.xml`; the sitemap currently lists only `/`, `/guides`, and `/about`.
- No page currently contains JSON-LD.

## Milestone 18 - Vinaigrette terminology only

### Required skills

- **Browser control:** required for a real-page check of the changed card at desktop and mobile widths.
- No Frontend Design pass is required because this milestone changes one existing word without changing layout, hierarchy, or styling. Escalate to Frontend Design only if the longer label causes an evidenced visual regression.

### Scope boundary

Included:

- Change Vinaigrette's ratio display from `3 Fat : 1 Acid` to `3 Oil : 1 Acid`.
- Update the focused navigation assertion for that exact classic.
- Verify that all other sauce labels and the generic `fat` role are unchanged.

Deferred:

- Numeric ratio changes, ingredient changes, new sauce copy, new categories, global terminology cleanup, SEO work, or layout changes.

Maximum product files:

- `src/constants.js`
- `tests/navigation.test.js`

Mandatory coordination files after successful execution:

- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `IMPLEMENTATION_PLAN.md`

### Current-code diagnosis

- `src/constants.js` defines Vinaigrette as `ratioParts: [['3', 'Fat'], ['1', 'Acid']]`.
- The same file intentionally uses `Fat` for profiles that may include oil, paste, nut butter, or butter, and exposes the generic ingredient role under the `fat` key.
- `tests/navigation.test.js` has a dedicated Vinaigrette test that currently expects `Fat`.

### State-transition table

| State | Before | After |
|---|---|---|
| `#/sauces/classics/vinaigrette` balance | `3 Fat : 1 Acid` | `3 Oil : 1 Acid` |
| Any other sauce ratio | Existing labels | Unchanged |
| Generic sauce role | `fat` with broad examples | Unchanged |
| Route and selected classic | Canonical Vinaigrette state | Unchanged |

### Persistence, backend, and integration contract

- No persistence, backend, network, route, calculation, canonical, or metadata behavior changes.
- Rollback is the reversal of one data label and one test expectation.

### Frontend interaction and design contract

- Preserve the existing card, typography, divider, wrapping, and responsive behavior.
- `Oil` must remain bound to the value `3`.
- Do not rename ingredient groups, add explanatory copy, or alter the `Use` card.

### Scenario matrix

| Scenario | Expected result |
|---|---|
| Open Vinaigrette directly | Balance reads `3 Oil : 1 Acid`. |
| Switch from another classic to Vinaigrette | URL canonicalizes as before and the new label appears. |
| Open Dressing / Bright, Nutty, or Spicy | Existing `Fat` labels remain. |
| Inspect sauce ingredient roles | Generic `fat` role and examples remain intact. |

### Automated tests

- Update the dedicated Vinaigrette assertion.
- Retain and run the generic sauce-role and sauce-catalogue tests.
- Run focused navigation tests, then `node --test`.
- Run `node --check` for each changed JavaScript file.
- Run `git diff --check` and review the complete milestone diff.

### Manual verification

- Verify Vinaigrette at desktop, `390 x 844`, and `320 x 568`.
- Confirm no clipped label, separator regression, horizontal overflow, or console error.
- Spot-check one non-oil `Fat` profile to prove the rename did not spread.

### Gate

Stop after Milestone 18 and report:

1. Exact files changed.
2. Focused and full test results.
3. JavaScript syntax and diff-check results.
4. Desktop and mobile visual evidence.
5. Confirmation that no other `Fat` label, ratio value, or sauce role changed.

Do not begin Milestone 19 in the same execution turn unless the user explicitly asks to continue.

## Milestone 19 - Technical SEO foundation

### Required skills

- **Frontend Design:** required because the homepage gains a source-level semantic fallback that must match the approved compact visual language. Use `C:\Users\amosc.DESKTOP-0U08PS1\Documents\AI\Skills\Frontend-design\SKILL.md` if the skill is not registered.
- **Browser control:** required to inspect rendered metadata, JSON-LD, no-JavaScript fallback behavior, and responsive visual stability.

### Scope boundary

Included:

- Replace the empty homepage app mount in source with a concise semantic fallback containing one H1, the approved rough-ratios positioning, the active category names, and links to Guides and About.
- Keep client startup authoritative: once JavaScript runs, it replaces the fallback with the existing interactive app so no duplicate page content remains.
- Add valid `WebSite` JSON-LD to the homepage without a fake search action.
- Add valid `CollectionPage` JSON-LD to Guides.
- Add valid `AboutPage` JSON-LD with the already-public Amos Chiam `Person` entity to About.
- Add regression tests for meaningful homepage source content, parseable JSON-LD, expected schema types, clean URLs, and absence of `Recipe` schema.

Deferred:

- New reference pages, sitemap expansion, calculator-route prerendering, hash-route canonicals, analytics, Search Console changes, deployment, or content-value changes.

Expected product files:

- `index.html`
- `guides.html`
- `about.html`
- `tests/metadata.test.js`

Conditional product file:

- `styles/main.css` only if the source fallback cannot reuse existing approved styles without a visible flash or no-JavaScript layout defect.

Maximum product files: 5.

Mandatory coordination files after successful execution:

- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `IMPLEMENTATION_PLAN.md`

### Current-code diagnosis

- `index.html` has strong head metadata but its body is only `<div id="app"></div>` plus the module script.
- The JavaScript-rendered homepage already contains the product H1 and interactive content, but source-only agents receive no meaningful body copy.
- Guides and About provide static semantic content but no structured data.
- No existing page contains `application/ld+json`.

### State-transition table

| Agent/state | Before | After |
|---|---|---|
| Source-only homepage fetch | Empty app mount | Concise semantic product fallback and public links |
| Normal JavaScript browser | Interactive app | Same interactive app; fallback replaced once |
| Homepage structured data | None | One valid `WebSite` entity |
| Guides structured data | None | One valid `CollectionPage` entity |
| About structured data | None | Valid `AboutPage` with existing public `Person` identity |
| Calculator hashes | Existing canonical behavior | Unchanged and not added as indexable pages |

### Persistence, backend, and integration contract

- No persistence, backend, new request, route, calculation, or selection-state changes.
- JSON-LD must use absolute `https://kitchenconstants.com` URLs matching each page's canonical.
- Do not add `SearchAction`, ratings, reviews, publish dates, social profiles, or any field not supported by current public content.

### Frontend interaction and design contract

- With JavaScript enabled, the post-load page must be visually indistinguishable from the current app.
- With JavaScript disabled, the fallback should be readable, compact, keyboard accessible, and honest about the site's purpose.
- Reuse the current typography and color tokens if styling is needed. Do not add a hero, marketing banner, sticky control, loading animation, or duplicate navigation.
- The Guides topic buttons remain non-sticky at all widths.

### Scenario matrix

| Scenario | Expected result |
|---|---|
| View homepage source | H1, purpose copy, category names, and Guides/About links are present before JavaScript. |
| Load homepage normally | Only one visible H1 and one app experience remain after initialization. |
| Disable JavaScript | Fallback remains useful and navigable. |
| Parse each JSON-LD block | Valid JSON with the intended schema type and canonical URL. |
| Search schema source | No `Recipe`, unsupported claim, or fake site-search action. |

### Automated tests

- Extend `tests/metadata.test.js` to parse every JSON-LD block with `JSON.parse`.
- Assert the intended schema types and matching canonical URLs.
- Assert that homepage source is not an empty mount and contains the approved fallback elements.
- Assert no public page contains `"@type": "Recipe"`.
- Run the focused metadata tests, then `node --test`.
- Run `git diff --check` and review the complete milestone diff. Run `node --check` for any changed JavaScript.

### Manual verification

- Inspect source and rendered DOM separately.
- Test JavaScript-enabled and JavaScript-disabled homepage behavior.
- Verify desktop, `390 x 844`, and `320 x 568` with no duplicate content, layout shift that obscures controls, overflow, or console errors.
- Recheck Guides topic navigation to confirm it remains static while scrolling.
- Validate the JSON-LD with a structured-data validator when network access is available; treat local parsing as the required offline gate.

### Gate

Stop after Milestone 19 and report:

1. Source-only and rendered-homepage evidence.
2. Parsed schema types and URLs.
3. Focused/full test and diff-check results.
4. Responsive and no-JavaScript results.
5. Confirmation that routes, calculations, Guides scrolling behavior, and public cooking values did not change.

Do not begin Milestone 20 in the same execution turn unless the user explicitly asks to continue.

## Milestone 20 - Focused reference pages and discovery

### Required skills

- **Frontend Design:** required for a small reusable static-page pattern that belongs to the existing rustic cookbook system. Use `C:\Users\amosc.DESKTOP-0U08PS1\Documents\AI\Skills\Frontend-design\SKILL.md` if the skill is not registered.
- **Browser control:** required for link, responsive, metadata, accessibility, and visual checks across the new pages.

### Scope boundary

Included:

- Add four static pages with clean public canonicals:
  - `dry-brining.html` -> `/dry-brining`
  - `meat-temperatures.html` -> `/meat-temperatures`
  - `dough-ratios.html` -> `/dough-ratios`
  - `sauce-ratios.html` -> `/sauce-ratios`
- Give every page a unique title, meta description, canonical, Open Graph/Twitter metadata, one H1, concise principle-led copy, relevant Guide links, and a clear link into the corresponding calculator hash.
- Use `Article` JSON-LD only where the visible page supports it; never use `Recipe`.
- Add a compact discovery section to Guides linking to all four pages.
- Add the four clean canonical URLs to `sitemap.xml`.
- Extend metadata/navigation tests to cover the pages, links, sitemap, and structured data.

Deferred:

- Individual pages for cuts, doneness states, pasta styles, bread styles, sauce profiles, or named classics.
- New cooking values, new culinary claims, rendered source citations, long-form recipes, FAQ schema, search, analytics, or deployment.
- Any Marinades page or content.

Expected product files:

- `dry-brining.html`
- `meat-temperatures.html`
- `dough-ratios.html`
- `sauce-ratios.html`
- `guides.html`
- `sitemap.xml`
- `tests/metadata.test.js`

Conditional product file:

- `styles/main.css` only for a reusable page pattern that cannot be expressed with current static-page classes.

Maximum product files: 8.

Mandatory coordination files after successful execution:

- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `IMPLEMENTATION_PLAN.md`

### Current-code diagnosis

- Search engines can currently discover only the homepage, Guides, and About through the sitemap.
- Calculator states live behind hashes, so they are useful for people but not independent crawl targets.
- Guides already contains the approved foundational explanations, making it the content source of truth for the focused pages.
- Repeating the full calculator catalogue in static HTML would create drift risk and would push the product toward a recipe/reference dump.

### Content contracts

#### Dry-brining by weight

- Explain salt as a percentage of food weight, grams as the authoritative output, the difference between ratio and timing, and why cut/context still matter.
- Link to the default Meat calculator and the relevant Guides anchors.
- Reuse only approved concepts and public values; do not publish a new universal percentage.

#### Meat internal temperatures

- Explain Celsius-first temperature guidance, safety baseline versus chef target where already supported, carryover/resting context, and the importance of checking the thickest part.
- Link to the Meat calculator and relevant Guides anchors.
- Do not add a new temperature table or fill pending values.

#### Dough and bread ratios

- Explain flour at 100%, hydration/liquid, salt, leaven, optional extras, and finish cues.
- Link to Pasta & Noodles, Bread, and the relevant Guides anchors.
- Keep Everyday loaf, Olive-oil focaccia, and Chinese steamed buns as examples of formula types, not recipes.

#### Sauce ratios

- Explain parts as a balance, the same-measure rule, unequal ingredient strength, and tasting/adjustment.
- Link to the default Sauce calculator and sauce Guide anchor.
- Keep Vinaigrette's component labelled Oil while broader fat-based profiles remain Fat.

### State-transition table

| User action | Before | After |
|---|---|---|
| Search or open a topic URL | No dedicated clean page | Focused, indexable principle page |
| Follow page CTA | N/A | Relevant existing calculator hash opens and canonicalizes normally |
| Browse Guides | Topic jump menu only | Same static jump menu plus compact related-reference links |
| Read a topic page | N/A | Can return to Guides, About, or calculator without dead ends |
| Crawl sitemap | Three URLs | Seven clean canonical URLs |

### Persistence, backend, and integration contract

- Static pages make no requests and introduce no storage, account, analytics, or backend behavior.
- Calculator links must use existing supported hashes and may not require new route parsing.
- Canonical and Open Graph URLs use clean production paths; local navigation uses static-compatible `.html` links where needed.
- Sitemap entries must exactly match canonical URLs.

### Frontend interaction and design contract

- Reuse the Guides/About header, footer, typography, content width, focus treatment, and warm-paper visual system.
- Keep each page concise: one clear purpose, a small number of sections, and one primary calculator action.
- Do not add recipe cards, ingredient lists, step-by-step methods, sticky navigation, accordions, carousels, or oversized SEO text blocks.
- At `320 x 568`, headings, inline links, and CTA controls must wrap without horizontal overflow.

### Scenario matrix

| Scenario | Expected result |
|---|---|
| Open each `.html` page locally | Page renders fully without JavaScript. |
| Open each clean production URL after deployment | Canonical page resolves once without a redirect loop. |
| Follow each calculator CTA | Supported hash route opens the intended category/default state. |
| Follow Guides discovery links | Correct reference page opens; browser Back returns predictably. |
| Parse metadata/schema | Unique metadata, matching canonical, valid supported schema, no `Recipe`. |
| Crawl sitemap | All seven canonical URLs appear once; no `.html` topic URL appears. |

### Automated tests

- Add all four pages to the metadata test table.
- Assert unique titles and descriptions, matching canonical/OG URLs, one H1, required internal links, valid JSON-LD, and no `Recipe` schema.
- Assert Guides links to all four local static pages.
- Assert sitemap contains all seven clean canonical URLs exactly once and no `.html` public URL.
- Retain route-idempotence tests for every linked calculator hash.
- Run focused metadata and navigation tests, then `node --test`.
- Run `git diff --check`, review the complete diff, and run `node --check` for any changed JavaScript.

### Manual verification

- Review all four pages at desktop, `390 x 844`, and `320 x 568`.
- Check keyboard focus, heading order, link purpose, page titles, no overflow, and no console errors.
- Follow every cross-link and calculator CTA in a real browser.
- Read each page as a first-time home cook and remove any passage that reads like a recipe, repeats another page without purpose, or implies unsupported precision.

### Gate

Stop after Milestone 20 and report:

1. Page inventory with titles, canonicals, and calculator destinations.
2. Content review confirmation that no new cooking value or Recipe schema was added.
3. Focused/full test and diff-check results.
4. Desktop and mobile browser evidence for all four pages.
5. Sitemap and internal-link verification.

Do not publish or begin Milestone 21 without separate explicit authorization.

## Milestone 21 - Conditional publishing and live SEO verification

### Authorization gate

This milestone changes external state. Do not start it because Milestones 18-20 are complete. Require an explicit user instruction to publish or deploy the approved Kitchen Constants changes.

Search Console sitemap submission or other account mutations require explicit authorization and access to the correct property. Read-only inspection may proceed only within the user's requested scope.

### Required skills

- **GitHub publishing workflow:** required to inspect the canonical remote, preserve history, create an intentional launch branch/commit, push, and open or update a pull request.
- **Sites hosting or the repository's established Cloudflare Pages workflow:** use only the actual configured deployment path; do not create a second host.
- **Browser control:** required for live URL, redirect, rendered metadata, responsive, and console verification.

### Scope boundary

Included after authorization:

- Re-run all local release gates and review the complete accumulated diff.
- Inspect the canonical repository and active launch/PR state before publishing.
- Publish through a launch branch and pull request into `main`; never force-push.
- Verify the seven clean public URLs, canonicals, structured data, sitemap, robots, HSTS, `www` redirect, static assets, calculator links, and responsive rendering.
- Run a public PageSpeed/Lighthouse check and record performance, accessibility, best-practices, and SEO results.
- If the user authorizes Search Console work and the correct property is available, inspect indexing/sitemap status and submit only the canonical sitemap if needed.
- Record live evidence and any unresolved external blocker in the coordination documents.

Deferred:

- SEO copy rewrites based on zero-day data, analytics installation, paid tools, backlink work, speculative keyword expansion, or additional topic pages.

Maximum product files:

- Zero expected. If live verification finds a release-blocking defect, stop and plan a corrective milestone instead of patching production ad hoc.

Mandatory coordination files:

- `HANDOFF.md`
- `SESSION_UPDATE.md`
- `handover.md` after the release and live gates genuinely pass

### Current-code diagnosis

- Local changes are uncommitted and include earlier user-owned work that must be scoped carefully before any commit.
- The canonical repository is `https://github.com/amoschiamhq-sys/kitchen-constants.git`.
- Existing hosting uses Cloudflare clean URLs and has previously required manual account access for DNS/redirect work.
- A local preview is not evidence that production is updated.

### State-transition table

| State | Before | After |
|---|---|---|
| Local approved changes | Verified but unpublished | Intentionally committed on a launch branch |
| Canonical repository | Existing remote state | Draft/approved PR with reviewed scope |
| Production | Older release | New release only after merge/deploy authorization |
| Public topic URLs | Not live | Seven canonical URLs return expected content |
| SEO measurement | Local assertions only | Live metadata/schema/sitemap/PageSpeed evidence |
| Search Console | Unknown/unchanged | Read or submitted only with access and explicit authorization |

### Persistence, backend, and integration contract

- Do not alter application persistence or backend behavior.
- Never force-push, replace remote history, publish from an unrelated repository, or create a new hosting project.
- Preserve path and query behavior in redirects. Each clean URL should resolve to one canonical destination.
- If account ownership, DNS, certificate, or deployment access is missing, report the exact blocker and stop without workarounds.

### Scenario matrix

| Live scenario | Expected result |
|---|---|
| Apex homepage | `200`, HSTS present, correct title/canonical/schema |
| `www` equivalent | Permanent path/query-preserving redirect to apex |
| Seven clean URLs | Each resolves once with matching canonical and social URL |
| `.html` topic URL | Hosting's established clean-URL behavior resolves consistently |
| Sitemap and robots | Publicly fetchable; sitemap contains exactly the approved URLs |
| Calculator CTA from topic page | Hash state loads, canonicalizes, and works |
| Mobile live page | No overflow, duplicate fallback, or console error |

### Automated and live verification

- Before publish: focused tests, `node --test`, all changed-JavaScript `node --check`, `git diff --check`, and complete diff review.
- After deploy: fetch headers and HTML for all seven clean URLs, `robots.txt`, and `sitemap.xml`.
- Parse live JSON-LD and compare canonical/OG URLs with the requested URL.
- Run PageSpeed/Lighthouse on mobile and desktop where available; record scores and Core Web Vitals diagnostics without treating a single lab score as proof of ranking.
- If Search Console access is approved, record sitemap/index coverage and establish a later review date; do not promise immediate indexing.

### Manual verification

- Repeat the critical desktop, `390 x 844`, and `320 x 568` browser checks on production.
- Verify Guides buttons remain non-sticky.
- Check calculator navigation, browser Back/Forward, keyboard focus, no-JavaScript fallback, all topic-page links, HSTS, and `www` redirect.
- Compare the live page source and rendered DOM so deployment, not local cache, is being tested.

### Gate

The release is complete only when:

1. The exact commit/PR/deployment path is documented.
2. All local release checks pass.
3. Seven clean URLs, redirects, headers, metadata, schemas, sitemap, and robots pass live checks.
4. Desktop and both mobile viewports pass on production.
5. PageSpeed/Lighthouse evidence is recorded.
6. Any authorized Search Console action is documented without overstating indexing or ranking.
7. `HANDOFF.md`, `SESSION_UPDATE.md`, and `handover.md` match the real public state.

If any external requirement is unavailable, stop with the precise blocker. Do not mark the milestone complete based on local preview.

## Milestone 18 execution record

- Changed only Vinaigrette's visible ratio label from `Fat` to `Oil` and updated its focused navigation assertion.
- Focused navigation tests pass: 38. Full suite passes: 62. Both changed JavaScript files pass `node --check`; `git diff --check` passes with existing line-ending notices.
- Browser verification passed at desktop, `390 x 844`, and `320 x 568`; Vinaigrette shows `3 Oil : 1 Acid`, Dressing / Bright still shows `Fat`, and no actual body overflow or console errors were found.
- No SEO, route, layout, culinary-value, source metadata, review metadata, commit, publish, or deployment changes were made.

## Milestone 19 execution record

- Added a semantic homepage fallback inside `#app` using the existing compact header, category controls, card, and footer patterns. Client startup replaces it with the current interactive app.
- Added accurate `WebSite`, `CollectionPage`, and `AboutPage`/`Person` JSON-LD. Added tests for source fallback, JSON parsing, schema types/URLs, and absence of Recipe schema.
- Focused metadata tests pass: 9. Full suite passes: 64. Changed JavaScript test syntax passes; `git diff --check` passes with existing line-ending notices.
- Browser verification passed at desktop, `390 x 844`, and `320 x 568`; the rendered app has one H1, no fallback duplicate, no actual body overflow, and no console errors. Guides navigation remains static.
- Source-only fallback checks passed over the local HTTP response. No new reference pages, sitemap, SEO account, commit, publish, or deployment work was performed.

## Milestone 20 execution record

- Added four concise static reference pages with clean canonicals, unique metadata, one H1, visible Amos Chiam bylines, Article JSON-LD, relevant Guides links, and existing calculator CTAs.
- Added the Guides Reference pages section and expanded the sitemap to seven clean URLs.
- Added author URLs pointing to About to make the public author identity explicit. No Recipe schema, new cooking values, recipe steps, Marinades content, sticky navigation, or new route behavior was added.
- Focused metadata tests pass: 10. Full suite passes: 65. Changed JavaScript test syntax passes; `git diff --check` passes with existing line-ending notices.
- Browser verification passed at desktop, `390 x 844`, and `320 x 568` for all four pages; CTAs opened intended canonical hashes, body widths stayed within the viewport, and console logs were clean.

## Next-milestone execution prompt

Publishing is now the next step, but it changes external state. Execute **Milestone 21 - Conditional publishing and live SEO verification** from `IMPLEMENTATION_PLAN.md` only after the user explicitly authorizes publishing/deployment. Use the canonical repository and established hosting path, inspect the remote first, preserve unrelated changes, and stop if account, DNS, certificate, or deployment access is unavailable. Do not submit Search Console changes without separate explicit authorization.
