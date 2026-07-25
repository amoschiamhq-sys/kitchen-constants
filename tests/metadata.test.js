import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  {
    file: 'index.html',
    canonical: 'https://kitchenconstants.com/',
    titleIncludes: 'Pasta',
  },
  {
    file: 'guides.html',
    canonical: 'https://kitchenconstants.com/guides.html',
  },
  {
    file: 'about.html',
    canonical: 'https://kitchenconstants.com/about.html',
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
    ['dry-brining', '02'],
    ['salt-percentages', '03'],
    ['temperature', '04'],
    ['sauce-builder', '05'],
    ['dough-ratios', '06'],
    ['dough-salt', '07'],
  ]);
  assert.match(html, /dissolve salt and sugar in the watery ingredients first\./);
  assert.match(html, /Mix dried spices or chilli into the oil\./);
  assert.match(html, /Add delicate fresh herbs last/);
  assert.match(html, /Pure salt sits outside the parts/);
  assert.doesNotMatch(html, /thewoksoflife|escoffier|justonecookbook|hot-thai-kitchen/i);
});
