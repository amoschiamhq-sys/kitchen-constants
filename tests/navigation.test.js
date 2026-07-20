import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getBreadcrumbs,
  getPreparationViewModel,
  getSinglePageViewModel,
  getRouteChoices,
  getRouteTitle,
  parentRoute,
  parseRoute,
  routeToHash,
  selectionKey,
} from '../src/navigation.js';

test('parseRoute maps the multi-meat paths to their route states', () => {
  assert.equal(parseRoute('#/').kind, 'home');
  assert.equal(parseRoute('#/chicken').kind, 'meat');
  assert.equal(parseRoute('#/chicken/whole').kind, 'cut');
  assert.equal(parseRoute('#/chicken/breast/bone-in').kind, 'variant');
  assert.equal(parseRoute('#/beef/roast/medium-rare').kind, 'doneness');
  assert.equal(parseRoute('#/beef/steak/bone-in/medium-rare').kind, 'doneness');
  assert.equal(parseRoute('#/chicken/whole/dry-brine').kind, 'preparation');
  assert.equal(parseRoute('#/chicken/breast/boneless/dry-brine').kind, 'preparation');
  assert.equal(parseRoute('#/beef/steak/bone-in/medium/ dry-brine').kind, 'not-found');
  assert.equal(parseRoute('#/beef/steak/bone-in/medium/dry-brine').kind, 'preparation');
});

test('parseRoute maps unknown and malformed hashes to not-found', () => {
  for (const hash of ['#/fish', '#/chicken/wing', '#/chicken/whole/bone-in', '#/beef/steak/medium']) {
    assert.equal(parseRoute(hash).kind, 'not-found', hash);
  }
});

test('route parent mapping returns the correct selection step', () => {
  const steakResult = parseRoute('#/beef/steak/bone-in/medium-rare/dry-brine');
  const breastResult = parseRoute('#/chicken/breast/boneless/dry-brine');
  const roastDoneness = parseRoute('#/beef/roast/medium');

  assert.equal(parentRoute(steakResult).hash, '#/beef/steak/bone-in/medium-rare');
  assert.equal(parentRoute(breastResult).hash, '#/chicken/breast/boneless');
  assert.equal(parentRoute(roastDoneness).hash, '#/beef/roast');
});

test('route parsing and hash generation are idempotent', () => {
  const original = parseRoute('#/chicken/thigh/bone-in/dry-brine');
  const reparsed = parseRoute(routeToHash(original));

  assert.equal(routeToHash(reparsed), '#/chicken/thigh/bone-in/dry-brine');
  assert.equal(selectionKey(original), selectionKey(reparsed));
});

test('route choices expose the three working meats and their types', () => {
  const homeChoices = getRouteChoices(parseRoute('#/'));
  const beefChoices = getRouteChoices(parseRoute('#/beef'));

  assert.deepEqual(homeChoices.slice(0, 3).map((choice) => choice.label), ['Chicken', 'Beef', 'Pork']);
  assert.deepEqual(beefChoices.map((choice) => choice.label), ['Steak', 'Roast']);
  assert.ok(homeChoices.slice(3).every((choice) => choice.kind === 'inert'));
});

test('whole chicken does not offer a bone-in or boneless step', () => {
  const choices = getRouteChoices(parseRoute('#/chicken/whole'));

  assert.deepEqual(choices.map((choice) => choice.label), ['Dry brine', 'Internal temperature']);
  assert.ok(choices.every((choice) => !choice.label.includes('Bone')));
});

test('conditional variant and doneness choices appear only where applicable', () => {
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
    ['Dry brine', 'Internal temperature'],
  );
});

test('dry-brine view model exposes confirmed constants before weight input', () => {
  const viewModel = getPreparationViewModel(parseRoute('#/chicken/whole/dry-brine'));

  assert.equal(viewModel.contentStatus, 'needs-review');
  assert.deepEqual(viewModel.content.ratios, { min: 0.9, recommended: 1.1, max: 1.3 });
  assert.deepEqual(viewModel.weight, { status: 'empty' });
  assert.equal(viewModel.result, null);
});

