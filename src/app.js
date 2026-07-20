import { MEAT_CATALOG } from './constants.js';
import {
  getSinglePageViewModel,
  parseRoute,
  routeToHash,
  selectionKey,
} from './navigation.js';
import { formatGrams } from './calculator.js';

const appRoot = document.querySelector('#app');
const state = {
  rawWeight: '',
  route: null,
};
let focusHeadingOnHashChange = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getPageSelection(currentRoute) {
  if (currentRoute.kind === 'not-found') return null;
  const meat = currentRoute.meat ?? MEAT_CATALOG[0];
  const type = currentRoute.type ?? meat.types[0];

  return {
    meat,
    type,
    variant: currentRoute.variant ?? null,
    doneness: currentRoute.doneness ?? null,
  };
}

function choiceClass(isSelected) {
  return isSelected ? 'choice choice--selected' : 'choice';
}

function selectionLink({ href, label, isSelected }) {
  return `<li><a class="${choiceClass(isSelected)}" href="${escapeHtml(href)}"${isSelected ? ' aria-current="true"' : ''}><span>${escapeHtml(label)}</span><span aria-hidden="true">→</span></a></li>`;
}

function renderChoiceGroup({ id, label, choices }) {
  return `
    <section class="selection-group" aria-labelledby="${id}">
      <h2 id="${id}">${escapeHtml(label)}</h2>
      <ul class="choice-list choice-list--selector">
        ${choices.join('')}
      </ul>
    </section>`;
}

function renderSelectionControls(selection) {
  const { meat, type, variant, doneness } = selection;
  const meatChoices = MEAT_CATALOG.map((option) => selectionLink({
    href: routeToHash({ kind: 'meat', meat: option }),
    label: option.label,
    isSelected: option.slug === meat.slug,
  }));
  const typeChoices = meat.types.map((option) => selectionLink({
    href: routeToHash({ kind: 'cut', meat, type: option }),
    label: option.label,
    isSelected: option.slug === type.slug,
  }));
  const variantChoices = type.variants.map((option) => selectionLink({
    href: routeToHash({ kind: 'variant', meat, type, variant: option }),
    label: option.label,
    isSelected: option.slug === variant?.slug,
  }));
  const donenessChoices = type.doneness.map((option) => selectionLink({
    href: routeToHash({ kind: 'doneness', meat, type, variant, doneness: option }),
    label: option.label,
    isSelected: option.slug === doneness?.slug,
  }));

  return `
    <div class="selection-controls">
      ${renderChoiceGroup({ id: 'meat-heading', label: 'Choose a meat', choices: meatChoices })}
      ${renderChoiceGroup({ id: 'type-heading', label: 'Choose a cut', choices: typeChoices })}
      ${variantChoices.length ? renderChoiceGroup({ id: 'variant-heading', label: 'Choose the detail', choices: variantChoices }) : ''}
      ${donenessChoices.length ? renderChoiceGroup({ id: 'doneness-heading', label: 'Choose the finish', choices: donenessChoices }) : ''}
    </div>`;
}

function weightError(status) {
  if (status === 'invalid-format') return 'Enter a weight in grams, such as 1500 or 750,5.';
  if (status === 'out-of-range') return 'Use a weight between 0.1 g and 1,000,000 g.';
  return '';
}

function renderWeightInput(model) {
  const error = weightError(model.weight.status);
  const validationAttributes = error
    ? 'aria-invalid="true" aria-errormessage="weight-error"'
    : 'aria-invalid="false"';

  return `
    <section class="calculator-form input-card" aria-labelledby="weight-heading">
      <p class="eyebrow">Input</p>
      <h2 id="weight-heading">Weight in grams</h2>
      <label for="food-weight">Food weight</label>
      <div class="unit-input">
        <input id="food-weight" data-weight-input type="text" inputmode="decimal" autocomplete="off" value="${escapeHtml(state.rawWeight)}" aria-describedby="weight-help weight-error" ${validationAttributes}>
        <span aria-hidden="true">g</span>
      </div>
      <p id="weight-help" class="field-help">Use the weight of the selected cut.</p>
      <p id="weight-error" class="field-error" role="alert">${escapeHtml(error)}</p>
    </section>`;
}

function renderSaltCard(model) {
  if (!model.selectionComplete) {
    return `
      <article class="result-card result-card--pending">
        <p class="eyebrow">Dry brine salt</p>
        <h3>Choose the remaining options</h3>
        <p>Select the detail above to show the salt guidance for this cut.</p>
      </article>`;
  }

  if (!model.dryBrine?.ratios) {
    return `
      <article class="result-card result-card--pending">
        <p class="eyebrow">Dry brine salt</p>
        <h3>Awaiting content review</h3>
        <p>The interaction is ready. The culinary constant will appear after review.</p>
      </article>`;
  }

  const hasResult = model.weight.status === 'valid' && model.result;
  return `
    <article class="result-card result-card--salt" aria-live="polite" aria-atomic="true" aria-labelledby="salt-heading">
      <p class="eyebrow">Dry brine salt</p>
      <h3 id="salt-heading">Recommended salt</h3>
      <p class="constant-value">${model.dryBrine.ratios.recommended}<span>%</span></p>
      ${hasResult
        ? `<p class="result-value">${formatGrams(model.result.recommended)} <span>g</span></p><p class="range">Range: ${formatGrams(model.result.min)}–${formatGrams(model.result.max)} g</p>`
        : '<p class="result-placeholder">Enter a weight to calculate the salt.</p>'}
    </article>`;
}

