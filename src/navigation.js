import { FUTURE_CATEGORIES, MEAT_CATALOG } from './constants.js';
import { calculateDryBrine, parseWeight } from './calculator.js';

const PREPARATION_SLUGS = new Set(['dry-brine', 'internal-temperature']);

function findMeat(slug) {
  return MEAT_CATALOG.find((meat) => meat.slug === slug);
}

function findType(meat, slug) {
  return meat?.types.find((type) => type.slug === slug);
}

function findVariant(type, slug) {
  return type?.variants.find((variant) => variant.slug === slug);
}

function findDoneness(type, slug) {
  return type?.doneness.find((option) => option.slug === slug);
}

function findPreparation(type, slug) {
  return type?.preparations.find((preparation) => preparation.slug === slug);
}

function decodeSegments(hash) {
  const rawHash = typeof hash === 'string' && hash !== '' ? hash : '#/';
  const rawPath = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  if (rawPath === '' || rawPath === '/') return [];
  if (!rawPath.startsWith('/')) return null;

  try {
    return rawPath.split('/').filter(Boolean).map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }
}

function route(kind, fields = {}) {
  const result = { kind, ...fields };
  result.hash = routeToHash(result);
  return result;
}

export function routeToHash({ kind, meat, type, variant, doneness, preparation } = {}) {
  if (kind === 'home' || !meat) return '#/';

  const segments = [meat.slug];
  if (type) segments.push(type.slug);
  if (variant) segments.push(variant.slug);
  if (doneness) segments.push(doneness.slug);
  if (preparation) segments.push(preparation.slug);
  return `#/${segments.join('/')}`;
}

export function parseRoute(hash = '#/') {
  const segments = decodeSegments(hash);
  if (segments === null || segments.length > 5) return route('not-found');
  if (segments.length === 0) return route('home');

  const [meatSlug, typeSlug, thirdSlug, fourthSlug, fifthSlug] = segments;
  const meat = findMeat(meatSlug);
  if (!meat) return route('not-found');
  if (segments.length === 1) return route('meat', { meat });

  const type = findType(meat, typeSlug);
  if (!type) return route('not-found');
  if (segments.length === 2) return route('cut', { meat, type });

  const variant = findVariant(type, thirdSlug);
  const donenessAtThird = findDoneness(type, thirdSlug);
  const preparationAtThird = findPreparation(type, thirdSlug);

  if (segments.length === 3) {
    if (variant) return route('variant', { meat, type, variant });
    if (!type.variants.length && donenessAtThird) {
      return route('doneness', { meat, type, doneness: donenessAtThird });
    }
    if (!type.variants.length && !type.doneness.length && preparationAtThird) {
      return route('preparation', { meat, type, preparation: preparationAtThird });
    }
    return route('not-found');
  }

  const doneness = variant ? findDoneness(type, fourthSlug) : donenessAtThird;
  const preparationSlug = variant
    ? (type.doneness.length ? fifthSlug : fourthSlug)
    : fourthSlug;
  if (variant && type.doneness.length && segments.length === 4 && doneness) {
    return route('doneness', { meat, type, variant, doneness });
  }
  const preparation = findPreparation(type, preparationSlug);

  if (type.variants.length && !variant) return route('not-found');
  if (type.doneness.length && !doneness) return route('not-found');
  if (!preparation || (variant && type.doneness.length && segments.length !== 5)) {
    return route('not-found');
  }

  return route('preparation', {
    meat,
    type,
    variant,
    doneness,
    preparation,
  });
}

export function parentRoute(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'home') return null;
  if (currentRoute.kind === 'meat') return route('home');
  if (currentRoute.kind === 'cut') return route('meat', { meat: currentRoute.meat });
  if (currentRoute.kind === 'variant') {
    return route('cut', { meat: currentRoute.meat, type: currentRoute.type });
  }
  if (currentRoute.kind === 'doneness') {
    return currentRoute.variant
      ? route('variant', { meat: currentRoute.meat, type: currentRoute.type, variant: currentRoute.variant })
      : route('cut', { meat: currentRoute.meat, type: currentRoute.type });
  }

  if (currentRoute.doneness) {
    return route('doneness', {
      meat: currentRoute.meat,
      type: currentRoute.type,
      variant: currentRoute.variant,
      doneness: currentRoute.doneness,
    });
  }
  if (currentRoute.variant) {
    return route('variant', {
      meat: currentRoute.meat,
      type: currentRoute.type,
      variant: currentRoute.variant,
    });
  }
  return route('cut', { meat: currentRoute.meat, type: currentRoute.type });
}

export function selectionKey(currentRoute) {
  if (!currentRoute?.meat || !currentRoute?.type) return null;
  return [
    currentRoute.meat.slug,
    currentRoute.type.slug,
    currentRoute.variant?.slug,
    currentRoute.doneness?.slug,
  ].filter(Boolean).join('/');
}

