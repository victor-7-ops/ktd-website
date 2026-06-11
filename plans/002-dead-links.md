# Plan 002: Eliminate dead `#` links — real URLs or honest disabled states

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- lib/data/discography.ts lib/data/shows.ts components/sections/Hero.tsx components/sections/Social.tsx components/sections/Contact.tsx components/sections/Shows.tsx components/sections/Merch.tsx components/ui/AlbumCarousel.tsx`
> If any in-scope file changed, compare the "Current state" excerpts against
> the live code before proceeding; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

The site's primary job is routing fans to streams, tickets, and merch. Fifteen CTAs across the site point at `href="#"`, which scrolls to the top of the page: every "Play on Spotify" button, the hero's Instagram/Spotify/YouTube links, four of six Social platform cards, the Contact direct links for Spotify/YouTube, the "Get Tickets" button, and every merch "Add to Cart". After this plan, links with known URLs work, and links whose URLs aren't known yet render as visibly disabled non-links instead of lying.

**Key principle**: you do NOT know the band's real URLs. Do not invent or guess Spotify/YouTube/Apple Music URLs. The plan makes the data layer support `null` ("not yet available") and the UI render that state honestly. The only real URL currently known is Instagram: `https://instagram.com/kidzthesedaysofficial`.

## Current state

All placeholder URLs are the literal string `"#"`:

- `lib/data/discography.ts:9-11` (and 3 more albums) — `spotify: "#", apple: "#", youtube: "#"` on each of 4 releases.
- `lib/data/shows.ts:7` — upcoming show has `ticketUrl: "#"`.
- `components/sections/Hero.tsx:182-190` — three footer-of-hero links: `<a href="#">Instagram</a>`, `Spotify`, `YouTube`.
- `components/sections/Social.tsx:5-11` — platform array; Instagram has a real URL, Spotify/YouTube/Apple Music/Facebook have `url: "#"`, TikTok is `disabled: true` with `url: "#"`. Card render at lines 42–52 always emits an `<a>`.
- `components/sections/Contact.tsx:10-15` — `directLinks` array; Spotify and YouTube have `url: "#"`.
- `components/sections/Shows.tsx:49-55` — `href={show.ticketUrl ?? "#"}` renders "Get Tickets".
- `components/sections/Merch.tsx:56-63` — "Add to Cart" `<a href="#">` with a TODO to swap to Big Cartel.
- `components/ui/AlbumCarousel.tsx:77-82` — `<a href={album.spotify}>▶ Play on Spotify</a>`.

Conventions: data lives in `lib/data/*.ts` as plain typed arrays; components import and map. Styling uses token-based Tailwind classes; the existing disabled treatment is in `Social.tsx:44-48` (`cursor-default border-[var(--border)] text-gray-dim` + reduced opacity on the card).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Build + typecheck | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Dead-link census | `grep -rn "\"#\"" components lib app` | (see done criteria) |

## Scope

**In scope**:
- `lib/data/discography.ts`, `lib/data/shows.ts`
- `components/sections/Hero.tsx`, `Social.tsx`, `Contact.tsx`, `Shows.tsx`, `Merch.tsx`
- `components/ui/AlbumCarousel.tsx`

**Out of scope**:
- `components/sections/Media.tsx` — its YouTube embed slot is a content task (direction finding), not a link fix.
- Building any Big Cartel/Shopify integration — merch buttons become honest disabled states; commerce wiring is a separate decision.
- Inventing real streaming/social URLs — see Key principle above.

## Git workflow

- Branch: `advisor/002-dead-links`
- Conventional commits, e.g. `fix: render unavailable links as disabled states instead of "#"`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Change data shape — `"#"` becomes `null`

In `lib/data/discography.ts`, change every `spotify: "#"`, `apple: "#"`, `youtube: "#"` to `null`. Add an explicit type so consumers must handle null:

```ts
export interface Release {
  title: string;
  credit: string | null;
  year: string;
  duration?: string;
  label: string;
  chapter: string;
  desc: string;
  spotify: string | null;
  apple: string | null;
  youtube: string | null;
  accent: string;
  highlight: boolean;
}
export const discography: Release[] = [ ... ];
```

In `lib/data/shows.ts`, change the upcoming show's `ticketUrl: "#"` to `ticketUrl: null`.

**Verify**: `npm run build` → FAILS with type errors at the consuming components (this confirms the type is enforced; the next steps fix them). If it passes, the consumers were not type-checked — STOP and report.

