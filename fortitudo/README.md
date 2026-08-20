# Fortitudo ab Intus

Training + nutrition logger for the 300 / Lupus / Kallipygos programs.
Vite + React. No backend — each person's log lives in their own browser (localStorage).

## Run it locally
    npm install
    npm run dev

## Deploy
Already live at https://fortitudo-ab-intus-mikewhitaker.vercel.app
(Vercel project: `fortitudo-ab-intus`, team `mikewhitaker`)

    npx vercel --prod

## Where things are
- `src/App.jsx` — the whole app. Programs, form cues, and all UI.
  - `PROGRAMS` — the three training programs. Each exercise has
    `kind` ("lift" | "cardio" | "hold"), optional `pct` (% of 1RM),
    and optional `alts` (variation dropdown).
  - `CUES` — written form cues, shown when you tap an exercise name.
  - `COLS` — which input columns each `kind` shows.
- `src/main.jsx` — mounts the app, localStorage shim, service worker.
- `public/crest.jpg` — the crest, also used as the home-screen icon.

## Known next steps
- Real accounts + sync (Supabase) so data survives a lost phone
- "Copy last week's numbers" to prefill a session
- Rest timer between sets
