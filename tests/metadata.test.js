import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  {
    file: 'index.html',
    canonical: 'https://kitchenconstants.com/',
    titleIncludes: 'Cooking Ratios',
  },
  {
    file: 'guides.html',
    canonical: 'https://kitchenconstants.com/guides',
  },
  {
    file: 'about.html',
    canonical: 'https://kitchenconstants.com/about',
  },
  {
    file: 'amos-chiam.html',
    canonical: 'https://kitchenconstants.com/amos-chiam',
    titleIncludes: 'Amos Chiam',
  },
  {
    file: 'dry-brining.html',
    canonical: 'https://kitchenconstants.com/dry-brining',
    titleIncludes: 'Dry-Brine Calculator',
  },
  {
    file: 'meat-temperatures.html',
    canonical: 'https://kitchenconstants.com/meat-temperatures',
    titleIncludes: 'Meat Internal Temperature Chart',
  },
  {
    file: 'dough-ratios.html',
    canonical: 'https://kitchenconstants.com/dough-ratios',
    titleIncludes: 'Pasta Dough &amp; Bread Ratio Calculator',
  },
  {
    file: 'sauce-ratios.html',
    canonical: 'https://kitchenconstants.com/sauce-ratios',
    titleIncludes: 'Sauce Ratio Calculator',
  },
];

const socialImage = 'https://kitchenconstants.com/assets/kitchen-constants-social.png';

function readPage(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function getMeta(html, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapedValue}"\\s+content="([^"]*)"`);
  return html.match(pattern)?.[1] ?? null;
}

function getLink(html, rel) {
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<link\\s+rel="${escapedRel}"\\s+href="([^"]*)"`);
  return html.match(pattern)?.[1] ?? null;
}

function getJsonLd(html) {
  return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json));
}

test('all public pages expose complete sharing metadata and matching canonicals', () => {
  for (const page of pages) {
    const html = readPage(page.file);
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];

    assert.equal(canonical, page.canonical, page.file);
    assert.ok(html.match(/<title>[^<]+<\/title>/), `${page.file} title`);
    if (page.titleIncludes) assert.match(html, new RegExp(`<title>[^<]*${page.titleIncludes}`), page.file);

    for (const [attribute, value] of [
      ['property', 'og:title'],
      ['property', 'og:description'],
      ['property', 'og:type'],
      ['property', 'og:site_name'],
      ['property', 'og:url'],
      ['property', 'og:image'],
      ['property', 'og:image:type'],
      ['property', 'og:image:width'],
      ['property', 'og:image:height'],
      ['property', 'og:image:alt'],
      ['name', 'twitter:card'],
      ['name', 'twitter:title'],
      ['name', 'twitter:description'],
      ['name', 'twitter:image'],
      ['name', 'twitter:image:alt'],
    ]) {
      assert.ok(getMeta(html, attribute, value), `${page.file} ${value}`);
    }

    assert.equal(getMeta(html, 'property', 'og:url'), page.canonical, page.file);
    assert.equal(getMeta(html, 'property', 'og:image'), socialImage, page.file);
    assert.equal(getMeta(html, 'name', 'twitter:image'), socialImage, page.file);
    assert.equal(getLink(html, 'icon'), './assets/favicon.svg', page.file);
    assert.equal(getLink(html, 'apple-touch-icon'), './assets/apple-touch-icon.png', page.file);
  }
});

