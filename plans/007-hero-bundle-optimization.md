# Plan 007: Stop shipping the Three.js bundle to desktop video viewers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- components/sections/Hero.tsx components/three/`
> Compare the "Current state" excerpt against the live file; on mismatch, STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED — touches the most visible element of the site; the fallback must never flash a blank frame
- **Depends on**: plans/006-playwright-smoke-baseline.md (smoke suite must exist and pass before and after)
- **Category**: perf
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

On desktop with motion allowed, the hero plays a 2MB H.264 video — yet the page still downloads and boots the entire React Three Fiber stack (`three` + `@react-three/fiber` + `drei` + `postprocessing`, several hundred KB gzipped, plus WebGL context creation) purely as a placeholder that is unmounted the moment `onCanPlay` fires, typically within a second. Desktop visitors pay roughly double the JavaScript for content they see for under a second. After this plan, the 3D scene's chunk is fetched only when it will actually be shown (mobile, or video failure), and the placeholder gap is covered by a lightweight CSS gradient that matches the scene's palette.

## Current state

`components/sections/Hero.tsx` (client component). Mode resolution at lines 27–32; the relevant render at lines 42–64:

```tsx
{mode === "video" && (
  <>
    {/* 3D scene underneath as a seamless fallback until video is ready */}
    {!videoOk && <HeroScene particleCount={particleCount} />}
    <video
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: videoOk ? 1 : 0, transition: "opacity 0.8s ease" }}
      autoPlay muted loop playsInline preload="auto"
      onCanPlay={() => setVideoOk(true)}
      onError={() => setVideoOk(false)}
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  </>
)}

{mode === "3d" && <HeroScene particleCount={particleCount} />}
```

`HeroScene` is imported via `dynamic(() => import("@/components/three/HeroScene"), { ssr: false })` (lines 9–11) — code-split, but the chunk is fetched as soon as the component first renders, which happens immediately in video mode because `videoOk` starts `false`.

The video element's `onError` only fires for errors on the `<video>` element itself; with a `<source>` child, failures fire on the source. The existing fallback relies on `videoOk` simply never becoming true. Preserve that semantic: "fallback = canplay hasn't fired", but add a timeout so a stalled network actually switches to the 3D scene instead of a static gradient forever.

CSS palette facts (from `app/globals.css` and `HeroScene.tsx`): scene background tone `#0B0D12` (the hero card already has `bg-[#0B0D12]`), fog `#0D1117`, amber `#E8A838`. The static-mode wash already in Hero.tsx (lines 66–74) is the visual reference for the placeholder gradient.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Build | `npm run build` | exit 0; note First Load JS for `/` before vs after |
| Smoke tests | `npx playwright test` | all pass |
| Dev | `npm run dev` | localhost:3000 |

## Suggested executor toolkit

- If `react-performance` or `vercel:react-best-practices` skills are available, consult them before Step 1.

## Scope

**In scope**:
- `components/sections/Hero.tsx`
- `tests/smoke.spec.ts` (add hero assertions)

**Out of scope**:
- `components/three/*` — the scene itself is fine; only when it loads changes.
- `public/video/hero.mp4` re-encoding or poster generation from video frames (no ffmpeg dependency assumed; the placeholder is CSS).
- Mobile (`mode === "3d"`) and reduced-motion (`static`) paths — behavior unchanged.

## Git workflow

- Branch: `advisor/007-hero-bundle`
- Commit: `perf: defer 3D hero chunk until actually needed`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 0: Record the baseline

Run `npm run build` and record the "First Load JS" for route `/` from the build output into your final report.

**Verify**: number recorded.

### Step 1: Replace the always-mounted HeroScene placeholder with a CSS placeholder + failure timer

In `Hero.tsx`, video branch only:

