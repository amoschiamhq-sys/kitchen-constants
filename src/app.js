import { CATEGORY_CATALOG, MEAT_CATALOG } from './constants.js';
import {
  getSinglePageViewModel,
  parseRoute,
  resolveSelection,
} from './navigation.js';
import { formatGrams } from './calculator.js';

const appRoot = document.querySelector('#app');
const state = {
  rawWeight: '100',
  selection: null,
  pendingFocusKey: null,
  pendingScrollY: null,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function resolvedHash(fields) {
  return resolveSelection(fields).hash;
}

function selectionLink({ href, label, isSelected, key }) {
  return `<li><a class="choice${isSelected ? ' choice--selected' : ''}" href="${escapeHtml(href)}" data-choice-key="${escapeHtml(key)}"${isSelected ? ' aria-current="true"' : ''}>${escapeHtml(label)}</a></li>`;
}

function renderChoiceGroup({ id, label, kind, choices }) {
  return `
    <section class="selection-group selection-group--${kind}" aria-labelledby="${id}">
      <h2 id="${id}">${escapeHtml(label)}</h2>
      <ul class="choice-list choice-list--${kind}">
        ${choices.join('')}
      </ul>
    </section>`;
}

function renderCategoryControls(selection) {
  const activeCategory = selection?.category?.slug ?? 'meat';
  const categoryChoices = CATEGORY_CATALOG.map((category) => {
    if (category.status === 'coming-soon') {
      return `<li><span class="choice choice--coming-soon" aria-disabled="true"><span>${escapeHtml(category.label)}</span><small>Coming soon</small></span></li>`;
    }
    return selectionLink({
      href: category.slug === 'meat'
        ? resolvedHash({ meat: MEAT_CATALOG[0] })
        : resolvedHash({ category }),
      label: category.label,
      isSelected: category.slug === activeCategory,
      key: `category:${category.slug}`,
    });
  });

  return renderChoiceGroup({
    id: 'category-heading',
    label: 'What are you making?',
    kind: 'category',
    choices: categoryChoices,
  });
}

function renderPastaSelectionControls(selection) {
  const styleChoices = selection.category.styles.map((style) => selectionLink({
    href: resolvedHash({ category: selection.category, style }),
    label: style.label,
    isSelected: style.slug === selection.style.slug,
    key: `pasta:${style.slug}`,
  }));

  return renderChoiceGroup({
    id: 'pasta-style-heading',
    label: 'Style',
    kind: 'style',
    choices: styleChoices,
  });
}

function renderSauceSelectionControls(selection) {
  const category = selection.category;
  const isClassic = Boolean(selection.classic);
  const activeDirection = selection.direction ?? category.directions[0];
  const startChoices = [
    ...category.directions.map((direction) => selectionLink({
      href: resolvedHash({ category, direction }),
      label: direction.label,
      isSelected: !isClassic && direction.slug === activeDirection.slug,
      key: `sauce-direction:${direction.slug}`,
    })),
    selectionLink({
      href: resolvedHash({ category, classic: category.classics[0] }),
      label: 'Classic',
      isSelected: isClassic,
      key: 'sauce-direction:classics',
    }),
  ];

  const secondaryChoices = isClassic
    ? category.classics.map((classic) => selectionLink({
      href: resolvedHash({ category, classic }),
      label: classic.label,
      isSelected: classic.slug === selection.classic.slug,
      key: `sauce-classic:${classic.slug}`,
    }))
    : activeDirection.profiles.map((profile) => selectionLink({
      href: resolvedHash({ category, direction: selection.direction, profile }),
      label: profile.label,
      isSelected: profile.slug === selection.profile.slug,
      key: `sauce-profile:${profile.slug}`,
    }));

  return `
    <div class="selection-controls selection-controls--sauce" aria-label="Sauce choices">
      ${renderChoiceGroup({ id: 'sauce-direction-heading', label: 'Start with', kind: 'sauce-direction', choices: startChoices })}
      ${secondaryChoices.length > 0
        ? renderChoiceGroup({ id: 'sauce-secondary-heading', label: isClassic ? 'Named sauce' : 'Flavour', kind: isClassic ? 'sauce-classic' : 'sauce-profile', choices: secondaryChoices })
        : ''}
    </div>`;
}

function renderSelectionControls(selection) {
  if (selection.category?.kind === 'sauce') {
    return renderSauceSelectionControls(selection);
  }
  if (selection.category?.kind === 'pasta') {
    return `
      <div class="selection-controls selection-controls--secondary" aria-label="Pasta and noodle choices">
        ${renderPastaSelectionControls(selection)}
      </div>`;
  }

  const { meat, type, detail, doneness } = selection;
  const meatChoices = MEAT_CATALOG.map((option) => selectionLink({
    href: resolvedHash({ kind: 'meat', meat: option }),
    label: option.label,
    isSelected: option.slug === meat.slug,
    key: `meat:${option.slug}`,
  }));
  const typeChoices = meat.types.map((option) => selectionLink({
    href: resolvedHash({ kind: 'cut', meat, type: option }),
    label: option.label,
    isSelected: option.slug === type.slug,
    key: `cut:${option.slug}`,
  }));
  const detailChoices = type.details.map((option) => selectionLink({
    href: resolvedHash({ kind: 'doneness', meat, type, detail: option, doneness }),
    label: option.label,
    isSelected: option.slug === detail.slug,
    key: `detail:${option.slug}`,
  }));
  const donenessChoices = type.doneness.map((option) => selectionLink({
    href: resolvedHash({ kind: 'doneness', meat, type, detail, doneness: option }),
    label: option.label,
    isSelected: option.slug === doneness.slug,
    key: `doneness:${option.slug}`,
  }));

  return `
    <div class="selection-controls" aria-label="Cooking choices">
      ${renderChoiceGroup({ id: 'meat-heading', label: 'Meat', kind: 'meat', choices: meatChoices })}
      ${renderChoiceGroup({ id: 'cut-heading', label: 'Cut', kind: 'cut', choices: typeChoices })}
      <div class="selection-pair">
        ${renderChoiceGroup({ id: 'detail-heading', label: 'Detail', kind: 'detail', choices: detailChoices })}
        ${renderChoiceGroup({ id: 'doneness-heading', label: 'Doneness', kind: 'doneness', choices: donenessChoices })}
      </div>
    </div>`;
}

function weightError(status) {
  if (status === 'invalid-format') return 'Enter a weight in grams, such as 1500 or 750,5.';
  if (status === 'out-of-range') return 'Use a weight between 0.1 g and 1,000,000 g.';
  return '';
}

function renderSaltCalculation(model) {
  if (model.weight.status === 'valid' && model.result) {
    return `<p class="result-value">${formatGrams(model.result.recommended)} <span>g</span></p>`;
  }
  if (model.weight.status === 'empty') {
    return '<p class="result-placeholder">Enter a weight to calculate the dry-brining salt.</p>';
  }
  return '<p class="result-placeholder">Correct the weight to calculate the dry-brining salt.</p>';
}

function renderTimingNote(timing) {
  if (!timing) return '';
  const ranges = typeof timing === 'string'
    ? { minimum: timing, best: timing }
    : timing;
  return `
    <div class="timing-note">
      <strong>Timing</strong>
      <span><b>Minimum:</b> ${escapeHtml(ranges.minimum)}</span>
      <span><b>Best:</b> ${escapeHtml(ranges.best)}</span>
    </div>`;
}

function renderPrepareCard(model) {
  if (!model.dryBrine?.ratios) {
    return `
      <article class="result-card result-card--pending" aria-labelledby="prepare-heading">
        <p class="card-kicker">Prepare</p>
        <h2 id="prepare-heading">Awaiting content review</h2>
        <p>The controls are ready. The culinary constant will appear after review.</p>
      </article>`;
  }

  const error = weightError(model.weight.status);
  const validationAttributes = error
    ? 'aria-invalid="true" aria-errormessage="weight-error"'
    : 'aria-invalid="false"';

  return `
    <article class="result-card result-card--prepare" aria-labelledby="prepare-heading">
      <p class="card-kicker">Prepare</p>
      <div class="result-heading-row">
        <h2 id="prepare-heading">Dry brine</h2>
        <p class="constant-value" aria-label="${model.dryBrine.ratios.recommended} percent salt">${model.dryBrine.ratios.recommended}<span>%</span></p>
      </div>
      <div class="calculation-row">
        <div class="weight-control">
          <label for="food-weight">Food weight</label>
          <div class="unit-input">
            <input id="food-weight" data-weight-input type="text" inputmode="decimal" autocomplete="off" value="${escapeHtml(state.rawWeight)}" aria-describedby="weight-help weight-error" ${validationAttributes}>
            <span aria-hidden="true">g</span>
          </div>
          <p id="weight-help" class="field-help">Weight of the selected cut.</p>
          <p id="weight-error" class="field-error" role="alert">${escapeHtml(error)}</p>
        </div>
        <div class="salt-calculation">
          <p class="result-label">Salt</p>
          <div data-salt-output aria-live="polite" aria-atomic="true">${renderSaltCalculation(model)}</div>
        </div>
      </div>
      ${renderTimingNote(model.dryBrine.timing)}
      <p class="method-note">A practical starting point, drawn from culinary references and open to adjustment in your own kitchen.</p>
    </article>`;
}

function renderDoughCalculation(model) {
  if (model.weight.status === 'valid' && model.dough) {
    return `
      <div class="dough-output-grid">
        <div class="dough-output-item">
          <p class="dough-output-label">${escapeHtml(model.style.liquidLabel)}</p>
          <p class="result-value">${formatGrams(model.dough.liquid)} <span>g</span></p>
        </div>
        <div class="dough-output-item dough-output-item--salt">
          <p class="dough-output-label">Salt</p>
          <p class="result-value">${formatGrams(model.dough.salt)} <span>g</span></p>
        </div>
      </div>`;
  }
  if (model.weight.status === 'empty') {
    return '<p class="result-placeholder">Enter a flour weight to calculate the dough ingredients.</p>';
  }
  return '<p class="result-placeholder">Correct the flour weight to calculate the dough ingredients.</p>';
}

function renderRatioDisplay(style) {
  const parts = style.ratioParts ?? [
    { value: style.hydration, label: style.liquidLabel },
    { value: style.saltPercent, label: 'Salt' },
  ];
  const ariaLabel = parts.map(({ value, label }) => `${value} percent ${label.toLowerCase()}`).join(', ');

  return `
    <div class="ratio-display" aria-label="${escapeHtml(ariaLabel)}">
      ${parts.map(({ value, label }, index) => `
        ${index > 0 ? '<span class="ratio-separator" aria-hidden="true">|</span>' : ''}
        <span class="ratio-part">
          <span class="ratio-value">${escapeHtml(value)}%</span>
          <span class="ratio-ingredient">${escapeHtml(label)}</span>
        </span>`).join('')}
    </div>`;
}

function renderPastaPrepareCard(model) {
  const { style } = model;
  const error = weightError(model.weight.status);
  const validationAttributes = error
    ? 'aria-invalid="true" aria-errormessage="weight-error"'
    : 'aria-invalid="false"';

  return `
    <article class="result-card result-card--prepare" aria-labelledby="prepare-heading">
      <p class="card-kicker">Make</p>
      <div class="result-heading-row">
        <div>
          <h2 id="prepare-heading">${escapeHtml(style.label)}</h2>
          <p class="ratio-label">${escapeHtml(style.ratioLabel)}</p>
        </div>
        ${renderRatioDisplay(style)}
      </div>
      <div class="calculation-row">
        <div class="weight-control">
          <label for="food-weight">${escapeHtml(style.inputLabel)}</label>
          <div class="unit-input">
            <input id="food-weight" data-weight-input type="text" inputmode="decimal" autocomplete="off" value="${escapeHtml(state.rawWeight)}" aria-describedby="weight-help weight-error" ${validationAttributes}>
            <span aria-hidden="true">g</span>
          </div>
          <p id="weight-help" class="field-help">The flour amount for this batch.</p>
          <p id="weight-error" class="field-error" role="alert">${escapeHtml(error)}</p>
        </div>
        <div class="dough-calculation" data-dough-output aria-live="polite" aria-atomic="true">${renderDoughCalculation(model)}</div>
      </div>
      <p class="timing-note"><strong>Why it works</strong> ${escapeHtml(style.note)}</p>
    </article>`;
}

function renderPastaFinishCard(model) {
  return `
    <article class="result-card result-card--finish" aria-labelledby="finish-heading">
      <p class="card-kicker">Finish</p>
      <h2 id="finish-heading">Rest, then shape</h2>
      <p class="result-label">Rest</p>
      <p class="guidance">${escapeHtml(model.style.rest)}</p>
      <p class="result-label safety-label">Cook or use</p>
      <p class="safety-note">${escapeHtml(model.style.finish)}</p>
    </article>`;
}

function renderSauceRatioDisplay(sauce) {
  const ariaLabel = sauce.ratioParts.map(({ value, label }) => value === '+'
    ? `plus ${label.toLowerCase()}`
    : `${value} parts ${label.toLowerCase()}`).join(', ');
  return `
    <div class="sauce-ratio" aria-label="${escapeHtml(ariaLabel)}">
      ${sauce.ratioParts.map(({ value, label }) => `
        <span class="sauce-ratio-group${value === '+' ? ' sauce-ratio-group--optional' : ''}">
          <span class="sauce-ratio-part">
            <span class="sauce-ratio-value">${escapeHtml(value)}</span>
            <span class="sauce-ratio-label">${escapeHtml(label)}</span>
          </span>
        </span>`).join('')}
    </div>`;
}



function roleKey(label) {
  const normalized = label.toLowerCase();
  if (normalized.includes('salty') || normalized.includes('soy')) return 'salty';
  if (normalized.includes('umami')) return 'umami';
  if (normalized.includes('sweet')) return 'sweet';
  if (normalized.includes('acid') || normalized.includes('vinegar')) return 'acid';
  if (normalized.includes('fat') || normalized.includes('nutty') || normalized.includes('sesame') || normalized.includes('peanut')) return 'fat';
  if (normalized.includes('heat')) return 'heat';
  return 'aromatics';
}

function renderSauceRoleChoices(sauce) {
  if (!sauce.ingredientsByRole) return '';
  const roles = [...new Map(sauce.ratioParts
    .map(({ label }) => [roleKey(label), label])).entries()];
  return `
    <div class="sauce-roles">
      <p class="result-label">Choose from</p>
      <div class="sauce-role-grid">
        ${roles.map(([key, label]) => `
          <div class="sauce-role">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml((sauce.ingredientsByRole[key] ?? []).join(' · '))}</span>
          </div>`).join('')}
      </div>
      <p class="method-note">One ingredient can fill more than one role. Start with the balance, then adjust.</p>
    </div>`;
}

