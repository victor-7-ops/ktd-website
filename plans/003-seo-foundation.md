# Plan 003: SEO foundation — metadataBase, OG image, sitemap, robots, JSON-LD

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- app/ lib/data/`
> If `app/layout.tsx` or the data files changed, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf (SEO/discoverability)
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

A band site lives or dies on shares and search. Today the site has basic `metadata` in `app/layout.tsx` but no `metadataBase` (so OG URLs can't resolve absolutely), no Open Graph image (shared links render as bare text on Instagram DMs, Messenger, X, Discord), no `sitemap.xml`/`robots.txt`, and no structured data — Google cannot identify KIDZ THESE DAYS as a `MusicGroup` or surface releases/shows. The content needed for JSON-LD already exists as typed arrays in `lib/data/`, so this is mostly assembly.

## Current state

- `app/layout.tsx:35-44` — the only metadata today:

```tsx
export const metadata: Metadata = {
  title: "KIDZ THESE DAYS — Cebu City Indie Pop-Rock",
  description:
    "Official site of KIDZ THESE DAYS (KTD), a Cebu City indie pop-rock band signed to Unstable Records. Indie Pop-Rock · OPM · City Pop · Funk.",
  openGraph: {
    title: "KIDZ THESE DAYS",
    description: "Cebu City indie pop-rock. We aim to flip that script.",
    type: "website",
  },
};
```

- `app/` contains only `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`. No `sitemap.ts`, `robots.ts`, or `opengraph-image.*`.
- `lib/data/discography.ts` — 4 releases with `title`, `year`, `label`, `credit`. `lib/data/shows.ts` — shows with `date`, `name`, `venue`, `status`. `lib/data/members.ts` — band members.
- Framework: Next.js 16, App Router. Tech facts: file-convention metadata routes (`app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` with `ImageResponse` from `next/og`) work in this version.
- Design tokens for the OG image: background `#0A0A0F`, amber `#E8A838`, warm white `#F0EDE6`. Display font is Bebas Neue (Google font; for `ImageResponse` either fetch the font in the route or use a bold system stack — fetching is preferred but if it complicates the build, system bold is acceptable).
- **Production URL is not recorded in the repo.** The site deploys via Vercel. Use a single constant so it's changed in one place (see Step 1) and default it to `https://ktd-website.vercel.app` with a loud comment — but first check for a custom domain (STOP condition if you find conflicting evidence).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Build + typecheck | `npm run build` | exit 0; route list includes `/sitemap.xml`, `/robots.txt`, `/opengraph-image` |
| Lint | `npm run lint` | exit 0 |
| Dev check | `npm run dev` then fetch `http://localhost:3000/sitemap.xml` | valid XML |

## Suggested executor toolkit

- If the `seo` or `vercel:nextjs` skill is available in your environment, consult it for App Router metadata-route conventions before Step 2.

## Scope

**In scope**:
- `lib/site.ts` (create — site URL + shared constants)
- `app/layout.tsx` (metadata only — do not touch the JSX body)
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (create)
- `components/seo/JsonLd.tsx` (create), wired into `app/page.tsx` (one-line import + render)

**Out of scope**:
- Any visual/JSX change to sections or layout body.
- `lib/data/*.ts` content changes (read them, don't edit them).
- Analytics, Search Console verification tags (need account values the repo doesn't have).

## Git workflow

- Branch: `advisor/003-seo-foundation`
- Conventional commits, e.g. `feat: add OG image, sitemap, robots, and MusicGroup JSON-LD`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create `lib/site.ts`

```ts
// Single source of truth for the canonical origin.
// TODO(owner): replace with the custom domain when one is connected.
export const SITE_URL = "https://ktd-website.vercel.app";
export const SITE_NAME = "KIDZ THESE DAYS";
export const SITE_DESCRIPTION =
  "Official site of KIDZ THESE DAYS (KTD), a Cebu City indie pop-rock band signed to Unstable Records. Indie Pop-Rock · OPM · City Pop · Funk.";
```

**Verify**: `npm run lint` → exit 0.

### Step 2: Extend `app/layout.tsx` metadata

Replace the `metadata` export (keep title/description text identical, importing from `lib/site.ts` where it avoids duplication):

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KIDZ THESE DAYS — Cebu City Indie Pop-Rock",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "KIDZ THESE DAYS",
    description: "Cebu City indie pop-rock. We aim to flip that script.",
    type: "website",
    url: "/",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "KIDZ THESE DAYS",
    description: "Cebu City indie pop-rock. We aim to flip that script.",
  },
};
```

**Verify**: `npm run build` → exit 0.

### Step 3: `app/robots.ts` and `app/sitemap.ts`

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
```

