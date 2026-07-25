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

const SAUCE_SOURCES = Object.freeze({
  stirFry: 'https://thewoksoflife.com/stir-fry-sauce-recipe/',
  yum: 'https://hot-thai-kitchen.com/thai-yum-dressing/',
  wafu: 'https://www.justonecookbook.com/wafu-dressing-japanese-salad-dressing/comment-page-2/',
  teriyaki: 'https://www.justonecookbook.com/teriyaki-sauce/',
  goma: 'https://www.justonecookbook.com/how-to-make-sesame-sauce-goma-dare/',
  peanut: 'https://hot-thai-kitchen.com/satay-and-peanut-sauce/',
  sweetSour: 'https://thewoksoflife.com/sweet-sour-sauce/',
  gochujang: 'https://www.koreanbapsang.com/asparagus-with-gochujang-sauce/',
  vinaigrette: 'https://www.escoffier.edu/blog/recipes/how-to-properly-zest-and-make-a-citrus-vinaigrette/',
});

const SAUCE_REVIEW = Object.freeze({
  contentStatus: 'reviewed',
  reviewedOn: '2026-07-25',
  methodology: 'owner-tested-with-reference',
});

function sauceRatioParts(parts) {
  return Object.freeze(parts.map(([value, label]) => Object.freeze({ value, label })));
}

function sauceProfile({
  slug,
  label,
  ratioParts,
  purpose,
  uses,
  ingredientsByRole,
  optionalAdditions,
  substitutions,
  sources,
}) {
  return Object.freeze({
    ...SAUCE_REVIEW,
    slug,
    label,
    ratioParts: sauceRatioParts(ratioParts),
    ratioLabel: 'parts',
    purpose,
    uses: Object.freeze(uses),
    ingredientsByRole: Object.freeze(Object.fromEntries(
      Object.entries(ingredientsByRole).map(([role, choices]) => [role, Object.freeze(choices)]),
    )),
    optionalAdditions: Object.freeze(optionalAdditions),
    substitutions: Object.freeze(substitutions),
    sources: Object.freeze(sources),
  });
}

function sauceClassic({ slug, label, ratioParts, purpose, uses, optionalAdditions, substitutions, sources, review = {} }) {
  return Object.freeze({
    ...SAUCE_REVIEW,
    ...review,
    slug,
    label,
    ratioParts: sauceRatioParts(ratioParts),
    ratioLabel: 'parts',
    purpose,
    uses: Object.freeze(uses),
    optionalAdditions: Object.freeze(optionalAdditions),
    substitutions: Object.freeze(substitutions),
    sources: Object.freeze(sources),
  });
}

const SAUCE_INGREDIENTS = Object.freeze({
  salty: Object.freeze(['Soy sauce', 'Fish sauce']),
  umami: Object.freeze(['Oyster sauce', 'Miso', 'Gochujang', 'Worcestershire']),
  sweet: Object.freeze(['Sugar', 'Honey', 'Mirin', 'Maple syrup']),
  acid: Object.freeze(['Rice vinegar', 'Black vinegar', 'Lime juice', 'Wine or cider vinegar', 'Mustard']),
  fat: Object.freeze(['Sesame oil', 'Chili oil', 'Sesame paste', 'Peanut butter', 'Olive oil', 'Butter']),
  heat: Object.freeze(['Fresh chili', 'Sambal', 'Gochugaru', 'Black pepper', 'Horseradish']),
  aromatics: Object.freeze(['Garlic', 'Ginger', 'Scallions', 'Shallot', 'Herbs']),
});