function renderSauceBalanceCard(model) {
  const sauce = model.sauce;
  return `
    <article class="result-card result-card--sauce" aria-labelledby="sauce-balance-heading">
      <p class="card-kicker">Ratio</p>
      <div class="sauce-card-heading${sauce.ratioParts.length > 3 ? ' sauce-card-heading--long' : ''}">
        <div>
          <h2 id="sauce-balance-heading">${escapeHtml(sauce.label)}</h2>
        </div>
        ${renderSauceRatioDisplay(sauce)}
      </div>
      <p class="method-note sauce-ratio-help">Use the same spoon or cup for every part.</p>
      <p class="sauce-purpose">${escapeHtml(sauce.purpose)}</p>
      ${renderSauceRoleChoices(sauce)}
    </article>`;
}

function renderSauceUseCard(model) {
  const sauce = model.sauce;
  return `
    <article class="result-card result-card--sauce" aria-labelledby="sauce-use-heading">
      <p class="card-kicker">Use</p>
      <h2 id="sauce-use-heading">Where it fits</h2>
      <p class="result-label">Typical uses</p>
      <ul class="sauce-use-list">${sauce.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join('')}</ul>
      <p class="result-label sauce-subheading">Optional additions</p>
      <p class="guidance">${escapeHtml(sauce.optionalAdditions.join(' · '))}</p>
      <p class="result-label sauce-subheading">Common substitutions</p>
      <p class="guidance">${escapeHtml(sauce.substitutions.join(' · '))}</p>
      <p class="method-note">A practical starting balance, open to adjustment in your own kitchen.</p>
    </article>`;
}