test('public pages expose accurate structured data without Recipe schema', () => {
  const expected = {
    'index.html': { type: 'WebSite', url: 'https://kitchenconstants.com/' },
    'guides.html': { type: 'CollectionPage', url: 'https://kitchenconstants.com/guides' },
    'about.html': { type: 'AboutPage', url: 'https://kitchenconstants.com/about' },
    'amos-chiam.html': { type: 'ProfilePage', url: 'https://kitchenconstants.com/amos-chiam' },
    'dry-brining.html': { type: 'Article', url: 'https://kitchenconstants.com/dry-brining' },
    'meat-temperatures.html': { type: 'Article', url: 'https://kitchenconstants.com/meat-temperatures' },
    'dough-ratios.html': { type: 'Article', url: 'https://kitchenconstants.com/dough-ratios' },
    'sauce-ratios.html': { type: 'Article', url: 'https://kitchenconstants.com/sauce-ratios' },
  };

  for (const [file, expectation] of Object.entries(expected)) {
    const html = readPage(file);
    const blocks = getJsonLd(html);

    assert.equal(blocks.length, 1, `${file} JSON-LD block count`);
    assert.equal(blocks[0]['@context'], 'https://schema.org', `${file} JSON-LD context`);
    assert.equal(blocks[0]['@type'], expectation.type, `${file} JSON-LD type`);
    assert.equal(blocks[0].url, expectation.url, `${file} JSON-LD URL`);
    assert.doesNotMatch(html, /"@type"\s*:\s*"Recipe"/, `${file} Recipe schema`);
  }

  const about = getJsonLd(readPage('about.html'))[0];
  assert.deepEqual(about.mainEntity, {
    '@id': 'https://kitchenconstants.com/amos-chiam#amos-chiam',
    '@type': 'Person',
    name: 'Amos Chiam',
    url: 'https://kitchenconstants.com/amos-chiam',
    sameAs: ['https://de.linkedin.com/in/amoschiam'],
  });

  const authorPage = getJsonLd(readPage('amos-chiam.html'))[0];
  assert.deepEqual(authorPage.mainEntity, {
    '@id': 'https://kitchenconstants.com/amos-chiam#amos-chiam',
    '@type': 'Person',
    name: 'Amos Chiam',
    url: 'https://kitchenconstants.com/amos-chiam',
    description: 'Creator of Kitchen Constants.',
    sameAs: ['https://de.linkedin.com/in/amoschiam'],
  });

  for (const file of ['dry-brining.html', 'meat-temperatures.html', 'dough-ratios.html', 'sauce-ratios.html']) {
    assert.deepEqual(getJsonLd(readPage(file))[0].author, {
      '@id': 'https://kitchenconstants.com/amos-chiam#amos-chiam',
      '@type': 'Person',
      name: 'Amos Chiam',
      url: 'https://kitchenconstants.com/amos-chiam',
      sameAs: ['https://de.linkedin.com/in/amoschiam'],
    }, file);
  }
});

test('reference pages have one H1, principle links, and no recipe-shaped content', () => {
  const expected = {
    'dry-brining.html': ['./index.html#/chicken/whole/whole/cook-through', './guides.html#salt-percentages'],
    'meat-temperatures.html': ['./index.html#/chicken/whole/whole/cook-through', './guides.html#temperature'],
    'dough-ratios.html': ['./index.html#/bread/everyday-loaf', './guides.html#dough-ratios'],
    'sauce-ratios.html': ['./index.html#/sauces/stir-fry/balanced', './guides.html#sauce-builder'],
  };

  for (const [file, links] of Object.entries(expected)) {
    const html = readPage(file);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file} H1 count`);
    for (const href of links) assert.match(html, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${file} ${href}`);
    assert.match(html, /By\s+(?:<[^>]+>\s*)?Amos Chiam/);
    assert.match(html, /href="\.\/amos-chiam\.html"/);
    assert.doesNotMatch(html, /<ol|<ul[^>]*class="(ingredient|steps)/i, `${file} recipe-shaped content`);
  }
});

test('brand assets and HSTS configuration are present and correctly sized', () => {
  for (const file of [
    'assets/favicon.svg',
    'assets/favicon-32.png',
    'assets/apple-touch-icon.png',
    'assets/kitchen-constants-social.png',
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), file);
  }

  const png = fs.readFileSync(path.join(root, 'assets/kitchen-constants-social.png'));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.match(fs.readFileSync(path.join(root, '_headers'), 'utf8'), /Strict-Transport-Security:\s*max-age=2592000/);
});

test('Guides keeps sauce guidance short, ordered, and citation-free', () => {
  const html = readPage('guides.html');
  const cards = [...html.matchAll(/<article class="guide-card" id="([^"]+)">\s*<p class="card-kicker">(\d+)<\/p>/g)];

  assert.deepEqual(cards.map(([, id, number]) => [id, number]), [
    ['methodology', '01'],
    ['salt-percentages', '02'],
    ['dry-brining', '03'],
    ['temperature', '04'],
    ['sauce-builder', '05'],
    ['dough-ratios', '06'],
    ['dough-salt', '07'],
    ['bread-ratios', '08'],
  ]);
  assert.match(html, /dissolve salt and sugar in the watery ingredients first\./);
  assert.match(html, /Mix dried spices or chilli into the oil\./);
  assert.match(html, /Add delicate fresh herbs last/);
  assert.match(html, /Pure salt sits outside the parts/);
  assert.doesNotMatch(html, /thewoksoflife|escoffier|justonecookbook|hot-thai-kitchen/i);
});