1. Add state: `const [videoFailed, setVideoFailed] = useState(false);`
2. Add an effect (or a timer started when mode becomes `"video"`): if `videoOk` is still false after 4 seconds, set `videoFailed(true)`. Clear the timer when `videoOk` turns true or on unmount.
3. Render logic in the video branch:
   - While `!videoOk && !videoFailed`: render a CSS placeholder div (NOT HeroScene) — `absolute inset-0` with the amber radial wash over the card's `#0B0D12`, mirroring the static-mode gradient at lines 66–74 (reuse the exact same `radial-gradient(ellipse at 70% 40%, rgba(232,168,56,0.18), transparent 55%)`).
   - When `videoFailed`: render `<HeroScene particleCount={particleCount} />` (the dynamic import fetches the chunk only now).
   - The `<video>` element stays mounted throughout with the same opacity transition.
4. Also set `videoFailed(true)` from an `onError` handler on the `<source>` element (in React, put `onError` on the `<video>` AND on the `<source>` — source error events don't bubble as `error` on video in all browsers).

**Verify**: `npm run build` → exit 0.

### Step 2: Confirm the chunk is deferred

`npm run dev`, open the site in a desktop-width browser with the network tab open, filter JS. The chunk containing three.js (it will be the largest async chunk; identifiable by searching loaded resources for `three`) must NOT load when the video plays normally. Then simulate failure: block `/video/hero.mp4` via devtools request blocking, reload — placeholder gradient shows, and after ~4s the three.js chunk loads and the 3D scene appears.

**Verify**: both observations hold.

### Step 3: Re-measure and assert smoke

Run `npm run build`; First Load JS for `/` should drop materially versus Step 0 **if** the three stack was in the shared first-load — if it was already fully async (dynamic import), first-load won't change, and the win is the deferred network fetch from Step 2; report whichever is true, with numbers.

Add to `tests/smoke.spec.ts`: a test that loads `/` at desktop viewport (`page.setViewportSize({ width: 1440, height: 900 })`), waits 3s, and asserts no network request matched `/three|HeroScene/` chunk names — implement by collecting `page.on("request")` URLs and asserting none contain `three` (verify the actual chunk naming in `.next` output first; if chunk names are hashed without the word "three", assert instead that the page's `<canvas>` count is 0 while the video element exists).

**Verify**: `npx playwright test` → all pass, including the new test.

## Test plan

- New smoke assertion per Step 3 (desktop: no WebGL canvas when video healthy).
- Existing smoke suite must stay green.
- Manual matrix (document in PR): desktop normal (video plays, no 3D fetch), desktop with video blocked (3D appears ≤5s), mobile emulation (3D scene as before), reduced-motion (static wash as before).

## Done criteria

- [ ] `npm run build` exits 0; before/after First Load JS numbers reported
- [ ] `npx playwright test` exits 0 including the new hero test
- [ ] Desktop happy path performs zero three.js chunk fetch (Step 2 observation)
- [ ] Video-failure path still ends in the 3D scene (Step 2 observation)
- [ ] Mobile and reduced-motion branches untouched (`git diff` shows changes confined to the video branch + state/timer)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Plan 006 is not DONE (no smoke suite) — do not proceed without the baseline.
- The Hero tiering was restructured since `780d398`.
- The placeholder visibly flashes (white/black frame) between gradient and video in normal loading and you can't eliminate it within two attempts — the current UX bar is "no flash"; report rather than ship a flashier-but-faster hero.
- You find the three.js code is in the shared/common chunk for a different reason (e.g. another component imports it statically) — that's a different fix; report it.

## Maintenance notes

- If a poster image is later generated from the video (`ffmpeg -i hero.mp4 -frames:v 1 poster.jpg`), prefer `poster=` on the video over the CSS gradient and delete the placeholder div.
- If `preload="auto"` is ever revisited (e.g. switch to `metadata` to save 2MB for non-scrolling visitors), re-test the placeholder duration — canplay will fire later.
- Reviewer: scrutinize the timer cleanup (no setState after unmount) and that `videoFailed` can't oscillate back to false.
