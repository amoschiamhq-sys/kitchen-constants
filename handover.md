# Kitchen Constants — Product Requirements & Design Handover

## 1. Product summary

**Kitchen Constants** is a mobile-first cooking reference and calculator for everyday home cooks.

Its purpose is to give users the essential numbers they need while cooking, without requiring repeated web searches or reading long recipes.

The product combines:

- Ingredient ratios
- Salt and marinade calculations
- Professional target internal temperatures
- Egg boiling times
- Pasta and dough ratios
- Simple, connected results for the same ingredient

**Working tagline:**  
**The numbers every cook needs.**

---

## 2. Product vision

Kitchen Constants should feel like a dependable pocket reference for cooking by weight and temperature.

The experience should be:

- Fast
- Clear
- Practical
- Friendly
- Mobile-first
- Mostly tap-based
- Free of unnecessary explanation
- Precise without feeling scientific

The mathematical identity should be subtle. The user should feel that the answers are well calculated, but the interface should not feel like technical software.

---

## 3. Target user

The primary user is an **everyday home cook**.

They are comfortable using a kitchen scale and a food thermometer, but they do not want to remember or repeatedly search for:

- Salt percentages
- Brine ratios
- Marinade quantities
- Internal temperatures
- Egg boiling times
- Pasta and dough ratios

The user is not necessarily looking for recipes. They want reliable cooking numbers.

---

## 4. Core product principle

The website should show useful constants **before the user enters any weight**.

For example, after selecting:

**Chicken → Whole chicken → Dry brine**

The page should immediately show:

- Recommended salt ratio: **1.1%**
- Suggested range: **0.9–1.3%**
- Professional target internal temperature
- A short note about where to measure the temperature

The weight field then acts as an optional calculator:

**Chicken weight: 1,500 g**

Result:

- Salt required at 1.1%: **16.5 g**
- Suggested range: **13.5–19.5 g**

This reduces clicks and lets users calculate manually when they prefer.

The calculator supports the user; it should not hide the underlying ratio.

---

## 5. Core user flow

The primary interaction model is:

**Choose category → choose ingredient or cut → choose preparation → view constants → optionally enter weight → see calculated amount**

The website should not require search in version one.

Navigation should be click-based, with large, clear tap targets.

Example flow:

1. Chicken
2. Whole chicken
3. Dry brine
4. See the recommended percentage immediately
5. Optionally enter the chicken weight
6. See salt quantity and connected internal-temperature guidance

---

## 6. Launch categories

Version one should include:

### Meat and fish

- Chicken
- Beef
- Pork
- Fish

### Other cooking references

- Eggs
- Brines and marinades
- Pasta and dough

The following can be added later:

- General sauces
- Rice and grains
- Baking ratios
- Pressure cooking
- Search
- Accounts
- Sharing
- More advanced temperature guidance

---

## 7. Category structure

### 7.1 Chicken

Suggested parts:

- Whole chicken
- Breast
- Thigh
- Drumstick
- Wings

Relevant selections may include:

- Bone-in
- Boneless
- Skin-on
- Skinless
- Dry brine
- Wet brine
- Marinade
- Internal temperature only

The interface should ask only for inputs that materially affect the result.

For example:

- Whole chicken: weight
- Chicken breast: thickness may matter more than total weight for future time-based guidance, but version one does not include cooking-time estimates
- Brining and marinades: ingredient weight

### 7.2 Beef

Suggested cuts or types:

- Steak
- Roast
- Minced beef or burger

Doneness options should remain simple:

- Medium-rare
- Medium

Do not add rare, medium-well, or well-done in version one unless later user testing shows demand.

### 7.3 Pork

Suggested types:

- Chop
- Tenderloin
- Roast
- Minced pork

Use standard professional target-temperature guidance.

### 7.4 Fish

Suggested types:

- Fillet
- Whole fish
- Salmon
- White fish

Keep the structure simple and avoid an overly detailed species database in version one.

