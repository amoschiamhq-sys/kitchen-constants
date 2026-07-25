const WEIGHT_PATTERN = /^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
const MIN_WEIGHT_GRAMS = 0.1;
const MAX_WEIGHT_GRAMS = 1_000_000;

export class CalculationInputError extends TypeError {}

export function parseWeight(rawValue) {
  if (typeof rawValue !== 'string') {
    return { status: 'invalid-format' };
  }

  const value = rawValue.trim();
  if (value === '') {
    return { status: 'empty' };
  }

  if (!WEIGHT_PATTERN.test(value)) {
    return { status: 'invalid-format' };
  }

  const grams = Number(value.replace(',', '.'));
  if (!Number.isFinite(grams)) {
    return { status: 'invalid-format' };
  }

  if (grams < MIN_WEIGHT_GRAMS || grams > MAX_WEIGHT_GRAMS) {
    return { status: 'out-of-range' };
  }

  return { status: 'valid', grams };
}

export function calculateDryBrine(weightGrams, ratios) {
  if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
    throw new CalculationInputError('Weight must be a finite positive number.');
  }

  if (!ratios || typeof ratios !== 'object') {
    throw new CalculationInputError('Ratios are required.');
  }

  const { min, recommended, max } = ratios;
  const values = [min, recommended, max];
  if (
    values.some((value) => !Number.isFinite(value) || value < 0)
    || min > recommended
    || recommended > max
  ) {
    throw new CalculationInputError('Ratios must be finite, non-negative, and ordered.');
  }

  return {
    recommended: normalizeCalculation(weightGrams * recommended / 100),
    min: normalizeCalculation(weightGrams * min / 100),
    max: normalizeCalculation(weightGrams * max / 100),
  };
}

export function calculateDoughRatio(flourWeightGrams, formula) {
  if (!Number.isFinite(flourWeightGrams) || flourWeightGrams <= 0) {
    throw new CalculationInputError('Flour weight must be a finite positive number.');
  }

  const hydrationPercent = typeof formula === 'number' ? formula : formula?.hydration;
  const saltPercent = typeof formula === 'number' ? 0 : formula?.salt ?? 0;
  const leavenPercent = typeof formula === 'number' ? undefined : formula?.leaven;
  const extraParts = typeof formula === 'number' ? undefined : formula?.extras;
  if (!Number.isFinite(hydrationPercent) || hydrationPercent < 0) {
    throw new CalculationInputError('Hydration must be a finite non-negative number.');
  }
  if (!Number.isFinite(saltPercent) || saltPercent < 0) {
    throw new CalculationInputError('Salt percentage must be a finite non-negative number.');
  }
  if (leavenPercent !== undefined && (!Number.isFinite(leavenPercent) || leavenPercent < 0)) {
    throw new CalculationInputError('Leaven percentage must be a finite non-negative number.');
  }
  if (extraParts !== undefined && !Array.isArray(extraParts)) {
    throw new CalculationInputError('Extra parts must be an array.');
  }
  const extras = extraParts?.map((part) => {
    if (!part || typeof part.slug !== 'string' || part.slug.trim() === ''
      || typeof part.label !== 'string' || part.label.trim() === ''
      || !Number.isFinite(part.percentage) || part.percentage < 0) {
      throw new CalculationInputError('Extra parts require a label and finite non-negative percentage.');
    }
    return {
      slug: part.slug,
      label: part.label,
      percentage: part.percentage,
      grams: normalizeCalculation(flourWeightGrams * part.percentage / 100),
    };
  });

  const result = {
    flour: normalizeCalculation(flourWeightGrams),
    liquid: normalizeCalculation(flourWeightGrams * hydrationPercent / 100),
    salt: normalizeCalculation(flourWeightGrams * saltPercent / 100),
    hydration: hydrationPercent,
    saltPercent,
  };
  if (leavenPercent !== undefined) {
    result.leaven = normalizeCalculation(flourWeightGrams * leavenPercent / 100);
    result.leavenPercent = leavenPercent;
  }
  if (extras !== undefined) result.extras = extras;
  return result;
}

function normalizeCalculation(value) {
  // Remove binary floating-point noise without rounding to the UI's one decimal place.
  return Number(value.toPrecision(15));
}

export function formatGrams(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('Grams must be finite.');
  }

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false,
  }).format(value);
}
