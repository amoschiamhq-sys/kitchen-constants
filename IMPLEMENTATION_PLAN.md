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
