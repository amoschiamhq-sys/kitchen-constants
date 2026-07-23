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
  porkBoneless: sourceRatio(1),
  porkRibs: sourceRatio(1.1),
  porkGround: sourceRatio(1.25),
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
    target: '165\u00b0F / 74\u00b0C',
    note: 'Check the thickest part of the breast and thigh. Dark meat is often more tender at 170\u2013175\u00b0F / 77\u201379\u00b0C.',
    safety: 'USDA minimum: 165\u00b0F / 74\u00b0C for all poultry.',
  }),
  chickenBreast: Object.freeze({
    target: '165\u00b0F / 74\u00b0C',
    note: 'Check the thickest part of the breast with the probe centered in the meat.',
    safety: 'USDA minimum: 165\u00b0F / 74\u00b0C for all poultry.',
  }),
  chickenThigh: Object.freeze({
    target: '170\u2013175\u00b0F / 77\u201379\u00b0C',
    note: 'Dark meat is more tender in this range as connective tissue softens.',
    safety: 'USDA minimum: 165\u00b0F / 74\u00b0C for all poultry.',
  }),
  beefMediumRare: Object.freeze({
    target: '130\u2013135\u00b0F / 54\u201357\u00b0C',
    note: 'Pull about 5\u201310\u00b0F / 2\u20135\u00b0C early and let the meat rise while resting.',
    safety: 'USDA whole-cut baseline: 145\u00b0F / 63\u00b0C with at least 3 minutes of rest.',
  }),
  beefMedium: Object.freeze({
    target: '135\u2013145\u00b0F / 57\u201363\u00b0C',
    note: 'Pull about 5\u201310\u00b0F / 2\u20135\u00b0C early and let the meat rise while resting.',
    safety: 'USDA whole-cut baseline: 145\u00b0F / 63\u00b0C with at least 3 minutes of rest.',
  }),
  lambMediumRare: Object.freeze({
    target: '130\u2013135\u00b0F / 54\u201357\u00b0C',
    note: 'Pull about 5\u00b0F / 2\u00b0C early for chops and 10\u201312\u00b0F / 5\u20136\u00b0C early for larger roasts, then rest to the target.',
    safety: 'USDA whole-cut baseline: 145\u00b0F / 63\u00b0C with at least 3 minutes of rest.',
    reviewedOn: '2026-07-23',
  }),
  lambMedium: Object.freeze({
    target: '135\u2013145\u00b0F / 57\u201363\u00b0C',
    note: 'Pull about 5\u00b0F / 2\u00b0C early for chops and 10\u201312\u00b0F / 5\u20136\u00b0C early for larger roasts, then rest to the target.',
    safety: 'USDA whole-cut baseline: 145\u00b0F / 63\u00b0C with at least 3 minutes of rest.',
    reviewedOn: '2026-07-23',
  }),
  pork: Object.freeze({
    target: '145\u00b0F / 63\u00b0C',
    note: 'Rest for at least 3 minutes before slicing.',
    safety: 'USDA minimum: 145\u00b0F / 63\u00b0C with at least 3 minutes of rest.',
  }),
  groundPoultry: Object.freeze({
    target: '165\u00b0F / 74\u00b0C',
    note: 'Check the center of the thickest part with a food thermometer.',
    safety: 'USDA minimum: 165\u00b0F / 74\u00b0C for ground poultry.',
    source: USDA_TEMPERATURE_SOURCE,
  }),
  groundMeat: Object.freeze({
    target: '160\u00b0F / 71\u00b0C',
    note: 'Check the center of the thickest part with a food thermometer.',
    safety: 'USDA minimum: 160\u00b0F / 71\u00b0C for ground beef and pork.',
    source: USDA_TEMPERATURE_SOURCE,
  }),
  seafood: Object.freeze({
    target: '145\u00b0F / 63\u00b0C',
    note: 'Check the thickest part with a food thermometer.',
    safety: 'USDA minimum: 145\u00b0F / 63\u00b0C for fish and shellfish.',
    source: USDA_TEMPERATURE_SOURCE,
  }),
});

function timingRange(minimum, best) {
  return Object.freeze({ minimum, best });
}

