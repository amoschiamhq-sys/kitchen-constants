import { MEAT_CATALOG } from './constants.js';
import { calculateDryBrine, parseWeight } from './calculator.js';

const LEGACY_PREPARATION_SLUGS = new Set(['dry-brine', 'internal-temperature']);

function findMeat(slug) {
  return MEAT_CATALOG.find((meat) => meat.slug === slug);
}

function findType(meat, slug) {
  return meat?.types.find((type) => type.slug === slug);
}

function findDetail(type, slug) {
  return type?.details.find((detail) => detail.slug === slug);
}

function findDoneness(type, slug) {
  return type?.doneness.find((option) => option.slug === slug);
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
  return { kind, ...fields };
}

export function routeToHash({ meat, type, detail, variant, doneness } = {}) {
  if (!meat) return '#/';
  const segments = [meat.slug];
  if (type) segments.push(type.slug);
  if (detail ?? variant) segments.push((detail ?? variant).slug);
  if (doneness) segments.push(doneness.slug);
  return `#/${segments.join('/')}`;
}

export function parseRoute(hash = '#/') {
  const decoded = decodeSegments(hash);
  if (decoded === null) return route('not-found');

  const segments = [...decoded];
  const legacyPreparation = LEGACY_PREPARATION_SLUGS.has(segments.at(-1));
  if (legacyPreparation) segments.pop();
  if (segments.length > 4) return route('not-found');
  if (segments.length === 0) return route('home', { legacyPreparation });

  const [meatSlug, typeSlug, thirdSlug, fourthSlug] = segments;
  const meat = findMeat(meatSlug);
  if (!meat) return route('not-found');
  if (segments.length === 1) return route('meat', { meat, legacyPreparation });

  const type = findType(meat, typeSlug);
  if (!type) return route('not-found');
  if (segments.length === 2) return route('cut', { meat, type, legacyPreparation });

  const detail = findDetail(type, thirdSlug);
  const donenessWithoutDetail = findDoneness(type, thirdSlug);
  if (segments.length === 3) {
    if (detail) return route('detail', { meat, type, detail, legacyPreparation });
    if (donenessWithoutDetail) {
      return route('doneness', { meat, type, doneness: donenessWithoutDetail, legacyPreparation });
    }
    return route('not-found');
  }

  if (!detail) return route('not-found');
  const doneness = findDoneness(type, fourthSlug);
  if (!doneness) return route('not-found');
  return route('doneness', { meat, type, detail, doneness, legacyPreparation });
}

export function selectionKey(selection) {
  if (!selection?.meat || !selection?.type) return null;
  return [
    selection.meat.slug,
    selection.type.slug,
    (selection.detail ?? selection.variant)?.slug,
    selection.doneness?.slug,
  ].filter(Boolean).join('/');
}

export function canonicalSelectionHash(selection) {
  if (!selection?.meat || !selection?.type || !selection?.detail || !selection?.doneness) {
    return '#/';
  }
  return routeToHash(selection);
}

export function resolveSelection(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'not-found') return null;

  const meat = currentRoute.meat ?? MEAT_CATALOG[0];
  const type = currentRoute.type ?? meat.types[0];
  const detail = currentRoute.detail ?? currentRoute.variant ?? type.details[0];
  const doneness = currentRoute.doneness ?? type.doneness[0];
  const resolved = {
    kind: 'resolved',
    meat,
    type,
    detail,
    doneness,
    selectionComplete: true,
    legacyPreparation: Boolean(currentRoute.legacyPreparation),
  };
  return { ...resolved, hash: canonicalSelectionHash(resolved) };
}

export function getRouteChoices(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'not-found') return [];

  if (currentRoute.kind === 'home') {
    return MEAT_CATALOG.map((meat) => ({
      kind: 'active',
      label: meat.label,
      href: resolveSelection(route('meat', { meat })).hash,
    }));
  }

  if (currentRoute.kind === 'meat') {
    return currentRoute.meat.types.map((type) => ({
      kind: 'active',
      label: type.label,
      href: resolveSelection(route('cut', { meat: currentRoute.meat, type })).hash,
    }));
  }

  if (currentRoute.kind === 'cut') {
    return currentRoute.type.details.map((detail) => ({
      kind: 'active',
      label: detail.label,
      href: resolveSelection(route('detail', {
        meat: currentRoute.meat,
        type: currentRoute.type,
        detail,
      })).hash,
    }));
  }

  if (currentRoute.kind === 'detail') {
    return currentRoute.type.doneness.map((doneness) => ({
      kind: 'active',
      label: doneness.label,
      href: resolveSelection(route('doneness', {
        meat: currentRoute.meat,
        type: currentRoute.type,
        detail: currentRoute.detail,
        doneness,
      })).hash,
    }));
  }

  return [];
}

export function getRouteTitle(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'home') return 'Kitchen Constants';
  if (currentRoute.kind === 'not-found') return 'That page is not in the pantry';
  return currentRoute.doneness?.label
    ?? currentRoute.detail?.label
    ?? currentRoute.type?.label
    ?? currentRoute.meat?.label
    ?? 'Kitchen Constants';
}

export function getSinglePageViewModel(selection, rawWeight = '') {
  const resolved = selection?.selectionComplete ? selection : resolveSelection(selection);
  const type = resolved?.type;
  const dryBrine = type?.dryBrineByDetail?.[resolved?.detail?.slug]
    ?? type?.dryBrine
    ?? null;
  const internalTemperature = type?.temperaturesByDoneness?.[resolved?.doneness?.slug]
    ?? type?.internalTemperature
    ?? null;
  const weight = parseWeight(rawWeight);
  const result = dryBrine?.ratios && weight.status === 'valid'
    ? calculateDryBrine(weight.grams, dryBrine.ratios)
    : null;

  return {
    selectionComplete: Boolean(resolved),
    dryBrine,
    internalTemperature,
    weight,
    result,
  };
}
