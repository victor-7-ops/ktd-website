# Plan 005: Accessibility batch — mobile menu, carousel announcements, cursor reduced-motion

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- components/layout/Navbar.tsx components/ui/AlbumCarousel.tsx components/layout/CustomCursor.tsx components/sections/Social.tsx`
> On changes, compare "Current state" excerpts before proceeding; on mismatch, STOP.
> Note: plan 002 also edits `Social.tsx` — if its status is DONE, the Social
> item below (Fix D) may already be resolved; verify and skip if so.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (soft overlap with 002 on Social.tsx — execute 002 first)
- **Category**: bug (accessibility)
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

Four concrete accessibility defects, all verified by reading the code: the mobile menu can't be closed with Escape, doesn't trap or move focus, and leaves the page scrollable behind the overlay; the album carousel's arrow-key handling only works when the container itself is focused and screen readers are never told which album is active; the custom cursor's docstring promises reduced-motion handling that isn't implemented; disabled social links are still focusable anchors. Individually small, together they make keyboard and screen-reader navigation unreliable on a site that is otherwise carefully crafted.

## Current state

- `components/layout/Navbar.tsx` — client component. Mobile overlay (lines 90–103) renders when `open`; the toggle button (lines 64–86) has `aria-expanded` but no `aria-controls`; there is no Escape handler, no scroll lock, no focus management:

```tsx
{open && (
  <div className="fixed inset-0 top-[64px] z-40 flex flex-col items-center gap-6 bg-[rgba(10,10,15,0.97)] pt-16 backdrop-blur-xl md:hidden">
    {[...LINKS, { label: "Contact", href: "#contact" }].map((l) => ( ... ))}
  </div>
)}
```

- `components/ui/AlbumCarousel.tsx` — carousel track div (lines 27–33) has `onKeyDown` for ArrowLeft/Right, `tabIndex={0}`, `role="region"`, `aria-label="Album carousel"`. The active-album info block (lines 60–83) re-renders on change but has no live region, so SR users hear nothing when arrows/dots change the album.
- `components/layout/CustomCursor.tsx` — docstring (line 8) says "Disabled on touch / coarse-pointer devices **and when reduced motion is set**" but the effect only checks `(hover: hover) and (pointer: fine)` (line 15). The lagging ring is pure decorative motion.
- `components/sections/Social.tsx:42-52` — disabled platform cards render `<a href="#" aria-disabled>` (focusable, activatable). **Plan 002 Step 4 fixes this**; only do Fix D here if 002 hasn't landed.
- Conventions: `"use client"` components with hooks; Tailwind token classes. The repo has no headless-UI dependency — implement with plain React + DOM APIs, no new dependencies.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Build + typecheck | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Manual check | `npm run dev` | localhost:3000 |

## Suggested executor toolkit

- If the `frontend-a11y` or `wcag-accessibility-audit` skill is available, consult it for the focus-management pattern in Fix A.

## Scope

**In scope**:
- `components/layout/Navbar.tsx`
- `components/ui/AlbumCarousel.tsx`
- `components/layout/CustomCursor.tsx`
- `components/sections/Social.tsx` (only if plan 002 not yet DONE)

**Out of scope**:
- `Reveal.tsx`, `globals.css` reduced-motion rules — already correct.
- `TiltCard.tsx` — pointer-only decoration on non-interactive wrappers; acceptable.
- Adding any dependency (no focus-trap libs, no headless UI).

## Git workflow

- Branch: `advisor/005-accessibility-batch`
- Conventional commits per fix, e.g. `fix: mobile menu escape/scroll-lock/focus handling`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1 (Fix A): Mobile menu — Escape, scroll lock, focus

In `Navbar.tsx`:

1. Add `id="mobile-menu"` to the overlay div and `aria-controls="mobile-menu"` to the toggle button.
2. Add an effect that runs while `open`:

```tsx
useEffect(() => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  document.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";
  return () => {
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
  };
}, [open]);
```

3. Focus management: keep a ref to the toggle button. When the menu opens, focus the first link in the overlay (ref on the overlay div, `overlay.querySelector("a")?.focus()` inside the same effect); when it closes via Escape, return focus to the toggle button.
4. Close the menu when the viewport crosses to desktop (optional but cheap): in the same effect, listen to `window.matchMedia("(min-width: 768px)")` change and `setOpen(false)`.

**Verify**: `npm run build` → exit 0. Manual: open dev tools device emulation, open menu — body doesn't scroll behind it; Escape closes and focus returns to the hamburger.

### Step 2 (Fix B): Carousel — announce the active album

In `AlbumCarousel.tsx`:

1. On the active-album info container (the `div` at line 60, `className="mt-8 flex flex-col items-center gap-3 text-center"`), add `aria-live="polite"` and `aria-atomic="true"`.
2. On the track div, extend the `aria-label` to include usage: `aria-label="Album carousel — use left and right arrow keys to browse"`.
3. Add `aria-current={i === active ? "true" : undefined}` to each album cover button and each dot button.

**Verify**: `npm run lint` → exit 0; `grep -n "aria-live" components/ui/AlbumCarousel.tsx` → 1 match.

### Step 3 (Fix C): Custom cursor honors reduced motion

In `CustomCursor.tsx`, extend the gate at line 15:

```tsx
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!fine || reduced) return;
```

This makes the implementation match its own docstring: with reduced motion, the native cursor is kept (the `has-custom-cursor` class is never added, so `cursor: none` never applies).

**Verify**: `npm run build` → exit 0. Manual: in dev tools, emulate `prefers-reduced-motion: reduce`, reload — native cursor visible, no amber dot/ring.

### Step 4 (Fix D — conditional): Disabled social cards

Check `plans/README.md`: if plan 002 is DONE, skip this step. Otherwise apply plan 002 Step 4's change (disabled cards render `<span>` not `<a>`); read that plan file for the exact spec.

**Verify**: `npm run build` → exit 0.

## Test plan

Manual keyboard pass (documented in the PR description): Tab through the page — every focusable element visibly focusable; mobile menu per Step 1 verify; carousel arrows work after tabbing to the region. If plan 006's Playwright setup exists, add: open mobile menu → press Escape → menu gone and `document.activeElement` is the toggle button.

## Done criteria

- [ ] `npm run build` exits 0; `npm run lint` exits 0
- [ ] `grep -n "Escape" components/layout/Navbar.tsx` → ≥1 match
- [ ] `grep -n "aria-live" components/ui/AlbumCarousel.tsx` → 1 match
- [ ] `grep -n "prefers-reduced-motion" components/layout/CustomCursor.tsx` → 1 match
- [ ] Manual checks in Steps 1 and 3 performed and passing
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Navbar has been restructured (e.g. overlay replaced by a dialog component) since planning.
- Scroll-locking `document.body.style.overflow` conflicts with something (e.g. layout shift from scrollbar removal breaks the fixed header) and a second attempt doesn't resolve it cleanly.
- Fix D's target already changed by plan 002 in a way that diverges from this plan's assumption.

## Maintenance notes

- If the mobile menu later becomes a `<dialog>` or gains animation libraries, the manual Escape/focus code in Step 1 should be replaced by the platform behavior, not duplicated.
- Reviewer: confirm no focus trap was added that prevents tabbing OUT of the menu to the browser chrome (we move focus, we don't hard-trap — acceptable for a same-page overlay).
- Deferred: skip-to-content link and section landmarks audit — worthwhile, but separate.
