# Plan 004: Fix stale CLAUDE.md version claims and add .env.example

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- CLAUDE.md package.json`
> On any change to these files, re-verify the facts below before editing.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

`CLAUDE.md` is the context file AI agents load on every session in this repo — and it states the site is "Single-page Next.js 14" while `package.json` pins `next: 16.2.7`. Agents planning against Next 14 conventions will give wrong advice (e.g. miss Next 15+ async-API changes, metadata route capabilities). Separately, three env vars are documented but there is no `.env.example`, so a fresh clone has nothing to copy.

## Current state

- `CLAUDE.md` — "## Architecture" section begins: `Single-page Next.js 14 (App Router) site.` This is the only version claim; the rest of the file was verified accurate at planning time (commands, file structure, tiering, tokens, fonts, deployment).
- `package.json:16` — `"next": "16.2.7"`, React `19.2.4`, Tailwind v4, ESLint 9.
- `CLAUDE.md` "### Environment variables" documents: `NEXT_PUBLIC_FORMSPREE_ID`, `NEXT_PUBLIC_MAILCHIMP_URL`, `NEXT_PUBLIC_BIG_CARTEL_SHOP` — "none are required to run".
- No `.env.example` exists (`ls` the repo root to confirm).
- Note: `NEXT_PUBLIC_BIG_CARTEL_SHOP` is documented but not read by any code (`grep -rn "BIG_CARTEL" components lib app` → no matches). Keep it in `.env.example` with a comment saying it's reserved for the planned merch integration.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Verify version | `node -e "console.log(require('./package.json').dependencies.next)"` | `16.2.7` |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `CLAUDE.md`
- `.env.example` (create)

**Out of scope**:
- `README.md` — still the default create-next-app README; replacing it is a separate (optional) task, don't expand scope here.
- Any source code.
- `.gitignore` — verify it already ignores `.env*` files before committing `.env.example`; create-next-app's default ignores `.env*` but typically allows nothing back — if `.env.example` would be ignored, add the single line `!.env.example` to `.gitignore` (this is then in scope).

## Git workflow

- Branch: `advisor/004-docs-env-example`
- Commit: `docs: correct Next.js version in CLAUDE.md, add .env.example`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Correct the version claim

In `CLAUDE.md`, change `Single-page Next.js 14 (App Router) site.` to `Single-page Next.js 16 (App Router) site.` Do not rewrite anything else.

**Verify**: `grep -n "Next.js" CLAUDE.md` → only matches saying 16 (or version-free).

### Step 2: Create `.env.example`

```bash
# Copy to .env.local — none are required for the site to run.
NEXT_PUBLIC_FORMSPREE_ID=        # Contact form (components/sections/Contact.tsx)
NEXT_PUBLIC_MAILCHIMP_URL=       # Newsletter embed (components/sections/Social.tsx)
NEXT_PUBLIC_BIG_CARTEL_SHOP=     # Reserved: merch shop handle (not yet read by code)
```

Check `.gitignore`: if its env pattern would exclude `.env.example` (e.g. a bare `.env*` line), append `!.env.example`.

**Verify**: `git status` shows `.env.example` as a new tracked-able file (it appears under untracked files, not silently ignored). `git check-ignore .env.example` → exits non-zero (not ignored).

### Step 3: Point CLAUDE.md at the example

In the CLAUDE.md "### Environment variables" section, change `Create .env.local (none are required to run):` to `Copy .env.example to .env.local (none are required to run):` keeping the variable list as is.

**Verify**: `grep -n "env.example" CLAUDE.md` → 1 match.

## Test plan

Not applicable — docs only. `npm run lint` as a no-regression sanity check.

## Done criteria

- [ ] `grep -n "Next.js 14" CLAUDE.md` → no matches
- [ ] `.env.example` exists and is not git-ignored
- [ ] Only `CLAUDE.md`, `.env.example` (and possibly `.gitignore`) modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `package.json` no longer says Next 16.x (another upgrade happened) — update the doc to whatever is true, but report the discrepancy.
- CLAUDE.md has been substantially rewritten since `780d398`.

## Maintenance notes

- Any future Next major upgrade must touch this CLAUDE.md line; reviewers of dependency-bump PRs should check it.
- When merch integration lands, update the `NEXT_PUBLIC_BIG_CARTEL_SHOP` comment (or remove the var if Shopify is chosen).
