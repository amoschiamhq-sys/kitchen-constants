import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canonicalSelectionHash,
  getSinglePageViewModel,
  getRouteChoices,
  getRouteTitle,
  parseRoute,
  resolveSelection,
  routeToHash,
  selectionKey,
} from '../src/navigation.js';
import { CATEGORY_CATALOG, MEAT_CATALOG, PASTA_CATALOG } from '../src/constants.js';

test('approved catalogue exposes the compact five-meat matrix', () => {
  assert.deepEqual(MEAT_CATALOG.map((meat) => meat.label), [
    'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish & shellfish',
  ]);
  assert.deepEqual(MEAT_CATALOG.map((meat) => meat.types.map((type) => type.label)), [
    ['Whole bird', 'Breast', 'Thigh', 'Ground meat'],
    ['Steak', 'Ribeye', 'Beef ribs', 'Ground meat'],
    ['Chop', 'Tenderloin', 'Ribs', 'Ground meat'],
    ['Chops', 'Leg', 'Rack', 'Shoulder'],
    ['Scallops', 'Prawns', 'Fish fillet'],
  ]);
});

test('every active cut has a non-empty detail and doneness choice', () => {
  for (const meat of MEAT_CATALOG) {
    for (const type of meat.types) {
      assert.ok(type.details.length > 0, `${meat.label} ${type.label} has no details`);
      assert.ok(type.doneness.length > 0, `${meat.label} ${type.label} has no doneness`);
    }
  }
});

test('resolved selection defaults every downstream choice', () => {
  const resolved = resolveSelection(parseRoute('#/beef'));

  assert.equal(resolved.meat.label, 'Beef');
  assert.equal(resolved.type.label, 'Steak');
  assert.equal(resolved.detail.label, 'Bone-in');
  assert.equal(resolved.doneness.label, 'Medium-rare');
  assert.equal(resolved.selectionComplete, true);
});

test('canonical selection hash includes the resolved detail and doneness', () => {
  const resolved = resolveSelection(parseRoute('#/lamb/shoulder'));

  assert.equal(
    canonicalSelectionHash(resolved),
    '#/lamb/shoulder/bone-in/tender',
  );
});

test('parseRoute maps supported selection paths to route states', () => {
  assert.equal(parseRoute('#/').kind, 'home');
  assert.equal(parseRoute('#/chicken').kind, 'meat');
  assert.equal(parseRoute('#/chicken/whole').kind, 'cut');
  assert.equal(parseRoute('#/chicken/breast/bone-in').kind, 'detail');
  assert.equal(parseRoute('#/beef/steak/bone-in/medium-rare').kind, 'doneness');
});

test('parseRoute maps unknown and malformed hashes to not-found', () => {
  for (const hash of ['#/fish', '#/chicken/wing', '#/chicken/whole/bone-in', '#/beef/steak/bone-in/rare']) {
    assert.equal(parseRoute(hash).kind, 'not-found', hash);
  }
});

test('route parsing and hash generation are idempotent for selection paths', () => {
  const original = parseRoute('#/chicken/thigh/bone-in');
  const reparsed = parseRoute(routeToHash(original));

  assert.equal(routeToHash(reparsed), '#/chicken/thigh/bone-in');
  assert.equal(selectionKey(original), selectionKey(reparsed));
});

test('route choices expose the compact active catalogue', () => {
  const homeChoices = getRouteChoices(parseRoute('#/'));
  const beefChoices = getRouteChoices(parseRoute('#/beef'));

  assert.deepEqual(homeChoices.slice(0, 5).map((choice) => choice.label), [
    'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish & shellfish',
  ]);
  assert.deepEqual(beefChoices.map((choice) => choice.label), [
    'Steak', 'Ribeye', 'Beef ribs', 'Ground meat',
  ]);
  assert.equal(homeChoices.length, 5);
});

test('detail and doneness choices are exposed for every applicable step', () => {
  assert.deepEqual(
    getRouteChoices(parseRoute('#/chicken/breast')).map((choice) => choice.label),
    ['Bone-in', 'Boneless'],
  );
  assert.deepEqual(
    getRouteChoices(parseRoute('#/beef/steak/bone-in')).map((choice) => choice.label),
    ['Medium-rare', 'Medium'],
  );
  assert.deepEqual(
    getRouteChoices(parseRoute('#/pork/tenderloin')).map((choice) => choice.label),
    ['Boneless'],
  );
  assert.deepEqual(
    getRouteChoices(parseRoute('#/chicken/whole')).map((choice) => choice.label),
    ['Whole'],
  );
});

test('single-page model resolves whole-chicken defaults before weight input', () => {
  const model = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/whole')));

  assert.equal(model.selectionComplete, true);
  assert.deepEqual(model.weight, { status: 'empty' });
  assert.equal(model.dryBrine.contentStatus, 'candidate');
  assert.deepEqual(model.dryBrine.ratios, { min: 1.1, recommended: 1.1, max: 1.1 });
  assert.equal(model.result, null);
});