### 7.5 Eggs

Initial flow:

**Eggs → Boiled → Soft / Medium / Hard**

Show:

- Cooking time
- Whether the timing starts from boiling water
- Cooling guidance, if needed

Eggs are an exception: time is the primary output rather than internal temperature.

### 7.6 Brines and marinades

Brines and marinades should be organized by purpose rather than cuisine.

Suggested options:

- Dry brine
- Wet brine
- Basic savoury marinade
- Soy-based marinade
- Acidic marinade
- Yoghurt-based marinade
- Oil-and-herb marinade
- Glaze-style marinade

Cuisine filters can be considered later.

### 7.7 Pasta and dough

The main input should be flour weight.

Examples:

- Fresh egg pasta
- Water-based pasta
- Simple dough ratios

The result should show the base ratio immediately and calculate ingredient quantities after flour weight is entered.

Example:

- Egg-to-flour ratio
- Water-to-flour ratio
- Optional hydration range

---

## 8. Calculator behavior

### 8.1 General rule

Always show the constant first.

Then allow the user to enter weight to calculate the exact quantity.

Example:

**Recommended salt ratio: 1.1%**  
**Suggested range: 0.9–1.3%**

Input:

**Food weight: 1,500 g**

Output:

**Salt: 16.5 g**  
**Range: 13.5–19.5 g**

### 8.2 Percentage basis

Percentages should be calculated against the **main ingredient weight**.

Examples:

- Chicken brine: percentage of chicken weight
- Beef dry brine: percentage of beef weight
- Pasta dough: egg or water relative to flour weight
- Marinade: ratios relative to the food weight or another clearly stated base ingredient

This reflects how users normally shop and cook:

- “I have a 1.5 kg chicken.”
- “I have 400 g of flour.”

### 8.3 Recommended value and range

Each ratio should show:

- One recommended value
- A small practical range

Example:

- Recommended: **1.0%**
- Range: **0.8–1.2%**

The range should not create an extra decision screen. It should simply appear beneath the recommendation.

### 8.4 Reverse calculation

Reverse calculation is not a priority for version one.

The ingredient or food should come first.

Example:

- Select chicken
- Select dry brine
- Enter chicken weight
- Calculate salt

Do not begin with an arbitrary salt quantity and ask the user to choose a meat afterward.

### 8.5 Units

Primary units:

- Grams
- Kilograms when helpful
- Celsius

Do not use:

- Teaspoons
- Tablespoons
- Cups
- Ounces as the default
- Volume approximations for ingredients that can be weighed

An instant metric/imperial toggle may be added later as a bonus, but the product should be designed around metric measurements.

---

## 9. Connected results

Related information should appear on the same result screen.

For a selected meat and preparation, the user should not need to open a separate internal-temperature calculator.

Example:

### Prepare

- Dry-brine ratio: 1.1%
- Salt required: 16.5 g
- Suggested range: 13.5–19.5 g

### Finish

- Target internal temperature
- Where to insert the thermometer
- Resting guidance only when useful

This creates one coherent answer without overcrowding the interface.

Do not include estimated oven or cooking times in version one.

Internal temperature is the key cooking output.

---

## 10. Wet brine and dry brine

Wet brine and dry brine must be clearly separated because percentage conventions can differ.

### Dry brine

The percentage is based on the food weight.

Example:

- Meat weight: 1,500 g
- Salt ratio: 1.1%
- Salt required: 16.5 g

### Wet brine

Version one should still begin from the food weight, because that is the quantity the user usually knows.

The interface must clearly explain the calculation basis and avoid silently mixing:

- Salt as a percentage of food weight
- Salt as a percentage of water weight
- Salt as a percentage of total system weight

The chosen method must be consistent throughout the site.

The result should show the underlying percentage even before weight is entered.

---

## 11. Marinades

Marinades are the main sauce-related feature for version one.

They should be organized by use, not by cuisine.

