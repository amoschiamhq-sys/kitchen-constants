import { CATEGORY_CATALOG, MEAT_CATALOG } from './constants.js?v=20260725-bread';
import { calculateDoughRatio, calculateDryBrine, parseWeight } from './calculator.js?v=20260725-bread';

const LEGACY_PREPARATION_SLUGS = new Set(['dry-brine', 'internal-temperature']);
const DOUGH_CATEGORY_KINDS = new Set(['pasta', 'bread']);

function isDoughCategory(category) {
  return DOUGH_CATEGORY_KINDS.has(category?.kind);
}

function findMeat(slug) {
  return MEAT_CATALOG.find((meat) => meat.slug === slug);
}

function findCategory(slug) {
  return CATEGORY_CATALOG.find((category) => category.slug === slug);
}

function findDoughStyle(category, slug) {
  return isDoughCategory(category)
    ? category.styles.find((style) => style.slug === slug)
    : undefined;
}

function findSauceDirection(category, slug) {
  return category?.kind === 'sauce'
    ? category.directions.find((direction) => direction.slug === slug)
    : undefined;
}

function findSauceProfile(direction, slug) {
  return direction?.profiles.find((profile) => profile.slug === slug);
}

function findSauceClassic(category, slug) {
  return category?.kind === 'sauce'
    ? category.classics.find((classic) => classic.slug === slug)
    : undefined;
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

export function routeToHash({ category, style, direction, profile, classic, meat, type, detail, variant, doneness } = {}) {
  if (isDoughCategory(category)) {
    return `#/${category.slug}/${(style ?? category.styles[0]).slug}`;
  }
  if (category?.kind === 'sauce') {
    if (classic) return `#/${category.slug}/classics/${classic.slug}`;
    const resolvedDirection = direction ?? category.directions[0];
    const resolvedProfile = profile ?? resolvedDirection.profiles[0];
    return `#/${category.slug}/${resolvedDirection.slug}/${resolvedProfile.slug}`;
  }
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

  const category = findCategory(segments[0]);
  if (isDoughCategory(category)) {
    if (segments.length === 1) return route('category', { category, legacyPreparation });
    if (segments.length !== 2) return route('not-found');
    const style = findDoughStyle(category, segments[1]);
    return style ? route(`${category.kind}-style`, { category, style, legacyPreparation }) : route('not-found');
  }

  if (category?.kind === 'sauce') {
    if (segments.length === 1) return route('sauce-category', { category, legacyPreparation });
    if (segments[1] === 'builder') {
      return segments.length === 2 ? route('sauce-legacy', { category, legacyPreparation }) : route('not-found');
    }
    if (segments[1] === 'classics') {
      if (segments.length === 2) return route('sauce-classics', { category, legacyPreparation });
      if (segments.length !== 3) return route('not-found');
      const classic = findSauceClassic(category, segments[2]);
      return classic ? route('sauce-classic', { category, classic, legacyPreparation }) : route('not-found');
    }
    if (segments.length === 2) {
      const direction = findSauceDirection(category, segments[1]);
      return direction ? route('sauce-direction', { category, direction, legacyPreparation }) : route('not-found');
    }
    if (segments.length !== 3) return route('not-found');
    const direction = findSauceDirection(category, segments[1]);
    const profile = findSauceProfile(direction, segments[2]);
    return direction && profile
      ? route('sauce-profile', { category, direction, profile, legacyPreparation })
      : route('not-found');
  }

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
  if (isDoughCategory(selection?.category)) {
    return [selection.category.slug, selection.style?.slug].filter(Boolean).join('/');
  }
  if (selection?.category?.kind === 'sauce') {
    return selection.classic
      ? [selection.category.slug, 'classics', selection.classic.slug].join('/')
      : [selection.category.slug, selection.direction?.slug, selection.profile?.slug].filter(Boolean).join('/');
  }
  if (!selection?.meat || !selection?.type) return null;
  return [
    selection.meat.slug,
    selection.type.slug,
    (selection.detail ?? selection.variant)?.slug,
    selection.doneness?.slug,
  ].filter(Boolean).join('/');
}

export function canonicalSelectionHash(selection) {
  if (isDoughCategory(selection?.category) && selection.style) {
    return routeToHash(selection);
  }
  if (selection?.category?.kind === 'sauce' && (selection.profile || selection.classic)) {
    return routeToHash(selection);
  }
  if (!selection?.meat || !selection?.type || !selection?.detail || !selection?.doneness) {
    return '#/';
  }
  return routeToHash(selection);
}

export function resolveSelection(currentRoute) {
  if (!currentRoute || currentRoute.kind === 'not-found') return null;

  if (isDoughCategory(currentRoute.category)) {
    const category = currentRoute.category;
    const style = currentRoute.style ?? category.styles[0];
    const resolved = {
      kind: `${currentRoute.category.kind}-resolved`,
      category,
      style,
      selectionComplete: true,
      legacyPreparation: Boolean(currentRoute.legacyPreparation),
    };
    return { ...resolved, hash: canonicalSelectionHash(resolved) };
  }

  if (currentRoute.category?.kind === 'sauce') {
    const category = currentRoute.category;
    if (currentRoute.kind === 'sauce-classics') {
      const classic = category.classics[0];
      const resolved = {
        kind: 'sauce-resolved',
        category,
        classic,
        selectionComplete: true,
        legacyPreparation: Boolean(currentRoute.legacyPreparation),
      };
      return { ...resolved, hash: canonicalSelectionHash(resolved) };
    }
    if (currentRoute.kind === 'sauce-category' || currentRoute.kind === 'sauce-legacy'
      || (!currentRoute.direction && !currentRoute.profile && !currentRoute.classic)) {
      const resolved = {
        kind: 'sauce-resolved',
        category,
        direction: category.directions[0],
        profile: category.directions[0].profiles[0],
        selectionComplete: true,
        legacyPreparation: Boolean(currentRoute.legacyPreparation),
      };
      return { ...resolved, hash: canonicalSelectionHash(resolved) };
    }
    if (currentRoute.classic) {
      const classic = currentRoute.classic;
      const resolved = {
        kind: 'sauce-resolved',
        category,
        classic,
        selectionComplete: true,
        legacyPreparation: Boolean(currentRoute.legacyPreparation),
      };
      return { ...resolved, hash: canonicalSelectionHash(resolved) };
    }
    const direction = currentRoute.direction ?? category.directions[0];
    const profile = currentRoute.profile ?? direction.profiles[0];
    const resolved = {
      kind: 'sauce-resolved',
      category,
      direction,
      profile,
      selectionComplete: true,
      legacyPreparation: Boolean(currentRoute.legacyPreparation),
    };
    return { ...resolved, hash: canonicalSelectionHash(resolved) };
  }

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

  if (currentRoute.kind === 'category' && isDoughCategory(currentRoute.category)) {
    return currentRoute.category.styles.map((style) => ({
      kind: 'active',
      label: style.label,
      href: resolveSelection(route(`${currentRoute.category.kind}-style`, {
        category: currentRoute.category,
        style,
      })).hash,
    }));
  }

  if (currentRoute.kind === 'sauce-category' || currentRoute.kind === 'sauce-legacy' || currentRoute.kind === 'sauce-classics') {
    const category = currentRoute.category;
    if (currentRoute.kind === 'sauce-category' || currentRoute.kind === 'sauce-legacy') {
      return [
        ...category.directions.map((direction) => ({
          kind: 'active',
          label: direction.label,
          href: resolveSelection(route('sauce-profile', {
            category,
            direction,
            profile: direction.profiles[0],
          })).hash,
        })),
      ];
    }
    if (currentRoute.kind === 'sauce-classics') {
      return category.classics.map((classic) => ({
        kind: 'active',
        label: classic.label,
        href: resolveSelection(route('sauce-classic', { category, classic })).hash,
      }));
    }
    return category.directions.map((direction) => ({
      kind: 'active',
      label: direction.label,
      href: resolveSelection(route('sauce-profile', {
        category,
        direction,
        profile: direction.profiles[0],
      })).hash,
    }));
  }

  if (currentRoute.kind === 'sauce-direction') {
    return currentRoute.direction.profiles.map((profile) => ({
      kind: 'active',
      label: profile.label,
      href: resolveSelection(route('sauce-profile', {
        category: currentRoute.category,
        direction: currentRoute.direction,
        profile,
      })).hash,
    }));
  }

  if (currentRoute.kind === 'sauce-profile') {
    return currentRoute.direction.profiles.map((profile) => ({
      kind: 'active',
      label: profile.label,
      href: resolveSelection(route('sauce-profile', {
        category: currentRoute.category,
        direction: currentRoute.direction,
        profile,
      })).hash,
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
  if (currentRoute.style?.label) return currentRoute.style.label;
  if (currentRoute.classic?.label) return currentRoute.classic.label;
  if (currentRoute.profile?.label) return currentRoute.profile.label;
  if (currentRoute.category?.label) return currentRoute.category.label;
  return currentRoute.doneness?.label
    ?? currentRoute.detail?.label
    ?? currentRoute.type?.label
    ?? currentRoute.meat?.label
    ?? 'Kitchen Constants';
}

export function getSinglePageViewModel(selection, rawWeight = '') {
  const resolved = selection?.selectionComplete ? selection : resolveSelection(selection);
  const weight = parseWeight(rawWeight);

  if (isDoughCategory(resolved?.category)) {
    const dough = resolved.style && weight.status === 'valid'
      ? calculateDoughRatio(weight.grams, {
        hydration: resolved.style.hydration,
        salt: resolved.style.saltPercent,
        leaven: resolved.style.leavenPercent,
        extras: resolved.style.extraParts?.map((part) => ({
          slug: part.slug,
          label: part.label,
          percentage: part.percentage,
        })),
      })
      : null;
    return {
      selectionComplete: Boolean(resolved),
      module: resolved.category.kind,
      style: resolved.style,
      weight,
      dough,
      result: dough,
      dryBrine: null,
      internalTemperature: null,
    };
  }

  if (resolved?.category?.kind === 'sauce') {
    const sauce = resolved.classic ?? resolved.profile;
    return {
      selectionComplete: Boolean(resolved),
      module: 'sauce',
      direction: resolved.direction ?? null,
      profile: resolved.profile ?? null,
      classic: resolved.classic ?? null,
      sauce,
      weight,
      result: null,
      dryBrine: null,
      internalTemperature: null,
    };
  }

  const type = resolved?.type;
  const dryBrine = type?.dryBrineByDetail?.[resolved?.detail?.slug]
    ?? type?.dryBrine
    ?? null;
  const internalTemperature = type?.temperaturesByDoneness?.[resolved?.doneness?.slug]
    ?? type?.internalTemperature
    ?? null;
  const result = dryBrine?.ratios && weight.status === 'valid'
    ? calculateDryBrine(weight.grams, dryBrine.ratios)
    : null;

  return {
    selectionComplete: Boolean(resolved),
    module: 'meat',
    dryBrine,
    internalTemperature,
    weight,
    result,
  };
}