function renderFinishCard(model) {
  const guidance = model.internalTemperature?.targetInternalTemperature;
  if (!guidance) {
    return `
      <article class="result-card result-card--pending" aria-labelledby="finish-heading">
        <p class="card-kicker">Finish</p>
        <h2 id="finish-heading">Awaiting content review</h2>
        <p>This internal-temperature guidance is still under review.</p>
      </article>`;
  }

  return `
    <article class="result-card result-card--finish" aria-labelledby="finish-heading">
      <p class="card-kicker">Finish</p>
      <h2 id="finish-heading">Internal temperature</h2>
      <p class="result-label">Chef target</p>
      <p class="temperature-value">${escapeHtml(guidance)}</p>
      <p class="guidance">${escapeHtml(model.internalTemperature.guidance)}</p>
      <p class="result-label safety-label">Food-safety baseline</p>
      <p class="safety-note">${escapeHtml(model.internalTemperature.safety)}</p>
    </article>`;
}

function renderHeader() {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#/" data-choice-key="brand" aria-label="Kitchen Constants home">
          <span class="brand-mark" aria-hidden="true">Kc</span>
          <span class="brand-name">Kitchen Constants</span>
        </a>
        <nav class="site-nav" aria-label="Main navigation">
          <a href="./">Calculator</a>
          <a href="./guides.html">Guides</a>
          <a href="./about.html">About</a>
        </nav>
      </div>
      <div class="tagline-row">
        <p class="tagline">Measure twice. Season once.</p>
      </div>
    </header>`;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <p>A small cooking reference for home cooks, leaving the final touch to you.</p>
      <nav aria-label="Footer navigation">
        <a href="./guides.html">Guides</a>
        <a href="./about.html">About</a>
      </nav>
    </footer>`;
}

