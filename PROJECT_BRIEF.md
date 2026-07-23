# Kitchen Constants project brief

## Product

Kitchen Constants is a fast cooking reference for home cooks. Its current job is to let someone choose a meat, cut, detail, and doneness; immediately see a dry-brine percentage and internal-temperature guidance; and optionally change a default `100 g` weight to calculate salt in grams.

Tagline: **Measure twice. Season once.**

## Approved experience

- One compact page; no multi-screen preparation flow.
- Button-style links for Meat, Cut, Detail, and Doneness.
- The first valid cut, detail, and doneness resolve automatically.
- Detail and Doneness stay visible even when only one choice exists.
- Prepare and Finish cards appear immediately.
- Weight defaults to `100 g` and is preserved during selection changes in the current session.
- Dry-brine percentage is the dominant result; salt grams are authoritative.
- No salt type, teaspoons, tablespoons, breadcrumbs, Back control, search, sharing, accounts, or cooking-time estimates.

## Active catalogue

- Chicken: Whole chicken, Breast, Thigh, Ground poultry
- Beef: Steak, Ribeye, Beef ribs, Ground 80/20
- Pork: Chop, Tenderloin, Ribs, Ground pork
- Lamb: Chops, Leg, Rack, Shoulder
- Seafood: Scallops, Shrimp, Fish

Bone status is a Detail, not a lamb cut. Every cut must expose at least one Detail and one Doneness choice.

## Visual identity

The interface is a light, restrained rustic cookbook: warm paper, soft ink, pandan-green selections, and a toasted-sesame recipe-margin rule. It must remain highly readable, compact, mobile-first, and free of blue theme inheritance, dark backgrounds, handwriting, overt cultural motifs, or clinical dashboard styling.

## Content integrity

Use only reviewed culinary values with preserved source metadata. When guidance has not been reviewed, keep the selected controls stable and show `Awaiting content review` in the affected result card.

## Success criteria

A user can reach an answer in a few taps, understand the percentage before editing weight, get exact grams immediately, see connected temperature guidance, and operate the page comfortably at 320 px without horizontal scrolling.
