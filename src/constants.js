function sourceRatio(recommended) {
  return Object.freeze({
    min: recommended,
    recommended,
    max: recommended,
  });
}

const SOURCE_RATIOS = Object.freeze({
  chickenWhole: sourceRatio(1.1),
  chickenBoneless: sourceRatio(1),
  chickenBoneIn: sourceRatio(1.1),
  chickenGround: sourceRatio(0.75),
  beefBonelessSteak: sourceRatio(1.1),
  beefBoneInSteak: sourceRatio(1),
  beefRibs: sourceRatio(0.9),
  beefGround8020: sourceRatio(1.15),
  beefGround9010: sourceRatio(0.9),
  porkBoneless: sourceRatio(1),
  porkRibs: sourceRatio(1.1),
  porkGround: sourceRatio(1.25),
  porkBelly: sourceRatio(1.3),
  lambBoneless: sourceRatio(1),
  lambBoneIn: sourceRatio(0.9),
  scallops: sourceRatio(0.9),
  shrimp: sourceRatio(0.65),
  fish: sourceRatio(0.75),
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
  lambMediumRare: Object.freeze({
    target: '130–135°F / 54–57°C',
    note: 'Pull about 5°F / 2°C early for chops and 10–12°F / 5–6°C early for larger roasts, then rest to the target.',
    safety: 'USDA whole-cut baseline: 145°F / 63°C with at least 3 minutes of rest.',
    reviewedOn: '2026-07-23',
  }),
  lambMedium: Object.freeze({
    target: '135–145°F / 57–63°C',
    note: 'Pull about 5°F / 2°C early for chops and 10–12°F / 5–6°C early for larger roasts, then rest to the target.',
    safety: 'USDA whole-cut baseline: 145°F / 63°C with at least 3 minutes of rest.',
    reviewedOn: '2026-07-23',
  }),
  pork: Object.freeze({
    target: '145°F / 63°C',
    note: 'Rest for at least 3 minutes before slicing.',
    safety: 'USDA minimum: 145°F / 63°C with at least 3 minutes of rest.',
  }),
  groundPoultry: Object.freeze({
    target: '165°F / 74°C',
    note: 'Check the center of the thickest part with a food thermometer.',
    safety: 'USDA minimum: 165°F / 74°C for ground poultry.',
    source: USDA_TEMPERATURE_SOURCE,
  }),
  groundMeat: Object.freeze({
    target: '160°F / 71°C',
    note: 'Check the center of the thickest part with a food thermometer.',
    safety: 'USDA minimum: 160°F / 71°C for ground beef and pork.',
    source: USDA_TEMPERATURE_SOURCE,
  }),
  seafood: Object.freeze({
    target: '145°F / 63°C',
    note: 'Check the thickest part with a food thermometer.',
    safety: 'USDA minimum: 145°F / 63°C for fish and shellfish.',
    source: USDA_TEMPERATURE_SOURCE,
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
    source: guidance.source ?? CHEF_TEMPERATURE_SOURCE,
    safetySource: USDA_TEMPERATURE_SOURCE,
    reviewedOn: guidance.reviewedOn ?? '2026-07-20',
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
  ratios: SOURCE_RATIOS.chickenWhole,
  contentStatus: 'candidate',
  source: null,
  methodology: 'culinary-references-and-home-testing',
  reviewedOn: '2026-07-20',
  targetInternalTemperature: null,
  timing: 'Refrigerate uncovered for at least 4 hours; overnight is ideal for crisper skin.',
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

function dryBrineContent(id, ratios, timing = 'Refrigerate for at least 1 hour; overnight is ideal.') {
  return Object.freeze({
    ...placeholderContent(id, 'Dry brine'),
    percentageBasis: 'protein-weight',
    ratios,
    contentStatus: 'candidate',
    source: null,
    methodology: 'culinary-references-and-home-testing',
    reviewedOn: '2026-07-20',
    timing,
  });
}

function typeRecord({
  slug,
  label,
  details = null,
  variants = [],
  doneness = [],
  defaultDetail = { slug: 'standard', label: 'Standard' },
  defaultDoneness = { slug: 'recommended', label: 'Recommended' },
  dryBrineId,
  ratios = null,
  ratiosByVariant = {},
  ratiosByDetail = ratiosByVariant,
  temperature,
  temperaturesByDoneness = {},
  timing,
}) {
  const temperatureId = `${dryBrineId}-temperature`;
  const detailOptions = details ?? (variants.length ? variants : [defaultDetail]);
  const donenessOptions = doneness.length ? doneness : [defaultDoneness];
  const baseDryBrine = dryBrineId === WHOLE_CHICKEN_DRY_BRINE.id
    ? WHOLE_CHICKEN_DRY_BRINE
    : ratios
      ? dryBrineContent(dryBrineId, ratios, timing)
      : DRY_BRINE_PLACEHOLDER(dryBrineId);

  return Object.freeze({
    slug,
    label,
    details: Object.freeze(detailOptions.map((detail) => Object.freeze({ slug: detail.slug, label: detail.label }))),
    doneness: Object.freeze(donenessOptions.map((option) => Object.freeze({ slug: option.slug, label: option.label }))),
    dryBrine: baseDryBrine,
    dryBrineByDetail: Object.freeze(Object.fromEntries(
      Object.entries(ratiosByDetail).map(([detailSlug, detailRatios]) => [
        detailSlug,
        dryBrineContent(`${dryBrineId}-${detailSlug}`, detailRatios, timing),
      ]),
    )),
    internalTemperature: temperatureContent(temperatureId, temperature),
    temperaturesByDoneness: Object.freeze(Object.fromEntries(
      Object.entries(temperaturesByDoneness).map(([donenessSlug, guidance]) => [
        donenessSlug,
        temperatureContent(`${temperatureId}-${donenessSlug}`, guidance),
      ]),
    )),
  });
}

// Retained only as a temporary compatibility reference while the compact
// catalogue below is adopted by the navigation model.
const LEGACY_MEAT_CATALOG = Object.freeze([
  Object.freeze({
    slug: 'chicken',
    label: 'Chicken',
    types: Object.freeze([
      typeRecord({
        slug: 'whole',
        label: 'Whole chicken',
        dryBrineId: WHOLE_CHICKEN_DRY_BRINE.id,
        ratios: SOURCE_RATIOS.chickenWhole,
        temperature: CHEF_TEMPERATURES.chickenWhole,
      }),
      typeRecord({
        slug: 'breast',
        label: 'Breast',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        dryBrineId: 'chicken-breast-dry-brine',
        ratios: SOURCE_RATIOS.chickenBoneless,
        ratiosByVariant: {
          'bone-in': SOURCE_RATIOS.chickenBoneIn,
          boneless: SOURCE_RATIOS.chickenBoneless,
        },
        temperature: CHEF_TEMPERATURES.chickenBreast,
      }),
      typeRecord({
        slug: 'thigh',
        label: 'Thigh',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        dryBrineId: 'chicken-thigh-dry-brine',
        ratios: SOURCE_RATIOS.chickenBoneless,
        ratiosByVariant: {
          'bone-in': SOURCE_RATIOS.chickenBoneIn,
          boneless: SOURCE_RATIOS.chickenBoneless,
        },
        temperature: CHEF_TEMPERATURES.chickenThigh,
      }),
      typeRecord({
        slug: 'ground',
        label: 'Ground poultry',
        dryBrineId: 'chicken-ground-dry-brine',
        ratios: SOURCE_RATIOS.chickenGround,
        temperature: CHEF_TEMPERATURES.groundPoultry,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
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
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        ratiosByVariant: {
          'bone-in': SOURCE_RATIOS.beefBoneInSteak,
          boneless: SOURCE_RATIOS.beefBonelessSteak,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'sirloin',
        label: 'Sirloin',
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-sirloin-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'ribeye',
        label: 'Ribeye',
        variants: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-ribeye-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        ratiosByVariant: {
          'bone-in': SOURCE_RATIOS.beefBoneInSteak,
          boneless: SOURCE_RATIOS.beefBonelessSteak,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 't-bone',
        label: 'T-bone / Porterhouse',
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-t-bone-dry-brine',
        ratios: SOURCE_RATIOS.beefBoneInSteak,
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'strip',
        label: 'Strip steak',
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-strip-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'filet',
        label: 'Filet / Tenderloin',
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-filet-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'ribs',
        label: 'Beef ribs',
        dryBrineId: 'beef-ribs-dry-brine',
        ratios: SOURCE_RATIOS.beefRibs,
        timing: 'Refrigerate for at least 4 hours; overnight is ideal.',
      }),
      typeRecord({
        slug: 'ground-80-20',
        label: 'Ground 80/20',
        dryBrineId: 'beef-ground-80-20-dry-brine',
        ratios: SOURCE_RATIOS.beefGround8020,
        temperature: CHEF_TEMPERATURES.groundMeat,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
      }),
      typeRecord({
        slug: 'ground-90-10',
        label: 'Ground 90/10',
        dryBrineId: 'beef-ground-90-10-dry-brine',
        ratios: SOURCE_RATIOS.beefGround9010,
        temperature: CHEF_TEMPERATURES.groundMeat,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
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
        ratios: SOURCE_RATIOS.porkBoneless,
        ratiosByVariant: {
          'bone-in': SOURCE_RATIOS.porkRibs,
          boneless: SOURCE_RATIOS.porkBoneless,
        },
        temperature: CHEF_TEMPERATURES.pork,
      }),
      typeRecord({
        slug: 'tenderloin',
        label: 'Tenderloin',
        dryBrineId: 'pork-tenderloin-dry-brine',
        ratios: SOURCE_RATIOS.porkBoneless,
        temperature: CHEF_TEMPERATURES.pork,
      }),
      typeRecord({ slug: 'ribs', label: 'Ribs', dryBrineId: 'pork-ribs-dry-brine', ratios: SOURCE_RATIOS.porkRibs, timing: 'Refrigerate for at least 4 hours; overnight is ideal.' }),
      typeRecord({ slug: 'ground', label: 'Ground pork', dryBrineId: 'pork-ground-dry-brine', ratios: SOURCE_RATIOS.porkGround, temperature: CHEF_TEMPERATURES.groundMeat, timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.' }),
      typeRecord({ slug: 'belly', label: 'Pork belly', dryBrineId: 'pork-belly-dry-brine', ratios: SOURCE_RATIOS.porkBelly, timing: 'Refrigerate for at least 4 hours; overnight is ideal.' }),
    ]),
  }),
  Object.freeze({
    slug: 'lamb',
    label: 'Lamb',
    types: Object.freeze([
      typeRecord({ slug: 'boneless', label: 'Boneless lamb', dryBrineId: 'lamb-boneless-dry-brine', ratios: SOURCE_RATIOS.lambBoneless }),
      typeRecord({ slug: 'bone-in', label: 'Bone-in lamb', dryBrineId: 'lamb-bone-in-dry-brine', ratios: SOURCE_RATIOS.lambBoneIn }),
    ]),
  }),
  Object.freeze({
    slug: 'seafood',
    label: 'Seafood',
    types: Object.freeze([
      typeRecord({ slug: 'scallops', label: 'Scallops', dryBrineId: 'seafood-scallops-dry-brine', ratios: SOURCE_RATIOS.scallops, temperature: CHEF_TEMPERATURES.seafood, timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.' }),
      typeRecord({ slug: 'shrimp', label: 'Shrimp', dryBrineId: 'seafood-shrimp-dry-brine', ratios: SOURCE_RATIOS.shrimp, temperature: CHEF_TEMPERATURES.seafood, timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.' }),
      typeRecord({ slug: 'fish', label: 'Fish', dryBrineId: 'seafood-fish-dry-brine', ratios: SOURCE_RATIOS.fish, temperature: CHEF_TEMPERATURES.seafood, timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.' }),
    ]),
  }),
]);

export const FUTURE_CATEGORIES = Object.freeze([
  Object.freeze({ slug: 'fish', label: 'Fish' }),
  Object.freeze({ slug: 'eggs', label: 'Eggs' }),
  Object.freeze({ slug: 'brines', label: 'Brines & marinades' }),
  Object.freeze({ slug: 'pasta', label: 'Pasta & dough' }),
]);

export const MEAT_CATALOG = Object.freeze([
  Object.freeze({
    slug: 'chicken',
    label: 'Chicken',
    types: Object.freeze([
      typeRecord({
        slug: 'whole',
        label: 'Whole chicken',
        details: [{ slug: 'whole', label: 'Whole' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: WHOLE_CHICKEN_DRY_BRINE.id,
        ratios: SOURCE_RATIOS.chickenWhole,
        temperature: CHEF_TEMPERATURES.chickenWhole,
      }),
      typeRecord({
        slug: 'breast',
        label: 'Breast',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'chicken-breast-dry-brine',
        ratios: SOURCE_RATIOS.chickenBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.chickenBoneIn,
          boneless: SOURCE_RATIOS.chickenBoneless,
        },
        temperature: CHEF_TEMPERATURES.chickenBreast,
      }),
      typeRecord({
        slug: 'thigh',
        label: 'Thigh',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'tender', label: 'Tender' }],
        dryBrineId: 'chicken-thigh-dry-brine',
        ratios: SOURCE_RATIOS.chickenBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.chickenBoneIn,
          boneless: SOURCE_RATIOS.chickenBoneless,
        },
        temperature: CHEF_TEMPERATURES.chickenThigh,
      }),
      typeRecord({
        slug: 'ground',
        label: 'Ground poultry',
        details: [{ slug: 'ground', label: 'Ground' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'chicken-ground-dry-brine',
        ratios: SOURCE_RATIOS.chickenGround,
        temperature: CHEF_TEMPERATURES.groundPoultry,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
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
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-steak-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.beefBoneInSteak,
          boneless: SOURCE_RATIOS.beefBonelessSteak,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'ribeye',
        label: 'Ribeye',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'beef-ribeye-dry-brine',
        ratios: SOURCE_RATIOS.beefBonelessSteak,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.beefBoneInSteak,
          boneless: SOURCE_RATIOS.beefBonelessSteak,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.beefMediumRare,
          medium: CHEF_TEMPERATURES.beefMedium,
        },
      }),
      typeRecord({
        slug: 'ribs',
        label: 'Beef ribs',
        details: [{ slug: 'bone-in', label: 'Bone-in' }],
        doneness: [{ slug: 'tender', label: 'Tender' }],
        dryBrineId: 'beef-ribs-dry-brine',
        ratios: SOURCE_RATIOS.beefRibs,
        timing: 'Refrigerate for at least 4 hours; overnight is ideal.',
      }),
      typeRecord({
        slug: 'ground-80-20',
        label: 'Ground 80/20',
        details: [{ slug: 'ground', label: 'Ground' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'beef-ground-80-20-dry-brine',
        ratios: SOURCE_RATIOS.beefGround8020,
        temperature: CHEF_TEMPERATURES.groundMeat,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
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
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'recommended', label: 'Recommended' }],
        dryBrineId: 'pork-chop-dry-brine',
        ratios: SOURCE_RATIOS.porkBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.porkRibs,
          boneless: SOURCE_RATIOS.porkBoneless,
        },
        temperature: CHEF_TEMPERATURES.pork,
      }),
      typeRecord({
        slug: 'tenderloin',
        label: 'Tenderloin',
        details: [{ slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'recommended', label: 'Recommended' }],
        dryBrineId: 'pork-tenderloin-dry-brine',
        ratios: SOURCE_RATIOS.porkBoneless,
        temperature: CHEF_TEMPERATURES.pork,
      }),
      typeRecord({
        slug: 'ribs',
        label: 'Ribs',
        details: [{ slug: 'bone-in', label: 'Bone-in' }],
        doneness: [{ slug: 'tender', label: 'Tender' }],
        dryBrineId: 'pork-ribs-dry-brine',
        ratios: SOURCE_RATIOS.porkRibs,
        timing: 'Refrigerate for at least 4 hours; overnight is ideal.',
      }),
      typeRecord({
        slug: 'ground',
        label: 'Ground pork',
        details: [{ slug: 'ground', label: 'Ground' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'pork-ground-dry-brine',
        ratios: SOURCE_RATIOS.porkGround,
        temperature: CHEF_TEMPERATURES.groundMeat,
        timing: 'Mix in the salt just before shaping; rest in the refrigerator for 30 minutes if convenient, then cook promptly.',
      }),
    ]),
  }),
  Object.freeze({
    slug: 'lamb',
    label: 'Lamb',
    types: Object.freeze([
      typeRecord({
        slug: 'chops',
        label: 'Chops',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'lamb-chops-dry-brine',
        ratios: SOURCE_RATIOS.lambBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.lambBoneIn,
          boneless: SOURCE_RATIOS.lambBoneless,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.lambMediumRare,
          medium: CHEF_TEMPERATURES.lambMedium,
        },
      }),
      typeRecord({
        slug: 'leg',
        label: 'Leg',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'lamb-leg-dry-brine',
        ratios: SOURCE_RATIOS.lambBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.lambBoneIn,
          boneless: SOURCE_RATIOS.lambBoneless,
        },
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.lambMediumRare,
          medium: CHEF_TEMPERATURES.lambMedium,
        },
      }),
      typeRecord({
        slug: 'rack',
        label: 'Rack',
        details: [{ slug: 'bone-in', label: 'Bone-in' }],
        doneness: [{ slug: 'medium-rare', label: 'Medium-rare' }, { slug: 'medium', label: 'Medium' }],
        dryBrineId: 'lamb-rack-dry-brine',
        ratios: SOURCE_RATIOS.lambBoneIn,
        temperaturesByDoneness: {
          'medium-rare': CHEF_TEMPERATURES.lambMediumRare,
          medium: CHEF_TEMPERATURES.lambMedium,
        },
      }),
      typeRecord({
        slug: 'shoulder',
        label: 'Shoulder',
        details: [{ slug: 'bone-in', label: 'Bone-in' }, { slug: 'boneless', label: 'Boneless' }],
        doneness: [{ slug: 'tender', label: 'Tender' }],
        dryBrineId: 'lamb-shoulder-dry-brine',
        ratios: SOURCE_RATIOS.lambBoneless,
        ratiosByDetail: {
          'bone-in': SOURCE_RATIOS.lambBoneIn,
          boneless: SOURCE_RATIOS.lambBoneless,
        },
        timing: 'Refrigerate for at least 4 hours; overnight is ideal.',
      }),
    ]),
  }),
  Object.freeze({
    slug: 'seafood',
    label: 'Seafood',
    types: Object.freeze([
      typeRecord({
        slug: 'scallops',
        label: 'Scallops',
        details: [{ slug: 'shucked', label: 'Shucked' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'seafood-scallops-dry-brine',
        ratios: SOURCE_RATIOS.scallops,
        temperature: CHEF_TEMPERATURES.seafood,
        timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.',
      }),
      typeRecord({
        slug: 'shrimp',
        label: 'Shrimp',
        details: [{ slug: 'peeled', label: 'Peeled' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'seafood-shrimp-dry-brine',
        ratios: SOURCE_RATIOS.shrimp,
        temperature: CHEF_TEMPERATURES.seafood,
        timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.',
      }),
      typeRecord({
        slug: 'fish',
        label: 'Fish',
        details: [{ slug: 'fillet', label: 'Fillet' }],
        doneness: [{ slug: 'cook-through', label: 'Cook through' }],
        dryBrineId: 'seafood-fish-dry-brine',
        ratios: SOURCE_RATIOS.fish,
        temperature: CHEF_TEMPERATURES.seafood,
        timing: 'Keep chilled for 30 minutes to 1 hour, then cook promptly.',
      }),
    ]),
  }),
]);

export const PASTA_CATALOG = Object.freeze([
  Object.freeze({
    slug: 'pasta',
    label: 'Pasta & Noodles',
    styles: Object.freeze([
      Object.freeze({
        slug: 'fresh-egg',
        label: 'Fresh egg pasta',
        inputLabel: 'Flour weight',
        liquidLabel: 'Beaten egg',
        hydration: 50,
        ratioDisplay: '1 egg / 100 g',
        ratioLabel: 'flour starting point',
        rest: 'Rest for at least 30 minutes so the dough relaxes before rolling.',
        finish: 'Start checking after 1–2 minutes in boiling water.',
        note: 'Weigh the beaten egg when you want the dough to scale cleanly.',
        source: 'https://pastaevangelists.com/blogs/blog/how-to-make-homemade-pasta',
        sourceLabel: 'Fresh pasta ratio reference',
      }),
      Object.freeze({
        slug: 'chinese-hand-cut',
        label: 'Chinese hand-cut noodles',
        inputLabel: 'Flour weight',
        liquidLabel: 'Water',
        hydration: 48,
        ratioDisplay: '48%',
        ratioLabel: 'hydration starting point',
        rest: 'Rest for at least 30 minutes; a longer rest makes the dough easier to roll.',
        finish: 'Cut to the thickness you want, then cook until tender; thin noodles take only a few minutes.',
        note: 'A firm dough gives hand-cut noodles their springy bite. Flour and humidity can shift the water slightly.',
        source: 'https://omnivorescookbook.com/fresh-homemade-noodles/',
        sourceLabel: 'Chinese noodle ratio reference',
      }),
      Object.freeze({
        slug: 'dumpling-wrappers',
        label: 'Dumpling wrappers',
        inputLabel: 'Flour weight',
        liquidLabel: 'Water',
        hydration: 52,
        ratioDisplay: '52%',
        ratioLabel: 'hydration starting point',
        rest: 'Rest covered for 30 minutes, knead again, then rest until relaxed before rolling.',
        finish: 'Roll each piece thin at the edges and slightly thicker in the centre so it seals without tearing.',
        note: 'This is a cold-water wrapper dough for jiaozi. Flour protein changes how much water the dough needs.',
        source: 'https://redhousespice.com/homemade-dumpling-wrappers/',
        sourceLabel: 'Dumpling wrapper ratio reference',
      }),
    ]),
  }),
]);

export const CATEGORY_CATALOG = Object.freeze([
  Object.freeze({ slug: 'meat', label: 'Meat', kind: 'meat' }),
  Object.freeze({
    slug: 'pasta',
    label: 'Pasta & Noodles',
    kind: 'pasta',
    styles: PASTA_CATALOG[0].styles,
  }),
]);