function renderSupportNote() {
  return `
    <aside class="support-note" aria-label="Support Kitchen Constants">
      <p class="support-title">Found this useful?</p>
      <p>I built Kitchen Constants to make my own cooking a little more reliable. If it has found a place in your kitchen too, a small tip helps me keep it free and continue improving it.</p>
      <a class="support-button" href="https://ko-fi.com/amoschiam" target="_blank" rel="noopener noreferrer">Leave a tip</a>
    </aside>`;
}

function renderNotFound() {
  return `
    ${renderHeader()}
    <main id="main-content">
      <section class="not-found" aria-labelledby="not-found-heading">
        <p class="card-kicker">Kitchen reference</p>
        <h1 id="not-found-heading">That page is not in the pantry</h1>
        <p>That selection is not available. Return to the default cooking reference.</p>
        <a class="choice recovery-link" href="#/">Use defaults</a>
      </section>
    </main>
    ${renderFooter()}`;
}

function renderPage(selection) {
  const model = getSinglePageViewModel(selection, state.rawWeight);
  const isPasta = selection.category?.kind === 'pasta';
  const isSauce = selection.category?.kind === 'sauce';
  return `
    ${renderHeader()}
    <main id="main-content">
      <h1 class="visually-hidden">Kitchen Constants cooking reference</h1>
      <div class="selection-controls">
        ${renderCategoryControls(selection)}
        ${renderSelectionControls(selection)}
      </div>
      <section class="results-grid" aria-label="Cooking guidance">
          ${isSauce ? renderSauceBalanceCard(model) : isPasta ? renderPastaPrepareCard(model) : renderPrepareCard(model)}
          ${isSauce ? renderSauceUseCard(model) : isPasta ? renderPastaFinishCard(model) : renderFinishCard(model)}
        </section>
      ${renderSupportNote()}
    </main>
    ${renderFooter()}`;
}

