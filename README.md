# find-my-ev

`find-my-ev` is a frontend EV discovery and comparison app built with Next.js.

## What It Does

- Browse EV models in a card list
- Search with fuzzy matching (`Fuse.js`)
- Filter by brand, max price, and minimum range
- Sort by price, range, and charging speed
- Compare up to 4 vehicles side by side
- Persist compare selections in `localStorage`

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Zustand
- Fuse.js

## Getting Started

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Project Structure

```text
src/
  app/            # routes and pages
  components/     # UI components
  data/           # static EV data
  lib/            # i18n + stores
  types/          # shared types
```

## Notes

- Vehicle data is currently static (`src/data/cars.ts`).
- The project is frontend-only for now.
