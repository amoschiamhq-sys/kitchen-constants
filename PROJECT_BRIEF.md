# Kitchen Constants project brief

## Product

Kitchen Constants is a fast cooking reference for home cooks who want less guessing.

Tagline: **Measure twice. Season once.**

The MVP focuses on practical meat dry-brining ratios, chef-oriented internal temperatures, simple flour-based pasta and bread formulas, and reusable sauce balances.

Kitchen Constants is not a recipe book. It gives home cooks scalable starting points, finish cues, and enough context to adjust in their own kitchens.

## Approved experience

- One compact page with button-style controls.
- Meat is the default category.
- Pasta & Noodles is the first additional category.
- Bread is an active, compact baker's-percentage reference built around Everyday loaf, Olive-oil focaccia, and Chinese steamed buns. Marinades remain visible as Coming soon; Sauces are an active, compact flavour-balance reference.
- Sauces are organised by task first (Stir-fry, Glaze, Dipping, Dressing), with flavour profiles before a small set of named classics.
- Sauces open directly to the first task and flavour profile; there is no separate Sauce Builder page.
- Guides include a short sauce-building guide before the dough guides, including practical mixing notes for watery ingredients, oil, dried spices, and fresh aromatics.
- Marinades remain a separate deferred category; do not fold them into Sauces.
- Each sauce screen follows the same compact two-card rhythm as Meat and Pasta: the selected sauce parts and purpose first, then uses and substitutions. Do not add a universal formula, glossary, or standalone troubleshooting panel.
- Selecting a category, cut, or style immediately resolves the first valid downstream choices.
- Meat always resolves Meat, Cut, Detail, and Doneness in its route and view model.
- Detail and Doneness are shown only when the selected cut offers a meaningful choice. Their underlying arrays remain non-empty so defaults and canonical routes stay stable.
- Weight defaults to `100 g` and is preserved while changing selections in the current session.
- Dry-brine percentage is prominent and salt grams are authoritative.
- Dry-brine guidance shows Minimum and Best timing together; there is no timing selector.
- Dough formulas use flour weight as the basis, with flour at 100% and separate liquid, salt, leavening, and calculated gram outputs where the style supplies them.
- Bread Finish guidance includes Celsius-first internal temperature, a visual or texture cue, the cooking method, and cooling or resting guidance. Temperature is secondary to set and springiness for steamed buns.
- No salt type, teaspoons, tablespoons, pasta cooking-water salt, breadcrumbs, Back control, search, accounts, storage, or cooking-time estimates.

## Active catalogue

- Chicken: Whole bird, Breast, Thigh, Ground meat
- Beef: Steak, Ribeye, Beef ribs, Ground meat
- Pork: Chop, Tenderloin, Ribs, Ground meat
- Lamb: Chops, Leg, Rack, Shoulder
Ground meat stays under its parent meat because its salt ratio and temperature guidance are useful in the same reference flow. Its timing is expressed as an immediate option and a short resting option for firmer binding.

## Content integrity

Ratios are practical starting points, not universal laws. Keep them separate from safety-sensitive guidance and preserve source metadata internally. Culinary references, recipe conversions, community experience, and Amos's own tests can inform taste-oriented ratios. Do not render source links or citations in the public cooking flow.

The next approved bread values are candidate starting points pending source reconciliation and representative home testing:

- Everyday loaf: 66% water, 2% salt, 1.2% instant yeast; finish at 90°C / 194°F.
- Olive-oil focaccia: 75% water, 2% salt, 1% instant yeast, 5% olive oil; finish at 96°C / 205°F. Pan and finishing oil stay outside the dough ratio.
- Chinese steamed buns: 55% water, 0.5% salt, 1% instant yeast, 3% sugar, 2% oil; finish around 88°C / 190°F, secondary to a set, springy crumb with no wet dough.

Sauce parts express balance, not equal ingredient strength. Concentrated choices should be identified and introduced gradually. Marinades remain deferred as a separate bridge between dry brining and sauces; do not add a marinade calculator or guide in the next implementation.

## Approved terminology and discoverability

- Vinaigrette uses the visible balance label `Oil`, because its three-part component is specifically oil. Keep `Fat` everywhere else, including the generic sauce ingredient role and profiles that can use sesame paste, peanut butter, butter, or another non-oil fat.
- The Guides topic buttons remain in normal document flow. Do not make them sticky or floating on desktop or mobile.
- Keep calculator selection hashes canonical and shareable, but do not create an indexable page for every calculator combination.
- Add a meaningful semantic fallback to the homepage source and structured data to the public pages. Structured data must describe the site and reference content accurately; do not use `Recipe` schema.
- Add four concise, clean-URL reference pages for dry-brining by weight, meat internal temperatures, dough and bread ratios, and sauce ratios. They should teach transferable principles, reuse only approved site content, and link into the relevant calculator state rather than becoming recipes.
- Publishing and post-launch measurement are separate, explicitly authorised work. After deployment, verify live metadata, structured data, sitemap discovery, rendering, and performance before using Search Console data to decide any further SEO work.

## Visual identity

The interface is a light, restrained rustic cookbook: warm paper, soft ink, pandan-green selections, and one toasted-sesame recipe-margin rule. It must remain readable, compact, mobile-first, and free of blue theme inheritance, dark backgrounds, handwriting, overt cultural motifs, or clinical dashboard styling.