const TIMING = Object.freeze({
  short: timingRange('At least 1 hour', '4 hours or overnight'),
  long: timingRange('At least 4 hours', 'Overnight'),
  seafood: timingRange('30 minutes', '1 hour'),
  ground: timingRange('Immediately before shaping', 'Up to 30 minutes for a firmer, better-bound texture'),
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
    timing: null,
  });
}

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
  cut: 'Whole bird',
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
  timing: TIMING.long,
});

function dryBrineContent(id, ratios, timing = TIMING.short) {
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
  details,
  doneness,
  dryBrineId,
  ratios = null,
  ratiosByDetail = {},
  temperature,
  temperaturesByDoneness = {},
  timing = TIMING.short,
}) {
  const temperatureId = `${dryBrineId}-temperature`;
  const baseDryBrine = dryBrineId === WHOLE_CHICKEN_DRY_BRINE.id
    ? WHOLE_CHICKEN_DRY_BRINE
    : ratios
      ? dryBrineContent(dryBrineId, ratios, timing)
      : placeholderContent(dryBrineId, 'Dry brine');

  return Object.freeze({
    slug,
    label,
    details: Object.freeze(details.map((detail) => Object.freeze({ ...detail }))),
    doneness: Object.freeze(doneness.map((option) => Object.freeze({ ...option }))),
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

const DETAIL = {
  whole: { slug: 'whole', label: 'Whole' },
  boneIn: { slug: 'bone-in', label: 'Bone-in' },
  boneless: { slug: 'boneless', label: 'Boneless' },
  ground: { slug: 'ground', label: 'Ground meat' },
  shucked: { slug: 'shucked', label: 'Shucked' },
  peeled: { slug: 'peeled', label: 'Peeled' },
  fillet: { slug: 'fillet', label: 'Fillet' },
};

const DONENESS = {
  cookThrough: { slug: 'cook-through', label: 'Cook through' },
  tender: { slug: 'tender', label: 'Tender' },
  mediumRare: { slug: 'medium-rare', label: 'Medium-rare' },
  medium: { slug: 'medium', label: 'Medium' },
  recommended: { slug: 'recommended', label: 'Recommended' },
};

export const MEAT_CATALOG = Object.freeze([
  Object.freeze({
    slug: 'chicken',
    label: 'Chicken',
    types: Object.freeze([
      typeRecord({ slug: 'whole', label: 'Whole bird', details: [DETAIL.whole], doneness: [DONENESS.cookThrough], dryBrineId: WHOLE_CHICKEN_DRY_BRINE.id, ratios: SOURCE_RATIOS.chickenWhole, temperature: CHEF_TEMPERATURES.chickenWhole, timing: TIMING.long }),
      typeRecord({ slug: 'breast', label: 'Breast', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.cookThrough], dryBrineId: 'chicken-breast-dry-brine', ratios: SOURCE_RATIOS.chickenBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.chickenBoneIn, boneless: SOURCE_RATIOS.chickenBoneless }, temperature: CHEF_TEMPERATURES.chickenBreast, timing: TIMING.short }),
      typeRecord({ slug: 'thigh', label: 'Thigh', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.tender], dryBrineId: 'chicken-thigh-dry-brine', ratios: SOURCE_RATIOS.chickenBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.chickenBoneIn, boneless: SOURCE_RATIOS.chickenBoneless }, temperature: CHEF_TEMPERATURES.chickenThigh, timing: TIMING.short }),
      typeRecord({ slug: 'ground', label: 'Ground meat', details: [DETAIL.ground], doneness: [DONENESS.cookThrough], dryBrineId: 'chicken-ground-dry-brine', ratios: SOURCE_RATIOS.chickenGround, temperature: CHEF_TEMPERATURES.groundPoultry, timing: TIMING.ground }),
    ]),
  }),
  Object.freeze({
    slug: 'beef',
    label: 'Beef',
    types: Object.freeze([
      typeRecord({ slug: 'steak', label: 'Steak', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.mediumRare, DONENESS.medium], dryBrineId: 'beef-steak-dry-brine', ratios: SOURCE_RATIOS.beefBonelessSteak, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.beefBoneInSteak, boneless: SOURCE_RATIOS.beefBonelessSteak }, temperaturesByDoneness: { 'medium-rare': CHEF_TEMPERATURES.beefMediumRare, medium: CHEF_TEMPERATURES.beefMedium }, timing: TIMING.short }),
      typeRecord({ slug: 'ribeye', label: 'Ribeye', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.mediumRare, DONENESS.medium], dryBrineId: 'beef-ribeye-dry-brine', ratios: SOURCE_RATIOS.beefBonelessSteak, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.beefBoneInSteak, boneless: SOURCE_RATIOS.beefBonelessSteak }, temperaturesByDoneness: { 'medium-rare': CHEF_TEMPERATURES.beefMediumRare, medium: CHEF_TEMPERATURES.beefMedium }, timing: TIMING.short }),
      typeRecord({ slug: 'ribs', label: 'Beef ribs', details: [DETAIL.boneIn], doneness: [DONENESS.tender], dryBrineId: 'beef-ribs-dry-brine', ratios: SOURCE_RATIOS.beefRibs, timing: TIMING.long }),
      typeRecord({ slug: 'ground-80-20', label: 'Ground meat', details: [DETAIL.ground], doneness: [DONENESS.cookThrough], dryBrineId: 'beef-ground-80-20-dry-brine', ratios: SOURCE_RATIOS.beefGround8020, temperature: CHEF_TEMPERATURES.groundMeat, timing: TIMING.ground }),
    ]),
  }),
  Object.freeze({
    slug: 'pork',
    label: 'Pork',
    types: Object.freeze([
      typeRecord({ slug: 'chop', label: 'Chop', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.recommended], dryBrineId: 'pork-chop-dry-brine', ratios: SOURCE_RATIOS.porkBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.porkRibs, boneless: SOURCE_RATIOS.porkBoneless }, temperature: CHEF_TEMPERATURES.pork, timing: TIMING.short }),
      typeRecord({ slug: 'tenderloin', label: 'Tenderloin', details: [DETAIL.boneless], doneness: [DONENESS.recommended], dryBrineId: 'pork-tenderloin-dry-brine', ratios: SOURCE_RATIOS.porkBoneless, temperature: CHEF_TEMPERATURES.pork, timing: TIMING.short }),
      typeRecord({ slug: 'ribs', label: 'Ribs', details: [DETAIL.boneIn], doneness: [DONENESS.tender], dryBrineId: 'pork-ribs-dry-brine', ratios: SOURCE_RATIOS.porkRibs, timing: TIMING.long }),
      typeRecord({ slug: 'ground', label: 'Ground meat', details: [DETAIL.ground], doneness: [DONENESS.cookThrough], dryBrineId: 'pork-ground-dry-brine', ratios: SOURCE_RATIOS.porkGround, temperature: CHEF_TEMPERATURES.groundMeat, timing: TIMING.ground }),
    ]),
  }),
  Object.freeze({
    slug: 'lamb',
    label: 'Lamb',
    types: Object.freeze([
      typeRecord({ slug: 'chops', label: 'Chops', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.mediumRare, DONENESS.medium], dryBrineId: 'lamb-chops-dry-brine', ratios: SOURCE_RATIOS.lambBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.lambBoneIn, boneless: SOURCE_RATIOS.lambBoneless }, temperaturesByDoneness: { 'medium-rare': CHEF_TEMPERATURES.lambMediumRare, medium: CHEF_TEMPERATURES.lambMedium }, timing: TIMING.short }),
      typeRecord({ slug: 'leg', label: 'Leg', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.mediumRare, DONENESS.medium], dryBrineId: 'lamb-leg-dry-brine', ratios: SOURCE_RATIOS.lambBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.lambBoneIn, boneless: SOURCE_RATIOS.lambBoneless }, temperaturesByDoneness: { 'medium-rare': CHEF_TEMPERATURES.lambMediumRare, medium: CHEF_TEMPERATURES.lambMedium }, timing: TIMING.long }),
      typeRecord({ slug: 'rack', label: 'Rack', details: [DETAIL.boneIn], doneness: [DONENESS.mediumRare, DONENESS.medium], dryBrineId: 'lamb-rack-dry-brine', ratios: SOURCE_RATIOS.lambBoneIn, temperaturesByDoneness: { 'medium-rare': CHEF_TEMPERATURES.lambMediumRare, medium: CHEF_TEMPERATURES.lambMedium }, timing: TIMING.long }),
      typeRecord({ slug: 'shoulder', label: 'Shoulder', details: [DETAIL.boneIn, DETAIL.boneless], doneness: [DONENESS.tender], dryBrineId: 'lamb-shoulder-dry-brine', ratios: SOURCE_RATIOS.lambBoneless, ratiosByDetail: { 'bone-in': SOURCE_RATIOS.lambBoneIn, boneless: SOURCE_RATIOS.lambBoneless }, timing: TIMING.long }),
    ]),
  }),
  Object.freeze({
    slug: 'seafood',
    label: 'Fish & shellfish',
    types: Object.freeze([
      typeRecord({ slug: 'scallops', label: 'Scallops', details: [DETAIL.shucked], doneness: [DONENESS.cookThrough], dryBrineId: 'seafood-scallops-dry-brine', ratios: SOURCE_RATIOS.scallops, temperature: CHEF_TEMPERATURES.seafood, timing: TIMING.seafood }),
      typeRecord({ slug: 'shrimp', label: 'Prawns', details: [DETAIL.peeled], doneness: [DONENESS.cookThrough], dryBrineId: 'seafood-shrimp-dry-brine', ratios: SOURCE_RATIOS.shrimp, temperature: CHEF_TEMPERATURES.seafood, timing: TIMING.seafood }),
      typeRecord({ slug: 'fish', label: 'Fish fillet', details: [DETAIL.fillet], doneness: [DONENESS.cookThrough], dryBrineId: 'seafood-fish-dry-brine', ratios: SOURCE_RATIOS.fish, temperature: CHEF_TEMPERATURES.seafood, timing: TIMING.seafood }),
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
        saltPercent: 1,
        ratioDisplay: '50% | 1%',
        ratioParts: Object.freeze([
          Object.freeze({ value: 50, label: 'Egg' }),
          Object.freeze({ value: 1, label: 'Salt' }),
        ]),
        ratioLabel: 'by flour weight',
        rest: 'Rest for at least 30 minutes so the dough relaxes before rolling.',
        finish: 'Start checking after 1\u20132 minutes in boiling water.',
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
        saltPercent: 2,
        ratioDisplay: '48% | 2%',
        ratioParts: Object.freeze([
          Object.freeze({ value: 48, label: 'Water' }),
          Object.freeze({ value: 2, label: 'Salt' }),
        ]),
        ratioLabel: 'by flour weight',
        rest: 'Rest for at least 30 minutes; a longer rest makes the dough easier to roll.',
        finish: 'Cut to the thickness you want, then cook until tender; thin noodles take only a few minutes.',
        note: 'A firm dough and a little salt help give hand-cut noodles their springy bite.',
        source: 'https://omnivorescookbook.com/fresh-homemade-noodles/',
        sourceLabel: 'Chinese noodle ratio reference',
      }),
      Object.freeze({
        slug: 'dumpling-wrappers',
        label: 'Dumpling wrappers',
        inputLabel: 'Flour weight',
        liquidLabel: 'Water',
        hydration: 52,
        saltPercent: 1,
        ratioDisplay: '52% | 1%',
        ratioParts: Object.freeze([
          Object.freeze({ value: 52, label: 'Water' }),
          Object.freeze({ value: 1, label: 'Salt' }),
        ]),
        ratioLabel: 'by flour weight',
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
  Object.freeze({ slug: 'pasta', label: 'Pasta & Noodles', kind: 'pasta', styles: PASTA_CATALOG[0].styles }),
  Object.freeze({ slug: 'bread', label: 'Bread', kind: 'coming-soon', status: 'coming-soon' }),
  Object.freeze({ slug: 'marinades', label: 'Marinades', kind: 'coming-soon', status: 'coming-soon' }),
  Object.freeze({ slug: 'sauces', label: 'Sauces', kind: 'coming-soon', status: 'coming-soon' }),
]);