test('first-use copy, conditional controls, sauce caveat, and public title are present', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  const index = readPage('index.html');
  const about = readPage('about.html');

  assert.match(app, /Rough ratios and temperatures that scale to what you’re cooking\./);
  assert.match(app, /type\.details\.length > 1/);
  assert.match(app, /type\.doneness\.length > 1/);
  assert.match(app, /Parts show balance, not equal strength\./);
  assert.match(app, /Use the same spoon or cup for every part\./);
  assert.match(app, /concentrated/);
  assert.equal(index.match(/<title>([^<]+)<\/title>/)?.[1], 'Kitchen Constants | Cooking Ratios &amp; Temperatures');
  assert.match(index, /<meta name="twitter:title" content="Kitchen Constants \| Cooking Ratios &amp; Temperatures">/);
  assert.match(about, /Kitchen Constants is not a recipe book\. It offers scalable starting points/);
  assert.match(index, /"creator":\s*\{[\s\S]*"name":\s*"Amos Chiam"[\s\S]*"url":\s*"https:\/\/kitchenconstants\.com\/amos-chiam"/);
});

test('homepage source contains a useful semantic fallback for non-JavaScript visitors', () => {
  const html = readPage('index.html');
  const appStart = html.indexOf('<div id="app">');
  const scriptStart = html.indexOf('<script type="module"', appStart);
  const fallback = html.slice(appStart, scriptStart);

  assert.ok(appStart >= 0, 'homepage app mount');
  assert.ok(scriptStart > appStart, 'homepage script follows fallback');
  assert.equal((fallback.match(/<h1\b/g) ?? []).length, 1, 'homepage fallback has one H1');
  assert.match(fallback, /Kitchen Constants cooking reference/);
  assert.match(fallback, /Rough ratios and temperatures that scale to what you’re cooking\./);
  for (const label of ['Meat', 'Pasta &amp; Noodles', 'Sauces', 'Bread', 'Marinades']) {
    assert.match(fallback, new RegExp(`>${label}<`), label);
  }
  assert.match(fallback, /href="\.\/guides\.html"/);
  assert.match(fallback, /href="\.\/about\.html"/);
  assert.match(fallback, /Kitchen Constants is a reference for adjusting your own cooking, not a recipe book\./);
});

test('Guides exposes the four approved topic jump targets', () => {
  const html = readPage('guides.html');
  for (const id of ['foundations', 'meat-guides', 'sauce-guides', 'dough-guides']) {
    assert.match(html, new RegExp(`id="${id}"`), id);
    assert.match(html, new RegExp(`href="#${id}"`), id);
  }
  assert.doesNotMatch(html, /id="marinades/);
});

test('desktop ratio labels reserve shared number and subtitle rows', () => {
  const css = fs.readFileSync(path.join(root, 'styles/main.css'), 'utf8');

  assert.match(css, /@media\s*\(min-width:\s*37\.51rem\)[\s\S]*?\.ratio-part\s*\{[\s\S]*?grid-template-rows:\s*minmax\(3rem, auto\)\s+minmax\(1\.6rem, auto\);/);
  assert.match(css, /@media\s*\(min-width:\s*37\.51rem\)[\s\S]*?\.sauce-ratio-part\s*\{[\s\S]*?grid-template-rows:\s*minmax\(2\.4rem, auto\)\s+minmax\(1\.2rem, auto\);/);
});

test('public navigation and sitemap use clean page URLs', () => {
  for (const file of ['guides.html', 'about.html']) {
    const html = readPage(file);
    assert.match(html, /href="\.\/guides\.html"/);
    assert.match(html, /href="\.\/about\.html"/);
  }

  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  assert.match(app, /href="\.\/guides\.html"/);
  assert.match(app, /href="\.\/about\.html"/);

  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/kitchenconstants\.com\/guides/);
  assert.match(sitemap, /https:\/\/kitchenconstants\.com\/about/);
  assert.doesNotMatch(sitemap, /(?:guides|about)\.html/);

  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.deepEqual(sitemapUrls, [
    'https://kitchenconstants.com/',
    'https://kitchenconstants.com/guides',
    'https://kitchenconstants.com/about',
    'https://kitchenconstants.com/amos-chiam',
    'https://kitchenconstants.com/dry-brining',
    'https://kitchenconstants.com/meat-temperatures',
    'https://kitchenconstants.com/dough-ratios',
    'https://kitchenconstants.com/sauce-ratios',
  ]);
});