function restorePendingFocus() {
  if (!state.pendingFocusKey) return;
  const target = [...appRoot.querySelectorAll('[data-choice-key]')]
    .find((element) => element.dataset.choiceKey === state.pendingFocusKey);
  target?.focus({ preventScroll: true });
  state.pendingFocusKey = null;
}

function renderCurrentRoute({ preserveViewport = false } = {}) {
  const previousScrollY = state.pendingScrollY ?? window.scrollY;
  state.pendingScrollY = null;
  const parsed = parseRoute(window.location.hash);
  if (parsed.kind === 'not-found') {
    state.selection = null;
    appRoot.innerHTML = renderNotFound();
    return;
  }

  const selection = resolveSelection(parsed);
  if (window.location.hash !== selection.hash) {
    window.history.replaceState(null, '', selection.hash);
  }
  state.selection = selection;
  appRoot.innerHTML = renderPage(selection);
  restorePendingFocus();
  if (preserveViewport) {
    window.requestAnimationFrame(() => window.scrollTo({ top: previousScrollY, left: 0, behavior: 'auto' }));
  }
}

function updateWeightResult() {
  if (!state.selection) return;
  const model = getSinglePageViewModel(state.selection, state.rawWeight);
  const input = appRoot.querySelector('[data-weight-input]');
  const error = weightError(model.weight.status);
  input?.setAttribute('aria-invalid', error ? 'true' : 'false');
  if (error) input?.setAttribute('aria-errormessage', 'weight-error');
  else input?.removeAttribute('aria-errormessage');
  const errorNode = appRoot.querySelector('#weight-error');
  if (errorNode) errorNode.textContent = error;
  const output = appRoot.querySelector(state.selection.category?.kind === 'pasta'
    ? '[data-dough-output]'
    : '[data-salt-output]');
  if (output) {
    output.innerHTML = state.selection.category?.kind === 'pasta'
      ? renderDoughCalculation(model)
      : renderSaltCalculation(model);
  }
}

appRoot.addEventListener('pointerdown', (event) => {
  const link = event.target.closest?.('[data-choice-key]');
  if (link) state.pendingScrollY = window.scrollY;
}, { capture: true });

appRoot.addEventListener('click', (event) => {
  const link = event.target.closest?.('[data-choice-key]');
  if (link) {
    state.pendingFocusKey = link.dataset.choiceKey;
    if (state.pendingScrollY === null) state.pendingScrollY = window.scrollY;
  }
});

appRoot.addEventListener('input', (event) => {
  if (!event.target.matches('[data-weight-input]')) return;
  state.rawWeight = event.target.value;
  updateWeightResult();
});

window.addEventListener('hashchange', () => renderCurrentRoute({ preserveViewport: true }));

renderCurrentRoute();
