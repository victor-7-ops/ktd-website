# Handoff — KTD Website

Last updated: 2026-08-03. State at commit `ea04db3` (pushed, `origin/master` synced).

## Repo

```bash
git clone https://github.com/victor-7-ops/ktd-website.git
cd ktd-website
npm i
cp .env.example .env.local   # optional, nothing required to run
npm run dev                  # localhost:3000
```

## What this is

Single-page Next.js 16 (App Router) band site — "KTD". One scrolling doc, `app/page.tsx` composes 11 sections. No routing beyond root.

Full architecture/design-system notes: [CLAUDE.md](CLAUDE.md) — read this first, it's the source of truth for conventions (hero video/3D fallback tiering, design tokens, content-data pattern, etc).

## Commands

```bash
npm run dev      # dev server
npm run build    # prod build, surfaces TS errors
npm run lint     # ESLint
npm test         # Playwright smoke suite (auto-installs on first run)
```

## Current status

All 7 improvement plans in `plans/` are DONE (see `plans/README.md` for the table). Nothing pending in that queue.

Recent commit history (newest first):
- `ea04db3` test: add QA infrastructure and functional Playwright suite
- `362c6de` feat: execute all 7 improvement plans
- `780d398` docs: add CLAUDE.md with architecture and dev commands
- `f6c73fc` fix: replace HEVC hero video with H.264 for universal browser support
- `da6b105` fix: robust video hero — 3D fallback beneath until canPlay fires

Working tree was clean, fully pushed, no branches ahead/behind at handoff time.

## Open decisions / known gaps (not bugs — need a maintainer call)

From `plans/README.md` "Direction findings":

1. **EPK PDF missing** — `components/sections/Contact.tsx` links `/ktd-epk.pdf`, file doesn't exist in `public/` → 404s. Either produce the PDF or hide the card.
2. **Media section placeholders** — `components/sections/Media.tsx` has a YouTube embed slot with no video ID yet; photos are placeholders. Section is fully built, just needs real assets.
3. **Merch commerce undecided** — `Merch.tsx` has a TODO: Big Cartel vs Shopify. `NEXT_PUBLIC_BIG_CARTEL_SHOP` env var is documented in `.env.example` but not read anywhere in code yet. Needs a decision before wiring — use `/improve plan <decision>` to spec it once chosen.

## Content still needs filling in (real data, not placeholders)

| Where | What's missing | File |
|---|---|---|
| Press photos | Real images — currently placeholder blocks, not `<Image>` | `components/sections/Media.tsx:78` |
| YouTube video | No video ID set — embed slot built, waiting on ID | `components/sections/Media.tsx:91,99` |
| EPK PDF | `/ktd-epk.pdf` linked but file doesn't exist in `public/` → 404 | `components/sections/Contact.tsx:179` |
| Merch checkout | No commerce backend wired — Big Cartel vs Shopify undecided | `lib/data/merch.ts`, `.env.example` `NEXT_PUBLIC_BIG_CARTEL_SHOP` |
| Next show date | `shows[0].date` is `"TBA"` — fill in when booked | `lib/data/shows.ts:3` |

Everything else in `lib/data/` (members, discography, achievements) is real content, already filled.

Rejected findings (don't re-flag these):
- `npm audit` moderate advisories are a transitive `postcss` pin inside `next` itself — no fix without a breaking Next downgrade.
- Index-as-key in Shows/Media lists — data is static, never reordered, harmless.
- `overflow-x: hidden` on body — intentional (grain overlay + custom cursor).

## Gotchas worth knowing before touching things

- **Hero video must stay H.264**, not HEVC — Chrome/Firefox don't play HEVC in `<video>`. If replacing `public/video/hero.mp4`, re-encode first (command in CLAUDE.md).
- **All Three.js/R3F code must be client-only** — wrap in `dynamic(..., { ssr: false })` or keep inside a `"use client"` file. WebGL can't run server-side.
- **Never hardcode colors** — design tokens live in `app/globals.css`, mirrored into Tailwind via `@theme inline {}`. Use the token, not a hex value.
- **Content edits go in `lib/data/*.ts`** (members, discography, achievements, shows, merch) — not in the section components.
- Deploy is automatic: `git push` to `master` → Vercel picks it up via GitHub integration.

## Env vars (`.env.example`, none required to run)

```
NEXT_PUBLIC_FORMSPREE_ID=      # Contact form
NEXT_PUBLIC_MAILCHIMP_URL=     # Newsletter embed
NEXT_PUBLIC_BIG_CARTEL_SHOP=   # Reserved, not yet wired (see open decision #3 above)
```