test('whole-chicken dry-brine view model calculates without stale output', () => {
  const route = parseRoute('#/chicken/whole/dry-brine');
  const valid = getPreparationViewModel(route, '1500');
  const invalid = getPreparationViewModel(route, '12kg');

  assert.deepEqual(valid.result, { recommended: 16.5, min: 13.5, max: 19.5 });
  assert.equal(invalid.result, null);
  assert.equal(invalid.weight.status, 'invalid-format');
});

test('single-page whole-chicken selection keeps salt and temperature together', () => {
  const route = parseRoute('#/chicken/whole');
  const model = getSinglePageViewModel(route, '1500');

  assert.equal(model.selectionComplete, true);
  assert.equal(model.dryBrine.preparation, 'Dry brine');
  assert.equal(model.internalTemperature.preparation, 'internal-temperature');
  assert.equal(model.internalTemperature.contentStatus, 'reviewed');
  assert.equal(model.internalTemperature.targetInternalTemperature, '165°F / 74°C');
  assert.deepEqual(model.result, { recommended: 16.5, min: 13.5, max: 19.5 });
});

test('single-page chef temperatures follow the selected beef doneness', () => {
  const mediumRare = getSinglePageViewModel(parseRoute('#/beef/steak/bone-in/medium-rare'));
  const medium = getSinglePageViewModel(parseRoute('#/beef/steak/bone-in/medium'));

  assert.equal(mediumRare.internalTemperature.targetInternalTemperature, '130–135°F / 54–57°C');
  assert.equal(medium.internalTemperature.targetInternalTemperature, '135–145°F / 57–63°C');
  assert.match(mediumRare.internalTemperature.safety, /145°F/);
});

test('single-page selections wait for required detail before showing results', () => {
  const route = parseRoute('#/chicken/thigh');
  const model = getSinglePageViewModel(route, '1500');

  assert.equal(model.selectionComplete, false);
  assert.equal(model.result, null);
  assert.equal(model.weight.status, 'valid');
});

test('rapid calculator updates keep only the latest derived state', () => {
  const route = parseRoute('#/chicken/whole/dry-brine');
  const weights = ['1200', '1750', '2200', '950', '750,5'];
  const models = weights.map((weight) => getPreparationViewModel(route, weight));
  const latest = models.at(-1);

  assert.equal(latest.weight.status, 'valid');
  assert.deepEqual(latest.result, {
    recommended: 8.2555,
    min: 6.7545,
    max: 9.7565,
  });
  assert.equal(models.at(-2).result.recommended, 10.45);
});

test('not-found recovery returns a valid home render model', () => {
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
    parseRoute('#/beef/steak/bone-in/medium'),
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
  const route = parseRoute('#/chicken/whole/dry-brine');
  const invalid = getPreparationViewModel(route, '12kg');
  const valid = getPreparationViewModel(route, '1200');

  assert.equal(invalid.weight.status, 'invalid-format');
  assert.equal(invalid.result, null);
  assert.equal(valid.weight.status, 'valid');
  assert.ok(valid.result);
});

test('unreviewed paths expose placeholders rather than invented culinary values', () => {
  const breast = getPreparationViewModel(parseRoute('#/chicken/breast/boneless/dry-brine'), '1500');

  assert.equal(breast.contentStatus, 'needs-review');
  assert.equal(breast.content.ratios, null);
  assert.equal(breast.result, null);
});

test('breadcrumbs provide direct Change links for each prior decision', () => {
  const crumbs = getBreadcrumbs(parseRoute('#/beef/steak/bone-in/medium-rare/dry-brine'));

  assert.deepEqual(crumbs.map((crumb) => crumb.label), [
    'Home', 'Beef', 'Steak', 'Bone-in', 'Medium-rare', 'Dry brine',
  ]);
  assert.equal(crumbs[2].href, '#/beef/steak');
  assert.equal(crumbs[4].href, '#/beef/steak/bone-in/medium-rare');
});