**Verify**: `npm run build` → route table lists `/robots.txt` and `/sitemap.xml`.

### Step 4: `app/opengraph-image.tsx`

Use `ImageResponse` from `next/og`. 1200×630, background `#0A0A0F`, the band name in huge bold letters in `#F0EDE6` with an `#E8A838` accent line/tagline ("Cebu City Indie Pop-Rock"). Keep it simple — solid background, two text blocks, an amber bar. Export `alt`, `size = { width: 1200, height: 630 }`, `contentType = "image/png"`. Match the site's restrained aesthetic; no gradients required.

**Verify**: `npm run build` → exit 0; then `npm run dev` and open `http://localhost:3000/opengraph-image` → a PNG renders showing the band name.

### Step 5: JSON-LD component

Create `components/seo/JsonLd.tsx` (server component, no `"use client"`):

```tsx
import { discography } from "@/lib/data/discography";
import { members } from "@/lib/data/members";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE_NAME,
    alternateName: "KTD",
    url: SITE_URL,
    genre: ["Indie Pop-Rock", "OPM", "City Pop", "Funk"],
    foundingDate: "2022-11",
    foundingLocation: { "@type": "Place", name: "Cebu City, Philippines" },
    recordLabel: "Unstable Records",
    member: members.map((m) => ({ "@type": "Person", name: m.name })),
    track: discography.map((d) => ({
      "@type": "MusicRecording",
      name: d.title,
      datePublished: d.year,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Notes: read `lib/data/members.ts` first and use its actual field names (the excerpt assumes `name`; adjust if different). All values come from repo data — `JSON.stringify` over static typed arrays, no user input, so the `dangerouslySetInnerHTML` here is safe and is the standard JSON-LD pattern.

Wire it into `app/page.tsx`: import and render `<JsonLd />` as the first child of `<main>`.

Skip `MusicEvent` markup: the only upcoming show is "TBA" with no date — schema.org events require a startDate. Leave a one-line comment in `JsonLd.tsx` noting events can be added when `lib/data/shows.ts` has a dated upcoming show.

**Verify**: `npm run build` → exit 0. Then `npm run dev`, `view-source` of `/` contains `application/ld+json` with `"@type":"MusicGroup"`. Paste the JSON block into https://validator.schema.org/ if reachable; otherwise confirm it is valid JSON via any JSON parser.

## Test plan

Build-gate verification per step. If plan 006's smoke test exists, add assertions: `GET /sitemap.xml` → 200, `GET /robots.txt` → 200, page HTML contains `application/ld+json`.

## Done criteria

- [ ] `npm run build` exits 0 and lists `/sitemap.xml`, `/robots.txt`, `/opengraph-image` routes
- [ ] `npm run lint` exits 0
- [ ] Rendered page source contains `application/ld+json` with `MusicGroup`
- [ ] `grep -n "metadataBase" app/layout.tsx` → 1 match
- [ ] Only in-scope files modified/created (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- You find evidence of a real custom domain (e.g. in Vercel config, README, or env) that contradicts the `SITE_URL` default — report it rather than guessing.
- `next/og` `ImageResponse` fails to build after two attempts (version-specific API drift) — report the exact error.
- `lib/data/members.ts` shape differs so much that the JSON-LD mapping is ambiguous.

## Maintenance notes

- When a custom domain is connected, update `SITE_URL` in `lib/site.ts` — everything else derives from it.
- When a dated show is added to `shows.ts`, extend `JsonLd.tsx` with `MusicEvent` (and consider `offers` for the ticket URL).
- Reviewer: confirm the OG image renders the band name legibly at thumbnail size, and that no invented facts entered the JSON-LD (all values must trace to `lib/data/` or the footer copy).
