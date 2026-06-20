# Aura — smart-sleep marketing site

Light-themed, champagne-gold marketing site for the Aura smart-mattress system.
Two pages — the product homepage and the buy page — built natively in
Vite + React + TypeScript from the Claude Design HTML/CSS/JS prototype.

## Layout

```
app/             Vite + React + TS application (the real codebase)
project/         Original Claude Design HTML/CSS/JS prototype (for reference)
chats/           Design-conversation transcripts (for reference)
```

## Run locally

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # → app/dist
npm run preview  # serve the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site with the right `base` for GitHub Pages and deploys to
`https://<owner>.github.io/<repo>/`.

## What's where

- `app/src/pages/Home.tsx` — `/` — full-bleed video hero, alternating
  feature stories (smart climate · AI sleep analysis · women's health),
  spec band, personas, pricing, FAQ, waitlist, closing CTA.
- `app/src/pages/Buy.tsx` — `/buy` — image gallery + sticky buy box
  (size / plan / qty / live total), what's-included, feature strip,
  plan compare, reviews, specs, FAQ, cart drawer + toast.
- `app/src/ds/` — native reimplementation of the AuraDS primitives
  (`Title`, `Body`, `Card`, `Button`, `Pill`, `Toggle`, …) with the
  resolved light + gold palette lifted verbatim from the published
  bundle's source.
- `app/src/scenes/` — animated SVG app demos (`MattressViz`,
  `SceneClimate`, `SceneWomen`, `SceneAnalysis`), `requestAnimationFrame`
  driven, gated to the in-view interval.
- `app/src/lib/motion.tsx` — motion context (speed / paused),
  `useLoop`, easing helpers, `useSharedLang` (中/EN persisted in
  `localStorage`).
- `app/public/assets/` — logo, mattress photo, three product videos.
