const DRY_BRINE_RATIOS = Object.freeze({
  min: 0.9,
  recommended: 1.1,
  max: 1.3,
});

const CHEF_TEMPERATURE_SOURCE = 'https://blog.thermoworks.com/chef-recommended-tw-approved/';
const USDA_TEMPERATURE_SOURCE = 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart';

const CHEF_TEMPERATURES = Object.freeze({
  chickenWhole: Object.freeze({
    target: '165°F / 74°C',
    note: 'Check the thickest part of the breast and thigh. Dark meat is often more tender at 170–175°F / 77–79°C.',
    safety: 'USDA minimum: 165°F / 74°C for all poultry.',
  }),
  chickenBreast: Object.freeze({
    target: '165°F / 74°C',
    note: 'Check the thickest part of the breast with the probe centered in the meat.',
    safety: 'USDA minimum: 165°F / 74°C for all poultry.',
  }),
  chickenThigh: Object.freeze({
    target: '170–175°F / 77–79°C',
    note: 'Dark meat is more tender in this range as connective tissue softens.',
    safety: 'USDA minimum: 165°F / 74°C for all poultry.',
  }),
  beefMediumRare: Object.freeze({
    target: '130–135°F / 54–57°C',
    note: 'Pull about 5–10°F / 2–5°C early and let the meat rise while resting.',
    safety: 'USDA whole-cut baseline: 145°F / 63°C with at least 3 minutes of rest.',
  }),
  beefMedium: Object.freeze({
    target: '135–145°F / 57–63°C',
    note: 'Pull about 5–10°F / 2–5°C early and let the meat rise while resting.',
    safety: 'USDA whole-cut baseline: 145°F / 63°C with at least 3 minutes of rest.',
  }),
  pork: Object.freeze({
    target: '145°F / 63°C',
    note: 'Rest for at least 3 minutes before slicing.',
    safety: 'USDA minimum: 145°F / 63°C with at least 3 minutes of rest.',
  }),
});

function temperatureContent(id, guidance) {
  if (!guidance) return placeholderContent(id, 'internal-temperature');
  return Object.freeze({
    ...placeholderContent(id, 'internal-temperature'),
    targetInternalTemperature: guidance.target,
    guidance: guidance.note,
    safety: guidance.safety,
    contentStatus: 'reviewed',
    source: CHEF_TEMPERATURE_SOURCE,
    safetySource: USDA_TEMPERATURE_SOURCE,
    reviewedOn: '2026-07-20',
  });
}

export const WHOLE_CHICKEN_DRY_BRINE = Object.freeze({
  id: 'chicken-whole-dry-brine',
  category: 'chicken',
  ingredient: 'Chicken',
  cut: 'Whole chicken',
  preparation: 'Dry brine',
  percentageBasis: 'chicken-weight',
  inputUnit: 'g',
  outputUnit: 'g',
  ratios: DRY_BRINE_RATIOS,
  contentStatus: 'needs-review',
  targetInternalTemperature: null,
});

function placeholderContent(id, preparation) {
  return Object.freeze({
    id,
    preparation,
    percentageBasis: null,
    inputUnit: 'g',
    outputUnit: 'g',
    ratios: null,
    contentStatus: 'needs-review',
    targetInternalTemperature: null,
  });
}

const DRY_BRINE_PLACEHOLDER = (id) => placeholderContent(id, 'dry-brine');
const TEMPERATURE_PLACEHOLDER = (id) => placeholderContent(id, 'internal-temperature');

function typeRecord({ slug, label, variants = [], doneness = [], dryBrineId, temperature, temperaturesByDoneness = {} }) {
  const temperatureId = `${dryBrineId}-temperature`;
  return Object.freeze({
    slug,
    label,
    variants: Object.freeze(variants.map((variant) => Object.freeze({ slug: variant.slug, label: variant.label }))),
    doneness: Object.freeze(doneness.map((option) => Object.freeze({ slug: option.slug, label: option.label }))),
    temperaturesByDoneness: Object.freeze(Object.fromEntries(
      Object.entries(temperaturesByDoneness).map(([donenessSlug, guidance]) => [
        donenessSlug,
        temperatureContent(`${temperatureId}-${donenessSlug}`, guidance),
      ]),
    )),
    preparations: Object.freeze([
      Object.freeze({
        slug: 'dry-brine',
        label: 'Dry brine',
        content: dryBrineId === WHOLE_CHICKEN_DRY_BRINE.id
          ? WHOLE_CHICKEN_DRY_BRINE
          : DRY_BRINE_PLACEHOLDER(dryBrineId),
      }),
      Object.freeze({
        slug: 'internal-temperature',
        label: 'Internal temperature',
        content: temperatureContent(temperatureId, temperature),
      }),
    ]),
  });
}

export const MEAT_CATALOG = Object.freeze([
  Object.freeze({
    slug: 'chicken',
    label: 'Chicken',
    types: Object.freeze([
      typeRecord({ slug: 'whole', label: 'Whole chicken', dryBrineId: WHOLE_CHICKEN_DRY_BRINE.id, temperature: CHEF_TEMPERATURES.chickenWhole }),
      typeRecord({
        slug: 'breast',
        label: 'Breast',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        dryBrineId: 'chicken-breast-dry-brine',
        temperature: CHEF_TEMPERATURES.chickenBreast,
      }),
      typeRecord({
        slug: 'thigh',
        label: 'Thigh',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        dryBrineId: 'chicken-thigh-dry-brine',
        temperature: CHEF_TEMPERATURES.chickenThigh,
      }),
    ]),
  }),
  Object.freeze({
    slug: 'beef',
    label: 'Beef',
    types: Object.freeze([
      typeRecord({
        slug: 'steak',
        label: 'Steak',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-steak-dry-brine',
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'roast',
        label: 'Roast',
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-roast-dry-brine',
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
    ]),
  }),
  Object.freeze({
    slug: 'pork',
    label: 'Pork',
    types: Object.freeze([
      typeRecord({
        slug: 'chop',
        label: 'Chop',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        dryBrineId: 'pork-chop-dry-brine',
        temperature: CHEF_TEMPERATURES.pork,
      }),
      typeRecord({ slug: 'tenderloin', label: 'Tenderloin', dryBrineId: 'pork-tenderloin-dry-brine', temperature: CHEF_TEMPERATURES.pork }),
    ]),
  }),
]);

export const FUTURE_CATEGORIES = Object.freeze([
  Object.freeze({ slug: 'fish', label: 'Fish' }),
  Object.freeze({ slug: 'eggs', label: 'Eggs' }),
  Object.freeze({ slug: 'brines', label: 'Brines & marinades' }),
  Object.freeze({ slug: 'pasta', label: 'Pasta & dough' }),
]);