export function getRouteChoices(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'not-found' || currentRoute.kind === 'preparation') {
    return [];
  }

  if (currentRoute.kind === 'home') {
    return [
      ...MEAT_CATALOG.map((meat) => ({
        kind: 'active',
        label: meat.label,
        href: routeToHash({ kind: 'meat', meat }),
      })),
      ...FUTURE_CATEGORIES.map((category) => ({
        kind: 'inert',
        label: category.label,
      })),
    ];
  }

  if (currentRoute.kind === 'meat') {
    return currentRoute.meat.types.map((type) => ({
      kind: 'active',
      label: type.label,
      href: routeToHash({ kind: 'cut', meat: currentRoute.meat, type }),
    }));
  }

  const { meat, type, variant } = currentRoute;
  if (currentRoute.kind === 'cut' && type.variants.length) {
    return type.variants.map((option) => ({
      kind: 'active',
      label: option.label,
      href: routeToHash({ kind: 'variant', meat, type, variant: option }),
    }));
  }

  if ((currentRoute.kind === 'cut' || currentRoute.kind === 'variant') && type.doneness.length) {
    return type.doneness.map((option) => ({
      kind: 'active',
      label: option.label,
      href: routeToHash({ kind: 'doneness', meat, type, variant, doneness: option }),
    }));
  }

  if (currentRoute.kind === 'cut' || currentRoute.kind === 'variant' || currentRoute.kind === 'doneness') {
    return type.preparations.map((preparation) => ({
      kind: 'active',
      label: preparation.label,
      href: routeToHash({ kind: 'preparation', meat, type, variant, doneness: currentRoute.doneness, preparation }),
    }));
  }

  return [];
}

export function getBreadcrumbs(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'home' || currentRoute.kind === 'not-found') return [];

  const { meat, type, variant, doneness, preparation } = currentRoute;
  const crumbs = [
    { label: 'Home', href: '#/' },
    { label: meat.label, href: routeToHash({ kind: 'meat', meat }) },
  ];

  if (type) crumbs.push({ label: type.label, href: routeToHash({ kind: 'cut', meat, type }) });
  if (variant) crumbs.push({ label: variant.label, href: routeToHash({ kind: 'variant', meat, type, variant }) });
  if (doneness) crumbs.push({ label: doneness.label, href: routeToHash({ kind: 'doneness', meat, type, variant, doneness }) });
  if (preparation) crumbs.push({ label: preparation.label, href: routeToHash({ kind: 'preparation', meat, type, variant, doneness, preparation }) });
  return crumbs;
}

export function getRouteTitle(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'home') return 'Kitchen Constants';
  if (currentRoute.kind === 'not-found') return 'That page is not in the pantry';
  if (currentRoute.kind === 'meat') return currentRoute.meat.label;
  if (currentRoute.kind === 'cut') return currentRoute.type.label;
  if (currentRoute.kind === 'variant') return currentRoute.variant.label;
  if (currentRoute.kind === 'doneness') return currentRoute.doneness.label;
  return currentRoute.preparation.label;
}

export function getContentForRoute(currentRoute) {
  return currentRoute?.kind === 'preparation' ? currentRoute.preparation.content : null;
}

export function getPreparationViewModel(currentRoute, rawWeight = '') {
  const content = getContentForRoute(currentRoute);
  if (!content) return null;

  const weight = parseWeight(rawWeight);
  return {
    content,
    contentStatus: content.contentStatus,
    weight,
    result: content.ratios && weight.status === 'valid'
      ? calculateDryBrine(weight.grams, content.ratios)
      : null,
  };
}

export function getSinglePageViewModel(selection, rawWeight = '') {
  const type = selection?.type;
  const dryBrine = type?.preparations.find((preparation) => preparation.slug === 'dry-brine')?.content ?? null;
  const defaultInternalTemperature = type?.preparations.find((preparation) => preparation.slug === 'internal-temperature')?.content ?? null;
  const internalTemperature = type?.temperaturesByDoneness?.[selection?.doneness?.slug]
    ?? defaultInternalTemperature;
  const requiresVariant = Boolean(type?.variants.length);
  const requiresDoneness = Boolean(type?.doneness.length);
  const selectionComplete = Boolean(
    type
      && (!requiresVariant || selection.variant)
      && (!requiresDoneness || selection.doneness),
  );
  const weight = parseWeight(rawWeight);

  return {
    selectionComplete,
    dryBrine,
    internalTemperature,
    weight,
    result: selectionComplete && dryBrine?.ratios && weight.status === 'valid'
      ? calculateDryBrine(weight.grams, dryBrine.ratios)
      : null,
  };
}

export function isKnownPreparationSlug(slug) {
  return PREPARATION_SLUGS.has(slug);
}