Each marinade should show:

- The base ratio immediately
- Ingredient amounts after food weight is entered
- Salt contribution where relevant
- A simple suggested range
- Connected target internal temperature for the selected food

Special attention is needed for salty liquid ingredients such as soy sauce.

Soy sauce must not be treated as gram-for-gram equivalent to pure salt.

A later data model should account for:

- Salt concentration of the ingredient
- Brand variation
- Recommended assumptions
- Clear labeling when the value is approximate

Version one may use a standard assumption, but the assumption should be documented internally even if it is not shown prominently to the user.

---

## 12. Food safety and temperature guidance

The product should focus on **professional target temperatures**.

It does not need to lead with conservative government guidance on every result.

However:

- Values must be carefully researched before launch
- The site should avoid implying that one temperature is universally safe regardless of hold time
- A short safety note can appear where relevant
- Advanced time-and-temperature pasteurization guidance is outside the first version

For version one:

- Beef: medium-rare and medium only
- Chicken: standard professional target
- Pork: standard professional target
- Fish: simple professional target guidance

Do not add special warnings for pregnancy, immunocompromised users, or raw egg in the initial interface.

---

## 13. Inputs should be context-aware

Do not show every possible field on every calculator.

Only request the input that matters.

Examples:

- Whole chicken: weight
- Steak: doneness selection; thickness can be reserved for future cooking-time guidance
- Brine: food weight
- Pasta dough: flour weight
- Eggs: desired doneness

Because version one does not estimate cooking time, oven type is unnecessary.

The starting condition of the food—room temperature or refrigerator-cold—is also unnecessary unless future features use it.

Frozen-food guidance is not part of version one.

---

## 14. Favourites

Favourites can be included as a simple convenience feature.

They should be stored locally on the device without requiring an account.

Examples:

- Whole chicken dry brine
- Medium-rare steak
- Fresh egg pasta
- Soft-boiled eggs

Favourites may appear as shortcuts near the top of the home screen.

This feature is optional for the earliest prototype but should be considered in the information architecture.

---

## 15. Search and sharing

Version one should not include search.

The product should be easy enough to navigate through visible categories and ingredient choices.

Version one also does not need:

- Copy button
- Share button
- Accounts
- Profiles
- Cloud synchronization

The focus should remain on speed and clarity.

---

## 16. Mobile-first interface

The website must be designed primarily for phones.

Key requirements:

- Large tap targets
- Minimal text
- One main decision per screen
- Numeric keypad for weight input
- Strong visual hierarchy
- Clear units beside every input and result
- Results visible without excessive scrolling
- No dense tables on small screens
- No hover-dependent interactions
- No long recipes or articles
- No hidden ratio behind the calculator

A calculator page should ideally show the recommended constant, input, and calculated output within one phone screen or a very short scroll.

---

## 17. Visual direction

Use a simple, easy-to-read design first.

The preferred direction is a restrained notebook-inspired style:

- Warm off-white background
- Dark charcoal text
- One muted food-inspired accent color
- Clear sans-serif typography
- Light ruled-line or notebook details used sparingly
- Large numbers
- Clean cards
- Friendly, practical language

The notebook concept should not become decorative or handwritten to the point of reducing readability.

The mathematical theme should remain mostly hidden.

Subtle ideas may include:

- Percentage symbols
- Small grid details
- Formula-like alignment
- A compact `Kc` logo mark

The site should not resemble laboratory software or a scientific calculator.

---

## 18. Brand

### Name

**Kitchen Constants**

The name communicates:

- Reliable numbers
- Repeatable cooking guidance
- A subtle mathematical identity
- Broad usefulness across temperatures, ratios, eggs, marinades, and doughs

### Tagline

Preferred:

**The numbers every cook needs.**

Alternative options:

- Simple numbers for better cooking.
- Everyday cooking, calculated.
- Reliable numbers. Better results.
- Ratios, temperatures, done.

