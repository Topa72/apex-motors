# Apex Motors

High-gloss car dealership website for Apex Motors (Miami, FL): near-black surfaces, electric-blue accents, a filterable inventory grid and a live monthly payment calculator.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 3 · Motion (`motion/react`) · shadcn-style Radix UI primitives (Slider, Select, Dialog) · lucide-react

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the build
npm run lint     # oxlint
```

## Structure

```
src/
  App.tsx                    page composition; owns inventory filter state
  index.css                  design tokens (CSS vars) + base/component classes
  data/inventory.ts          vehicles, makes, types, filter logic
  data/images.ts             all photography URLs in one place
  lib/utils.ts               cn(), currency formatting, loan payment formula
  components/
    ui/                      slider, select, sheet (Radix, shadcn conventions)
    sections/                Navbar, Hero, TrustStrip, Inventory, Financing,
                             TradeIn, HowItWorks, Service, Reviews, FinalCTA, Footer
    VehicleCard.tsx          card with hover zoom + spec reveal
    SmartImage.tsx           <img> with an on-brand fallback if a photo fails
    FadeUp.tsx               scroll-triggered fade-up (staggered)
```

## Notes

- **Hero quick search** feeds the inventory filters (make, model text, max monthly payment) and scrolls to the grid; the payment cap and model show as removable chips in the sticky filter bar.
- **Payment calculator** uses the standard amortisation formula at 6.9% APR; on mobile the monthly figure pins to the bottom of the screen while a slider is being dragged.
- **Photography** comes from Unsplash placeholders in `src/data/images.ts`. Swap these for the dealership's own shots; if any URL fails, `SmartImage` shows a studio-gradient fallback instead of a broken image.
- Motion respects `prefers-reduced-motion`.