export const SAUCE_CATALOG = Object.freeze({
  slug: 'sauces',
  label: 'Sauces',
  kind: 'sauce',
  directions: Object.freeze([
    Object.freeze({
      slug: 'stir-fry',
      label: 'Stir-fry',
      profiles: Object.freeze([
        sauceProfile({
          slug: 'balanced',
          label: 'Balanced',
          ratioParts: [['3', 'Salty'], ['1', 'Umami'], ['½', 'Sweet']],
          purpose: 'An everyday pan sauce that seasons without taking over.',
          uses: ['Vegetables', 'Chicken', 'Pork', 'Tofu'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['A splash of water or stock to loosen', 'Garlic, ginger, or scallions'],
          substitutions: ['Tamari can replace soy sauce; mushroom sauce can replace oyster sauce.'],
          sources: [SAUCE_SOURCES.stirFry],
        }),
        sauceProfile({
          slug: 'umami',
          label: 'Umami',
          ratioParts: [['2', 'Umami'], ['1', 'Salty'], ['½', 'Sweet']],
          purpose: 'A deeper savoury base for mild ingredients.',
          uses: ['Beef', 'Mushrooms', 'Tofu', 'Leafy greens'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Sesame oil', 'White pepper or chili oil'],
          substitutions: ['Miso or mushroom sauce can stand in for oyster sauce.'],
          sources: [SAUCE_SOURCES.stirFry],
        }),
        sauceProfile({
          slug: 'spicy',
          label: 'Spicy',
          ratioParts: [['2', 'Salty'], ['1', 'Umami'], ['½', 'Sweet'], ['+', 'Heat']],
          purpose: 'A savoury sauce with heat that clings to the food.',
          uses: ['Chicken', 'Aubergine', 'Tofu', 'Stir-fried noodles'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Garlic, ginger, or scallions'],
          substitutions: ['Sambal, chili oil, or gochugaru can supply the heat.'],
          sources: [SAUCE_SOURCES.stirFry, SAUCE_SOURCES.gochujang],
        }),
      ]),
    }),
    Object.freeze({
      slug: 'glaze',
      label: 'Glaze',
      profiles: Object.freeze([
        sauceProfile({
          slug: 'sweet-glaze',
          label: 'Sweet Glaze',
          ratioParts: [['2', 'Sweet'], ['1', 'Salty'], ['1', 'Umami']],
          purpose: 'A glossy sweet-savoury coating for foods that can take colour.',
          uses: ['Grilled meat', 'Tofu', 'Salmon', 'Roast vegetables'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Ginger or garlic', 'A little acid for lift'],
          substitutions: ['Honey or mirin can replace sugar; soy or tamari can replace fish sauce.'],
          sources: [SAUCE_SOURCES.teriyaki, SAUCE_SOURCES.sweetSour],
        }),
        sauceProfile({
          slug: 'umami',
          label: 'Umami',
          ratioParts: [['2', 'Umami'], ['1', 'Salty'], ['1', 'Sweet']],
          purpose: 'A savoury glaze with restrained sweetness.',
          uses: ['Aubergine', 'Mushrooms', 'Tofu', 'Fish'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Sesame oil', 'Fresh ginger'],
          substitutions: ['Miso or mushroom sauce can replace oyster sauce.'],
          sources: [SAUCE_SOURCES.stirFry, SAUCE_SOURCES.teriyaki],
        }),
        sauceProfile({
          slug: 'spicy',
          label: 'Spicy',
          ratioParts: [['2', 'Sweet'], ['1', 'Umami'], ['1', 'Salty'], ['+', 'Heat']],
          purpose: 'Sticky sweet heat for strong-flavoured foods.',
          uses: ['Chicken', 'Tofu', 'Mushrooms', 'Skewers'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Rice vinegar', 'Garlic or sesame seeds'],
          substitutions: ['Gochujang can cover umami, sweetness, and heat at once; reduce the other roles.'],
          sources: [SAUCE_SOURCES.gochujang],
        }),
      ]),
    }),
    Object.freeze({
      slug: 'dipping',
      label: 'Dipping',
      profiles: Object.freeze([
        sauceProfile({
          slug: 'balanced',
          label: 'Balanced',
          ratioParts: [['4', 'Salty'], ['2', 'Acid'], ['1', 'Sweet']],
          purpose: 'A flexible savoury dip that works with almost anything.',
          uses: ['Dumplings', 'Spring rolls', 'Wontons', 'Steamed chicken', 'Grilled meat'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Sesame oil', 'Garlic, ginger, or scallions'],
          substitutions: ['Black vinegar or lime can replace rice vinegar; honey can replace sugar.'],
          sources: [SAUCE_SOURCES.yum],
        }),
        sauceProfile({
          slug: 'bright',
          label: 'Bright',
          ratioParts: [['3', 'Acid'], ['2', 'Salty'], ['1', 'Sweet']],
          purpose: 'A sharp, fresh dip that cuts through rich or fried food.',
          uses: ['Seafood', 'Hot pot', 'Fried food', 'Steamed vegetables'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Fresh chili', 'Cilantro or scallions'],
          substitutions: ['Lime, rice vinegar, or ponzu can fill the acid role.'],
          sources: [SAUCE_SOURCES.yum],
        }),
        sauceProfile({
          slug: 'spicy',
          label: 'Spicy',
          ratioParts: [['3', 'Acid'], ['2', 'Salty'], ['1', 'Sweet'], ['+', 'Heat']],
          purpose: 'Tangy heat that stays balanced instead of simply hot.',
          uses: ['Dumplings', 'Pancakes', 'Grilled meat', 'Seafood'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Sesame oil', 'Garlic or ginger'],
          substitutions: ['Sambal, fresh chili, or gochugaru can supply the heat.'],
          sources: [SAUCE_SOURCES.yum, SAUCE_SOURCES.gochujang],
        }),
      ]),
    }),
    Object.freeze({
      slug: 'dressing',
      label: 'Dressing',
      profiles: Object.freeze([
        sauceProfile({
          slug: 'bright',
          label: 'Bright',
          ratioParts: [['3', 'Acid'], ['2', 'Fat'], ['1', 'Salty'], ['1', 'Sweet']],
          purpose: 'A fresh, sharp dressing for plain vegetables and noodles.',
          uses: ['Salads', 'Cold noodles', 'Cucumbers', 'Tofu'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Ginger', 'Scallions or sesame seeds'],
          substitutions: ['Neutral oil can replace sesame oil; lime can replace rice vinegar.'],
          sources: [SAUCE_SOURCES.wafu],
        }),
        sauceProfile({
          slug: 'nutty',
          label: 'Nutty',
          ratioParts: [['3', 'Nutty / Fat'], ['2', 'Acid'], ['1', 'Salty'], ['½', 'Sweet']],
          purpose: 'A creamy, rounded dressing with toasted depth.',
          uses: ['Salads', 'Noodles', 'Steamed vegetables', 'Chicken'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Miso', 'Sesame seeds or ginger'],
          substitutions: ['Tahini can replace sesame paste; peanut butter makes it fuller and sweeter.'],
          sources: [SAUCE_SOURCES.goma],
        }),
        sauceProfile({
          slug: 'spicy',
          label: 'Spicy',
          ratioParts: [['3', 'Acid'], ['2', 'Salty'], ['1', 'Sweet'], ['1', 'Fat'], ['+', 'Heat']],
          purpose: 'A lively dressing for cold foods and crunchy vegetables.',
          uses: ['Cold noodles', 'Slaws', 'Cucumbers', 'Seafood'],
          ingredientsByRole: SAUCE_INGREDIENTS,
          optionalAdditions: ['Garlic, ginger, or scallions'],
          substitutions: ['Chili oil can supply both fat and heat; reduce the separate heat addition.'],
          sources: [SAUCE_SOURCES.yum, SAUCE_SOURCES.wafu],
        }),
      ]),
    }),
  ]),
  classics: Object.freeze([
    sauceClassic({
      slug: 'teriyaki',
      label: 'Teriyaki',
      ratioParts: [['2', 'Soy'], ['2', 'Sake'], ['2', 'Mirin'], ['1', 'Sugar']],
      purpose: 'A glossy sweet-savoury glaze with a clean pantry balance.',
      uses: ['Chicken', 'Salmon', 'Tofu', 'Meatballs'],
      optionalAdditions: ['Ginger or garlic'],
      substitutions: ['Dry sherry or water can replace sake; mirin needs extra sugar when replaced with water.'],
      sources: [SAUCE_SOURCES.teriyaki],
    }),
    sauceClassic({
      slug: 'sesame-goma',
      label: 'Sesame (Goma)',
      ratioParts: [['3', 'Sesame paste'], ['2', 'Dashi / water'], ['1', 'Soy'], ['1', 'Vinegar'], ['1', 'Sugar']],
      purpose: 'A creamy nutty sauce for dipping or dressing.',
      uses: ['Hot pot', 'Steamed vegetables', 'Tofu', 'Noodles'],
      optionalAdditions: ['Sesame oil', 'Miso or ginger'],
      substitutions: ['Tahini can replace sesame paste; water can replace dashi.'],
      sources: [SAUCE_SOURCES.goma],
    }),
    sauceClassic({
      slug: 'peanut',
      label: 'Peanut',
      ratioParts: [['4', 'Peanut'], ['1', 'Acid'], ['1', 'Sweet'], ['¼', 'Salty']],
      purpose: 'A rich, rounded dip that can be loosened to dress noodles.',
      uses: ['Satay', 'Spring rolls', 'Vegetables', 'Noodles'],
      optionalAdditions: ['Coconut milk', 'Chili or curry paste'],
      substitutions: ['Peanut butter can replace ground peanuts; tamarind can replace lime or vinegar.'],
      sources: [SAUCE_SOURCES.peanut],
    }),
    sauceClassic({
      slug: 'sweet-sour',
      label: 'Sweet & Sour',
      ratioParts: [['3', 'Acid'], ['3', 'Sweet'], ['1', 'Tomato'], ['¼', 'Salty']],
      purpose: 'A bright, glossy balance for dipping or coating food.',
      uses: ['Fried food', 'Pork', 'Chicken', 'Tofu', 'Vegetables'],
      optionalAdditions: ['Ginger', 'Pineapple or chili'],
      substitutions: ['Ketchup can replace tomato paste; honey can replace sugar.'],
      sources: [SAUCE_SOURCES.sweetSour],
    }),
    sauceClassic({
      slug: 'vinaigrette',
      label: 'Vinaigrette',
      ratioParts: [['3', 'Fat'], ['1', 'Acid']],
      purpose: 'A classic dressing balance for fresh or roasted foods.',
      uses: ['Salads', 'Vegetables', 'Beans', 'Grains'],
      optionalAdditions: ['Mustard', 'Shallot or herbs', 'Honey, salt, and pepper'],
      substitutions: ['Olive or neutral oil; wine or cider vinegar, or lemon.'],
      sources: [SAUCE_SOURCES.vinaigrette],
      review: {
        contentStatus: 'reviewed',
        reviewedOn: '2026-07-25',
        methodology: 'owner-tested-with-reference',
      },
    }),
  ]),
});

export const CATEGORY_CATALOG = Object.freeze([
  Object.freeze({ slug: 'meat', label: 'Meat', kind: 'meat' }),
  Object.freeze({ slug: 'pasta', label: 'Pasta & Noodles', kind: 'pasta', styles: PASTA_CATALOG[0].styles }),
  SAUCE_CATALOG,
  Object.freeze({ slug: 'bread', label: 'Bread', kind: 'coming-soon', status: 'coming-soon' }),
  Object.freeze({ slug: 'marinades', label: 'Marinades', kind: 'coming-soon', status: 'coming-soon' }),
]);
