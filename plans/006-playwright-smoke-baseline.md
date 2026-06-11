# Plan 006: Establish a Playwright smoke-test baseline

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- package.json app/page.tsx`
> If `package.json` gained test tooling since planning, STOP and report —
> the baseline may already exist.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (but must land BEFORE plan 007)
- **Category**: tests
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

The repo has no tests of any kind; the only verification is `npm run build` (typecheck) and ESLint. Every behavioral change — especially the hero-tier logic that plan 007 will modify — is verified by eyeball. One small Playwright smoke suite gives a one-command answer to "does the site still work": the page renders, all 11 sections exist, navigation anchors resolve, and the browser console is clean. This is deliberately a smoke baseline, not a coverage push.

## Current state

- `package.json` scripts: `dev`, `build`, `start`, `lint` only. No test deps.
- The page is a single route (`/`) composing 11 sections (`app/page.tsx`). Section ids present in the DOM (verified by reading the section components): `top` (Hero), `about`, `members`, `music`, `achievements`, `media`, `shows`, `merch`, `social`, `contact`. (`StoryMap`'s id was not verified during planning — read `components/sections/StoryMap.tsx` and use whatever id it declares, or skip it if it has none.)
- The hero mounts WebGL/video client-side; in headless Chromium the video may not autoplay — the smoke test must not assert on video playback.
- Platform note: this machine is Windows; commands below are shell-neutral.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install Playwright | `npm i -D @playwright/test` then `npx playwright install chromium` | exit 0 |
| Build | `npm run build` | exit 0 |
| Run tests | `npx playwright test` | all pass |

## Scope

**In scope**:
- `package.json` (devDependency + `"test": "playwright test"` script)
- `playwright.config.ts` (create)
- `tests/smoke.spec.ts` (create)
- `.gitignore` (add `/test-results/`, `/playwright-report/`)

**Out of scope**:
- Unit tests, visual regression, CI workflow files (no CI config exists in the repo; adding one is a separate decision).
- Any change to `app/` or `components/`.

## Git workflow

- Branch: `advisor/006-playwright-smoke`
- Commit: `test: add Playwright smoke baseline`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Install and configure

`npm i -D @playwright/test` and `npx playwright install chromium`.

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

Add `"test": "playwright test"` to `package.json` scripts. Add `/test-results/` and `/playwright-report/` to `.gitignore`.

**Verify**: `npx playwright test --list` → exits 0 (0 tests is fine at this point).

### Step 2: Write `tests/smoke.spec.ts`

Cases (one `test.describe("smoke")`):

1. **Page renders with title** — `await page.goto("/")`; `await expect(page).toHaveTitle(/KIDZ THESE DAYS/)`.
2. **All sections present** — for each id in `["about","members","music","achievements","media","shows","merch","social","contact"]`: `await expect(page.locator(\`#\${id}\`)).toBeAttached()`. (Add StoryMap's id if it has one — check the component.)
3. **Hero heading visible** — `await expect(page.getByRole("heading", { level: 1 })).toContainText("KIDZ")` (note: the h1 renders per-letter spans; use `toContainText` against the h1's `aria-label` via `page.locator("h1[aria-label='KIDZ THESE DAYS']")` if the text assertion is flaky).
4. **No console errors** — collect `page.on("console")` messages of type `error` during load + a full-page scroll (`page.mouse.wheel` to bottom in steps, or `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` then wait 1s); assert the collected list is empty. Allowlist nothing initially; if WebGL in headless throws a known unavoidable error, add a targeted filter with a comment explaining it.
5. **Contact form fields exist** — `#contact` contains inputs named `name`, `email`, textarea `message`, and a submit button.

**Verify**: `npx playwright test` → 5 passed.

### Step 3: Document

Add to `CLAUDE.md` under Commands: `npm test           # Playwright smoke suite (starts dev server itself)` and delete the "No test suite exists yet." sentence.

**Verify**: `grep -n "No test suite" CLAUDE.md` → no matches.

## Test plan

This plan IS the test plan. Run `npx playwright test` twice in a row to check for flakiness; both runs must pass.

## Done criteria

- [ ] `npm test` (i.e. `npx playwright test`) exits 0, 5 tests passed, on two consecutive runs
- [ ] `npm run build` still exits 0
- [ ] `package.json` has the `test` script; config + spec files exist
- [ ] `/test-results/` and `/playwright-report/` git-ignored
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Playwright browser install fails in this environment (corporate proxy / disk) after one retry.
- The console-error test fails due to a real application error (not a headless-WebGL artifact) — that's a finding, report it instead of allowlisting it.
- A test framework already exists (drift).

## Maintenance notes

- Plans 001–005 each name an optional assertion to add here once this lands; executors of those plans should add them.
- The `webServer` block uses the dev server for speed; if smoke results ever diverge from production behavior, switch `command` to `npm run build && npm run start`.
- Reviewer: check the console-error filter (if any) is narrowly scoped with a comment, not a blanket ignore.