### Logo direction

A simple `Kc` mark is a suitable starting point.

It can resemble a mathematical constant while remaining warm and approachable.

Avoid overly literal logo concepts such as combining many utensils, scales, thermometers, and formulas into one icon.

---

## 19. Tone of voice

The language should be:

- Friendly
- Practical
- Direct
- Confident
- Concise

Use:

- “Enter your chicken weight”
- “Recommended salt ratio”
- “Target internal temperature”
- “Measure at the thickest part”

Avoid:

- Long culinary explanations
- Scientific jargon
- Lifestyle copy
- Recipe storytelling
- Overly cautious disclaimers on every screen
- Unclear phrases such as “season to taste” when the purpose is to provide a measurable ratio

---

## 20. Initial prototype recommendation

The first complete prototype should focus on one representative flow:

**Home → Chicken → Whole chicken → Dry brine**

The page should immediately display:

- Recommended ratio
- Suggested range
- Target internal temperature

Then provide:

- Chicken weight input
- Calculated salt amount
- Calculated range
- A short thermometer-placement note

This one flow tests:

- Category navigation
- Ingredient navigation
- Preparation selection
- Constant-first presentation
- Weight-based calculation
- Connected results
- Mobile layout
- Typography and brand style

After this pattern is validated, it can be extended to:

- Wet brine
- Other chicken cuts
- Beef doneness
- Pork
- Fish
- Eggs
- Marinades
- Pasta and dough

---

## 21. Example screen content

### Home

**Kitchen Constants**  
*The numbers every cook needs.*

Categories:

- Chicken
- Beef
- Pork
- Fish
- Eggs
- Brines & marinades
- Pasta & dough

Optional section:

**Favourites**

### Chicken

Choose:

- Whole chicken
- Breast
- Thigh
- Drumstick
- Wings

### Whole chicken

Choose:

- Dry brine
- Wet brine
- Marinade
- Internal temperature

### Whole chicken — dry brine

**Recommended salt ratio**  
**1.1%**

Suggested range: **0.9–1.3%**

**Chicken weight**

[ 1,500 ] g

**Salt needed**  
**16.5 g**

Suggested range: **13.5–19.5 g**

**Target internal temperature**  
[Professional target value to be confirmed during content research]

Measure at the thickest part without touching bone.

---

## 22. Content and data requirements

Before launch, each calculator entry should have a structured record containing fields such as:

- Category
- Ingredient
- Cut or type
- Bone-in or boneless, where relevant
- Preparation method
- Recommended ratio
- Minimum recommended ratio
- Maximum recommended ratio
- Percentage basis
- Input type
- Input unit
- Output ingredients
- Target internal temperature
- Doneness
- Thermometer-placement note
- Resting note
- Safety note
- Internal methodology or source notes
- Version or review date

The interface does not need to show all these fields, but the data model should support them.

---

## 23. Out of scope for version one

Do not include these in the initial release:

- Full recipes
- Cooking-time estimates for meat
- Oven-temperature recommendations
- Conventional versus fan oven settings
- Frozen-food cooking
- Instant Pot or pressure-cooker section
- General sauce library beyond marinades
- Search
- Accounts
- Social features
- User-generated content
- Long source or methodology pages
- Advanced pasteurization charts
- Pregnancy or medical-risk modes
- Extensive cuisine filters
- Advertising in the initial interface

Advertising may be considered later if the site becomes popular, but the layout should not be designed around ads at launch.

---

## 24. Success criteria for version one

Kitchen Constants succeeds if a user can:

1. Reach the relevant food or technique with a few taps
2. See the recommended ratio before entering any numbers
3. Enter a weight in grams
4. Receive an exact calculated amount
5. See the useful range
6. See the connected internal temperature when relevant
7. Understand the result without reading an article
8. Use the page comfortably with one hand on a phone

The experience should feel quicker than searching the web, opening a recipe, or using a separate calculator.