test('category model exposes meat and pasta tools', () => {
  assert.deepEqual(CATEGORY_CATALOG.map((category) => category.label), [
    'Meat', 'Pasta & Noodles', 'Bread', 'Marinades', 'Sauces',
  ]);
  assert.deepEqual(CATEGORY_CATALOG.slice(2).map((category) => category.status), [
    'coming-soon', 'coming-soon', 'coming-soon',
  ]);
  assert.deepEqual(PASTA_CATALOG[0].styles.map((style) => style.label), [
    'Fresh egg pasta', 'Chinese hand-cut noodles', 'Dumpling wrappers',
  ]);
});

test('pasta routes resolve the first style by default', () => {
  const parsed = parseRoute('#/pasta');
  const resolved = resolveSelection(parsed);

  assert.equal(parsed.kind, 'category');
  assert.equal(resolved.style.slug, 'fresh-egg');
  assert.equal(resolved.hash, '#/pasta/fresh-egg');
  assert.deepEqual(getRouteChoices(parsed).map((choice) => choice.label), [
    'Fresh egg pasta', 'Chinese hand-cut noodles', 'Dumpling wrappers',
  ]);
});

test('pasta dough model scales fresh pasta, Chinese noodles and wrappers', () => {
  const cases = [
    ['fresh-egg', 50],
    ['chinese-hand-cut', 48],
    ['dumpling-wrappers', 52],
  ];

  for (const [style, hydration] of cases) {
    const model = getSinglePageViewModel(
      resolveSelection(parseRoute(`#/pasta/${style}`)),
      '100',
    );

    assert.equal(model.module, 'pasta');
    assert.equal(model.dough.liquid, hydration, style);
    assert.equal(model.dough.flour, 100, style);
    assert.ok(model.dough.salt > 0, style);
  }
});

test('pasta styles expose labelled ratio parts for the visual ratio display', () => {
  const cases = [
    ['fresh-egg', ['50% Egg', '1% Salt']],
    ['chinese-hand-cut', ['48% Water', '2% Salt']],
    ['dumpling-wrappers', ['52% Water', '1% Salt']],
  ];

  for (const [style, expected] of cases) {
    const selection = resolveSelection(parseRoute(`#/pasta/${style}`));
    assert.deepEqual(
      selection.style.ratioParts.map((part) => `${part.value}% ${part.label}`),
      expected,
      style,
    );
  }
});

test('single-page whole-chicken model calculates without stale output', () => {
  const selection = resolveSelection(parseRoute('#/chicken/whole'));
  const valid = getSinglePageViewModel(selection, '1500');
  const invalid = getSinglePageViewModel(selection, '12kg');

  assert.deepEqual(valid.result, { recommended: 16.5, min: 16.5, max: 16.5 });
  assert.equal(invalid.result, null);
  assert.equal(invalid.weight.status, 'invalid-format');
});

test('single-page model exposes grams without salt-volume fields', () => {
  const model = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/whole')), '1500');

  assert.deepEqual(model.result, { recommended: 16.5, min: 16.5, max: 16.5 });
  assert.equal('saltType' in model, false);
  assert.equal('spoonResult' in model, false);
});

test('reviewed dry-brine timing remains tailored for ground meat and seafood', () => {
  const ground = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/ground-80-20')), '1000');
  const seafood = getSinglePageViewModel(resolveSelection(parseRoute('#/seafood/shrimp')), '1000');

  assert.match(ground.dryBrine.timing.minimum, /Immediately before shaping/);
  assert.match(ground.dryBrine.timing.best, /30 minutes/);
  assert.equal(seafood.dryBrine.timing.minimum, '30 minutes');
  assert.equal(seafood.dryBrine.timing.best, '1 hour');
});

test('single-page chef temperatures follow selected beef doneness', () => {
  const mediumRare = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/steak/bone-in/medium-rare')));
  const medium = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/steak/bone-in/medium')));

  assert.equal(mediumRare.internalTemperature.targetInternalTemperature, '130–135°F / 54–57°C');
  assert.equal(medium.internalTemperature.targetInternalTemperature, '135–145°F / 57–63°C');
  assert.match(mediumRare.internalTemperature.safety, /145°F/);
});

test('reviewed lamb temperatures cover each roast and chop doneness choice', () => {
  const expected = {
    'medium-rare': '130–135°F / 54–57°C',
    medium: '135–145°F / 57–63°C',
  };

  for (const cut of ['chops', 'leg', 'rack']) {
    for (const [doneness, target] of Object.entries(expected)) {
      const model = getSinglePageViewModel(
        resolveSelection(parseRoute(`#/lamb/${cut}/bone-in/${doneness}`)),
      );
      const temperature = model.internalTemperature;

      assert.equal(temperature.contentStatus, 'reviewed', `${cut} ${doneness}`);
      assert.equal(temperature.targetInternalTemperature, target, `${cut} ${doneness}`);
      assert.match(temperature.guidance, /5°F \/ 2°C early for chops/);
      assert.match(temperature.guidance, /10–12°F \/ 5–6°C early for larger roasts/);
      assert.match(temperature.safety, /145°F \/ 63°C with at least 3 minutes of rest/);
      assert.equal(
        temperature.source,
        'https://blog.thermoworks.com/chef-recommended-tw-approved/',
      );
      assert.equal(
        temperature.safetySource,
        'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
      );
      assert.equal(temperature.reviewedOn, '2026-07-23');
    }
  }
});

