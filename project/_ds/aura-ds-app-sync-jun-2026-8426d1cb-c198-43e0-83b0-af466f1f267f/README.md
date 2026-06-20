# AuraMark — using these components

AuraMark is a premium sleep / smart-mattress UI: a dark, frosted-glass aesthetic
layered over a soft ambient wallpaper, with a champagne-gold accent and the
Fraunces display serif for headings. These are the core primitives.

## Theme

Components read their colors from a global theme store, not from props. The theme
has a **dark** and a **light** palette and an accent color (gold · silver · blue ·
pink; gold is the default). The dark frosted look is the signature — compose on a
dark, slightly-gradient background so the translucent `Card` / `GlassTile`
surfaces read as frosted glass. `Screen` paints that ambient background for you.

## Type

- **`Title`** — screen headings in the Fraunces display serif (the editorial voice).
- **`Body`** — paragraph text with a named `variant` scale: `hero` (big stat
  numbers) · `headline` · `bodyLg` · `body` · `label` · `caption`. `dim` drops it
  to the secondary ink; `serif` switches to the display face.
- **`Label`** — dense row labels (settings rows, stat legends); `dim` for secondary.
- **`Caption`** — smallest step: hints, units, legends (dimmed by default).
- **`SectionLabel`** — uppercase, letter-spaced eyebrow heading a group of rows.

All visible text must go through one of these (they wrap React Native `Text`);
raw strings can't be dropped directly into `Card` / `GlassTile`.

## Surfaces

- **`Card`** — the defining frosted-glass panel. `highlight` for emphasis;
  `flat` for the plain bordered panel used on white login/survey screens.
- **`GlassTile`** — a lighter liquid-glass lens for inset stat tiles inside cards.
- **`Screen`** — full-bleed ambient wallpaper + glow; lay content above it.

## Controls

- **`Button`** — `variant` solid (filled gold) · ghost (translucent) · line (outlined).
- **`SegmentControl`**, **`Choice`**, **`Toggle`** are **controlled**: pass the
  current value/state and an `onPick` / `onToggle` / `onPress` handler that updates
  it. `Choice` does single-select (`value` + `onPick`) or multi (`multi` + `values`
  + `onToggle`).
- **`Pill`** — small status chip (`on` fills it with the accent).
- **`PremiumTag`** — champagne crown badge marking premium-only features.

## Fonts

The Fraunces display serif is served by the host app at runtime (not shipped in
this bundle); without it, headings fall back to the system serif.

# AuraDS (smart-mattress-cover@2.4.0)

This design system is the published smart-mattress-cover React library, bundled as a single
browser global. All 14 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.AuraDS`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.AuraDS.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { Body } = window.AuraDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Body />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<DsPreviewFrame>{children}</DsPreviewFrame>
```

## Tokens

52 CSS custom properties from smart-mattress-cover. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (2): `--aura-bg-top`, `--aura-text-dim`
- **spacing** (6): `--aura-space-xs`, `--aura-space-sm`, `--aura-space-md`, …
- **typography** (9): `--aura-font-display`, `--aura-font-display-med`, `--aura-type-hero-weight`, …
- **radius** (4): `--aura-radius-sm`, `--aura-radius-md`, `--aura-radius-lg`, …
- **shadow** (3): `--aura-shadow-knob`, `--aura-shadow-thumb`, `--aura-shadow-float`
- **other** (28): `--aura-bg`, `--aura-panel`, `--aura-panel-alt`, …

## Components

### general
- `Body`
- `Button`
- `Caption`
- `Card`
- `Choice`
- `GlassTile`
- `Label`
- `Pill`
- `PremiumTag`
- `Screen`
- `SectionLabel`
- `SegmentControl`
- `Title`
- `Toggle`
