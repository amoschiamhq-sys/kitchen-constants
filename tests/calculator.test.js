import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalculationInputError,
  calculateDryBrine,
  formatGrams,
  parseWeight,
} from '../src/calculator.js';
import { WHOLE_CHICKEN_DRY_BRINE } from '../src/constants.js';

test('parseWeight returns empty for blank input', () => {
  assert.deepEqual(parseWeight(''), { status: 'empty' });
  assert.deepEqual(parseWeight('   '), { status: 'empty' });
});

test('parseWeight accepts integer grams', () => {
  assert.deepEqual(parseWeight('1500'), { status: 'valid', grams: 1500 });
});

test('parseWeight accepts one dot decimal separator', () => {
  assert.deepEqual(parseWeight('750.5'), { status: 'valid', grams: 750.5 });
});

test('parseWeight accepts one comma decimal separator', () => {
  assert.deepEqual(parseWeight('750,5'), { status: 'valid', grams: 750.5 });
});

test('parseWeight rejects letters, signs, exponent notation, and repeated separators', () => {
  for (const value of ['12kg', '-1', '+1', '1e3', '1.2.3', '1,2,3', '']) {
    if (value === '') continue;
    assert.deepEqual(parseWeight(value), { status: 'invalid-format' }, value);
  }
});

test('parseWeight rejects zero and values outside the supported range', () => {
  assert.deepEqual(parseWeight('0'), { status: 'out-of-range' });
  assert.deepEqual(parseWeight('0.09'), { status: 'out-of-range' });
  assert.deepEqual(parseWeight('1000000.1'), { status: 'out-of-range' });
});

test('parseWeight rejects non-string values as invalid format', () => {
  assert.deepEqual(parseWeight(null), { status: 'invalid-format' });
  assert.deepEqual(parseWeight(1500), { status: 'invalid-format' });
});

test('calculateDryBrine returns the reviewed whole-chicken ratio for 1500 grams', () => {
  assert.deepEqual(calculateDryBrine(1500, WHOLE_CHICKEN_DRY_BRINE.ratios), {
    recommended: 16.5,
    min: 16.5,
    max: 16.5,
  });
});

test('calculateDryBrine does not accumulate rounding across repeated calls', () => {
  const first = calculateDryBrine(333.33, WHOLE_CHICKEN_DRY_BRINE.ratios);
  const second = calculateDryBrine(333.33, WHOLE_CHICKEN_DRY_BRINE.ratios);

  assert.deepEqual(second, first);
  assert.equal(first.recommended, 333.33 * 1.1 / 100);
});

test('calculateDryBrine rejects invalid programmer preconditions', () => {
  assert.throws(
    () => calculateDryBrine(0, WHOLE_CHICKEN_DRY_BRINE.ratios),
    CalculationInputError,
  );
  assert.throws(
    () => calculateDryBrine(100, { min: 1.2, recommended: 1.1, max: 1.3 }),
    CalculationInputError,
  );
  assert.throws(
    () => calculateDryBrine(100, null),
    CalculationInputError,
  );
});

test('formatGrams always emits one decimal place', () => {
  const locale = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false,
  });

  assert.equal(formatGrams(16.5), locale.format(16.5));
  assert.equal(formatGrams(16), locale.format(16));
});

test('formatGrams rejects non-finite values', () => {
  assert.throws(() => formatGrams(Number.NaN), TypeError);
  assert.throws(() => formatGrams(Number.POSITIVE_INFINITY), TypeError);
});

test('canonical dry-brine ratios remain ordered and use chicken weight as their basis', () => {
  const { ratios } = WHOLE_CHICKEN_DRY_BRINE;

  assert.equal(WHOLE_CHICKEN_DRY_BRINE.id, 'chicken-whole-dry-brine');
  assert.equal(WHOLE_CHICKEN_DRY_BRINE.percentageBasis, 'chicken-weight');
  assert.equal(WHOLE_CHICKEN_DRY_BRINE.inputUnit, 'g');
  assert.equal(WHOLE_CHICKEN_DRY_BRINE.outputUnit, 'g');
  assert.ok(ratios.min <= ratios.recommended);
  assert.ok(ratios.recommended <= ratios.max);
  assert.deepEqual(ratios, { min: 1.1, recommended: 1.1, max: 1.1 });
});
