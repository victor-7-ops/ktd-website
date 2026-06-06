# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (runs type-check implicitly)
npm run lint     # ESLint
npm run start    # Serve production build locally
```

No test suite exists yet. TypeScript errors surface via `npm run build`.

## Architecture

Single-page Next.js 14 (App Router) site. The entire page is one scrolling document — `app/page.tsx` composes all 11 sections in order. There is no routing beyond the root.

### Key architectural decisions

**Hero background is three-tiered** — resolved client-side in `components/sections/Hero.tsx`:
1. **Video** (desktop, motion OK) — `public/video/hero.mp4`. Must be **H.264**, not H.265/HEVC — Chrome/Firefox don't support HEVC in `<video>`. The 3D scene renders underneath until `onCanPlay` fires so there's no flash.
2. **3D scene** (mobile or video unavailable) — `components/three/HeroScene.tsx` via React Three Fiber, loaded with `dynamic(..., { ssr: false })` because WebGL cannot run server-side.
3. **Static amber wash** (CSS only) — for `prefers-reduced-motion`.

**All 3D components are client-only** — any import of R3F/Three must be either inside a `"use client"` file or wrapped in `dynamic(..., { ssr: false })`.

**Design tokens live in two places** — `app/globals.css` (CSS custom properties, the source of truth) and mirrored into Tailwind via `@theme inline {}` so both `style={{ color: 'var(--amber)' }}` and `className="text-amber"` work. Never hardcode hex values; always use the token.

**Content data is in `lib/data/`** — `members.ts`, `discography.ts`, `achievements.ts`, `shows.ts`, `merch.ts` are plain TypeScript arrays. Edit these to update content without touching section components.

**Scroll reveals** use `components/ui/Reveal.tsx` — an `IntersectionObserver` wrapper that adds `.is-visible` to trigger the CSS transition defined in `globals.css`. `prefers-reduced-motion` is handled purely in CSS (final states are shown immediately).

### Design system

Aesthetic: **"Late Night City Pop"** — `#0A0A0F` base, `#E8A838` amber accent, warm `#F0EDE6` white (never pure `#fff`).

Font roles (registered as Tailwind aliases):
- `font-display` → Bebas Neue — hero name, section titles, big numbers
- `font-sans` → DM Sans — UI chrome, labels, buttons
- `font-serif` → Lora italic — bios, descriptions, quotes
- `font-mono` → JetBrains Mono — dates, tags, metadata

Global effects applied in `layout.tsx` / `globals.css`:
- `.grain` div — fixed SVG noise overlay, `z-index: 1000`, `pointer-events: none`
- `CustomCursor` — amber dot + lagging ring, hidden on touch devices
- Vignette gradients are inlined per-section, not global

### Environment variables

Create `.env.local` (none are required to run):
```
NEXT_PUBLIC_FORMSPREE_ID=      # Contact form (Section 11)
NEXT_PUBLIC_MAILCHIMP_URL=     # Newsletter embed (Social section)
NEXT_PUBLIC_BIG_CARTEL_SHOP=  # Merch shop handle
```

### Deployment

`git push` to `master` → Vercel auto-deploys via GitHub integration. Manual: `vercel --prod`.

If replacing `public/video/hero.mp4`: re-encode to H.264 first:
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -movflags +faststart -vf scale=1280:720 -an public/video/hero.mp4
```