test('reviewed ground meat and seafood temperatures use safety baselines', () => {
  const groundPoultry = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/ground')));
  const groundBeef = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/ground-80-20')));
  const groundPork = getSinglePageViewModel(resolveSelection(parseRoute('#/pork/ground')));
  const seafood = getSinglePageViewModel(resolveSelection(parseRoute('#/seafood/fish')));

  assert.equal(groundPoultry.internalTemperature.targetInternalTemperature, '165°F / 74°C');
  assert.match(groundPoultry.internalTemperature.safety, /ground poultry/);
  assert.equal(groundBeef.internalTemperature.targetInternalTemperature, '160°F / 71°C');
  assert.match(groundBeef.internalTemperature.safety, /ground beef and pork/);
  assert.equal(groundPork.internalTemperature.targetInternalTemperature, '160°F / 71°C');
  assert.equal(seafood.internalTemperature.targetInternalTemperature, '145°F / 63°C');
});

test('compact catalogue keeps source ratios for active detail choices', () => {
  const chickenBoneIn = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/breast/bone-in')), '1000');
  const chickenBoneless = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/breast/boneless')), '1000');
  const ribeyeBoneIn = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/ribeye/bone-in/medium-rare')), '1000');
  const ribeyeBoneless = getSinglePageViewModel(resolveSelection(parseRoute('#/beef/ribeye/boneless/medium-rare')), '1000');

  assert.equal(chickenBoneIn.dryBrine.ratios.recommended, 1.1);
  assert.equal(chickenBoneless.dryBrine.ratios.recommended, 1);
  assert.equal(ribeyeBoneIn.dryBrine.ratios.recommended, 1);
  assert.equal(ribeyeBoneless.dryBrine.ratios.recommended, 1.1);
});

test('resolved selections are complete even when the source hash is partial', () => {
  const model = getSinglePageViewModel(resolveSelection(parseRoute('#/chicken/thigh')), '1500');

  assert.equal(model.selectionComplete, true);
  assert.equal(model.weight.status, 'valid');
  assert.ok(model.result);
});

test('legacy preparation hashes resolve once to the canonical selection', () => {
  const parsed = parseRoute('#/chicken/whole/dry-brine');
  const resolved = resolveSelection(parsed);

  assert.equal(parsed.legacyPreparation, true);
  assert.equal(resolved.hash, '#/chicken/whole/whole/cook-through');
});

test('rapid calculator updates keep only the latest derived state', () => {
  const selection = resolveSelection(parseRoute('#/chicken/whole'));
  const weights = ['1200', '1750', '2200', '950', '750,5'];
  const models = weights.map((weight) => getSinglePageViewModel(selection, weight));
  const latest = models.at(-1);

  assert.equal(latest.weight.status, 'valid');
  assert.deepEqual(latest.result, {
    recommended: 8.2555,
    min: 8.2555,
    max: 8.2555,
  });
  assert.equal(models.at(-2).result.recommended, 10.45);
});

test('not-found recovery returns a valid home title', () => {
  const notFound = parseRoute('#/unknown');
  const home = parseRoute('#/');

  assert.equal(notFound.kind, 'not-found');
  assert.equal(home.kind, 'home');
  assert.equal(getRouteTitle(home), 'Kitchen Constants');
});

test('active route choices have accessible labels and destinations', () => {
  const routes = [
    parseRoute('#/'),
    parseRoute('#/chicken'),
    parseRoute('#/chicken/breast'),
    parseRoute('#/beef/steak/bone-in'),
  ];

  for (const route of routes) {
    const activeChoices = getRouteChoices(route).filter((choice) => choice.kind === 'active');
    assert.ok(activeChoices.length > 0, route.kind);
    for (const choice of activeChoices) {
      assert.ok(choice.label.trim().length > 0);
      assert.match(choice.href, /^#\//);
    }
  }
});

test('error and result states are mutually exclusive', () => {
  const selection = resolveSelection(parseRoute('#/chicken/whole'));
  const invalid = getSinglePageViewModel(selection, '12kg');
  const valid = getSinglePageViewModel(selection, '1200');

  assert.equal(invalid.weight.status, 'invalid-format');
  assert.equal(invalid.result, null);
  assert.equal(valid.weight.status, 'valid');
  assert.ok(valid.result);
});

test('unreviewed tender cuts keep a stable pending temperature state', () => {
  const hashes = [
    '#/beef/ribs/bone-in/tender',
    '#/pork/ribs/bone-in/tender',
    '#/lamb/shoulder/bone-in/tender',
  ];

  for (const hash of hashes) {
    const model = getSinglePageViewModel(resolveSelection(parseRoute(hash)), '1500');

    assert.equal(model.selectionComplete, true, hash);
    assert.equal(model.internalTemperature.contentStatus, 'needs-review', hash);
    assert.equal(model.internalTemperature.targetInternalTemperature, null, hash);
  }
});