function renderTemperatureCard(model) {
  const guidance = model.internalTemperature?.targetInternalTemperature;

  if (!model.selectionComplete) {
    return `
      <article class="result-card result-card--pending" aria-labelledby="temperature-heading">
        <p class="eyebrow">Internal temperature</p>
        <h3 id="temperature-heading">Choose the remaining options</h3>
        <p>Select the detail above to show the chef target for this cut.</p>
      </article>`;
  }

  if (guidance) {
    return `
      <article class="result-card result-card--temperature" aria-labelledby="temperature-heading">
        <p class="eyebrow">Internal temperature</p>
        <h3 id="temperature-heading">Chef target</h3>
        <p class="temperature-value">${escapeHtml(guidance)}</p>
        <p>${escapeHtml(model.internalTemperature.guidance)}</p>
        <p class="safety-note">${escapeHtml(model.internalTemperature.safety)}</p>
      </article>`;
  }

  return `
    <article class="result-card result-card--pending" aria-labelledby="temperature-heading">
      <p class="eyebrow">Internal temperature</p>
      <h3 id="temperature-heading">Awaiting content review</h3>
      <p>Professional guidance will appear here once the endpoint and hold-time wording are approved.</p>
    </article>`;
}

function renderResults(selection, model) {
  const selectionLabel = [selection.meat.label, selection.type.label, selection.variant?.label, selection.doneness?.label]
    .filter(Boolean)
    .join(' / ');
  const input = model.selectionComplete && model.dryBrine?.ratios ? renderWeightInput(model) : '';

  return `
    <section class="results-section" aria-labelledby="results-heading">
      <p class="eyebrow">Your results</p>
      <h2 id="results-heading">${escapeHtml(selectionLabel)}</h2>
      ${input}
      <div class="results-grid">
        ${renderSaltCard(model)}
        ${renderTemperatureCard(model)}
      </div>
    </section>`;
}

function renderHeader() {
  return `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="Kitchen Constants home">
        <span class="brand-mark" aria-hidden="true">Kc</span>
        <span>Kitchen Constants</span>
      </a>
    </header>`;
}

function renderNotFound() {
  return `
    <section class="not-found" aria-labelledby="not-found-heading">
      <p class="eyebrow">Kitchen Constants</p>
      <h1 id="not-found-heading" tabindex="-1">That page is not in the pantry</h1>
      <p class="lede">That selection is not available yet. Return home and choose from the one-page controls.</p>
      <a class="choice" href="#/"><span>Go home</span><span aria-hidden="true">→</span></a>
    </section>`;
}

function renderRoute(currentRoute) {
  if (currentRoute.kind === 'not-found') {
    return `${renderHeader()}<main id="main-content" tabindex="-1">${renderNotFound()}</main>`;
  }

  const selection = getPageSelection(currentRoute);
  const model = getSinglePageViewModel(selection, state.rawWeight);

  return `
    ${renderHeader()}
    <main id="main-content" tabindex="-1">
      <p class="eyebrow">A pocket reference for cooking by weight</p>
      <h1 tabindex="-1">Kitchen Constants</h1>
      <p class="lede">Choose a cut, enter the weight, and keep the useful results together.</p>
      ${renderSelectionControls(selection)}
      ${renderResults(selection, model)}
    </main>`;
}

function renderCurrentRoute({ focusHeading = false, focusInput = false } = {}) {
  const nextRoute = parseRoute(window.location.hash);
  if (state.route && selectionKey(state.route) !== selectionKey(nextRoute)) {
    state.rawWeight = '';
  }
  state.route = nextRoute;
  appRoot.innerHTML = renderRoute(nextRoute);

  if (focusInput) {
    const input = appRoot.querySelector('[data-weight-input]');
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  } else if (focusHeading) {
    appRoot.querySelector('h1')?.focus({ preventScroll: true });
  }
}

appRoot.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href^="#/"]');
  if (!link || !appRoot.contains(link) || link.hash === window.location.hash) return;
  focusHeadingOnHashChange = true;
});

appRoot.addEventListener('input', (event) => {
  if (!event.target.matches('[data-weight-input]')) return;
  state.rawWeight = event.target.value;
  renderCurrentRoute({ focusInput: true });
});

window.addEventListener('hashchange', () => {
  const shouldFocusHeading = focusHeadingOnHashChange;
  focusHeadingOnHashChange = false;
  renderCurrentRoute({ focusHeading: shouldFocusHeading });
});

renderCurrentRoute();