### Step 2: AlbumCarousel — conditional Spotify button

In `components/ui/AlbumCarousel.tsx` (lines 77–82), render the Play button only when a URL exists, otherwise a disabled-styled span:

```tsx
{album.spotify ? (
  <a href={album.spotify} target="_blank" rel="noopener noreferrer"
     className="mt-2 rounded-full bg-amber px-6 py-2.5 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow">
    ▶ Play on Spotify
  </a>
) : (
  <span className="mt-2 rounded-full border border-[var(--border)] px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-gray-dim">
    Streaming link coming soon
  </span>
)}
```

**Verify**: `npm run lint` → exit 0.

### Step 3: Shows — no fake ticket button

In `components/sections/Shows.tsx`, replace the `upcoming ? <a href={show.ticketUrl ?? "#"}>` branch: render the amber "Get Tickets" `<a>` only when `show.ticketUrl` is a string; when upcoming but `ticketUrl` is null, render a bordered span `Tickets TBA` styled like the existing "Past Show" pill (`rounded-full border border-[var(--border)] px-4 py-2 font-mono text-xs text-gray-dim`).

**Verify**: `npm run lint` → exit 0.

### Step 4: Social cards — disabled cards are not anchors

In `components/sections/Social.tsx`:
- Set `disabled: true` (and keep `url: "#"` removal: change to `url: null`) for Spotify, YouTube, Apple Music, and Facebook entries, with `cta` values like `"Link coming soon"`. Keep Instagram as-is. Keep TikTok disabled.
- Type the array so `url: string | null`.
- In the card render (lines 42–52), when `p.disabled || !p.url` render a `<span>` with the existing disabled classes instead of an `<a>`; remove `aria-disabled` (a span needs none). When enabled, keep the `<a>` and add `target="_blank" rel="noopener noreferrer"`.

**Verify**: `npm run lint` → exit 0.

### Step 5: Contact direct links — drop the dead ones

In `components/sections/Contact.tsx` `directLinks` (lines 10–15), remove the Spotify and YouTube entries (they have no URLs). Keep Instagram and Email. Add `target="_blank" rel="noopener noreferrer"` to the Instagram link render (skip for `mailto:`): simplest is `{...(link.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}`.

**Verify**: `npm run lint` → exit 0.

### Step 6: Hero quick links — real Instagram, drop the rest

In `components/sections/Hero.tsx` (lines 182–190), keep one link: Instagram → `https://instagram.com/kidzthesedaysofficial` with `target="_blank" rel="noopener noreferrer"`. Remove the Spotify and YouTube `<a href="#">` entries (they can return with real URLs later).

**Verify**: `npm run lint` → exit 0.

### Step 7: Merch — honest "Coming soon" instead of Add to Cart

In `components/sections/Merch.tsx` (lines 56–63), replace the `<a href="#">Add to Cart</a>` with a disabled-styled span `Shop opening soon` (classes: `rounded-full border border-[var(--border)] px-4 py-1.5 font-sans text-xs text-gray-dim`). Keep the TODO comment about Big Cartel/Shopify — it documents the planned integration.

**Verify**: `npm run build` → exit 0 (all type errors from Step 1 now resolved).

## Test plan

No test infra yet (plan 006). Gate is the build + the census greps below. If plan 006 landed first, add a smoke assertion: `page.locator('a[href="#"]')` count is 0.

## Done criteria

- [ ] `npm run build` exits 0; `npm run lint` exits 0
- [ ] `grep -rn 'href="#"' components app` returns no matches
- [ ] `grep -rn '"#"' lib/data` returns no matches
- [ ] Every remaining external `<a>` (http URLs) has `rel="noopener noreferrer"`: `grep -rn 'https://' components | grep -v noopener` → only non-anchor lines (comments/data files)
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Real streaming/social URLs appear to have been added since planning (drift check shows data files changed) — the disabled-state work may be obsolete; report what you find.
- Step 1's build does NOT fail (types not enforced where expected).
- Any fix seems to require editing `Media.tsx` or adding commerce code.

## Maintenance notes

- When real URLs arrive, they go into `lib/data/*.ts` and the components light up automatically — that's the point of the `string | null` shape.
- Reviewer: check no invented URLs slipped in; every external link is `null` or verifiably real.
- Deferred: hero Spotify/YouTube links (restore when URLs exist), merch commerce integration (needs the Big Cartel vs Shopify decision).
