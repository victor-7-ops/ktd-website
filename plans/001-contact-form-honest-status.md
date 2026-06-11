# Plan 001: Make the contact form report real success/failure

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 780d398..HEAD -- components/sections/Contact.tsx`
> If the file changed since this plan was written, compare the "Current state"
> excerpt against the live code before proceeding; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `780d398`, 2026-06-11

## Why this matters

The contact form is how the band receives booking and press inquiries. Today `handleSubmit` swallows every error (`.catch(() => {})`) and then unconditionally shows the "Message Sent." panel — and because `NEXT_PUBLIC_FORMSPREE_ID` is unset, the POST goes to `https://formspree.io/f/placeholder` and 404s. Every visitor who submits the form believes they reached the band; nobody does. After this plan, success is shown only on a confirmed 2xx response, failures show a retry-able error state, and an unconfigured form ID is surfaced instead of silently failing.

## Current state

- `components/sections/Contact.tsx` — client component containing the whole contact section. The form handler (lines 21–34):

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  data.set("inquiry_type", inquiry);
  // Formspree placeholder — replace NEXT_PUBLIC_FORMSPREE_ID in .env.local
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "placeholder";
  await fetch(`https://formspree.io/f/${id}`, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  }).catch(() => {});
  setSubmitted(true);
}
```

- State today: `const [submitted, setSubmitted] = useState(false);` (line 19). The render branches on `submitted` only (lines 56–119).
- Repo conventions: client components use `"use client"` + hooks; styling is Tailwind utilities with CSS-variable tokens (`text-amber`, `border-[var(--border)]`, `font-mono text-[10px] uppercase tracking-widest`). Match the existing label styling in this same file for any new text. Never hardcode hex colors — use tokens.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Build + typecheck | `npm run build` | exit 0, "Compiled successfully" |
| Lint | `npm run lint` | exit 0 |
| Dev server | `npm run dev` | serves http://localhost:3000 |

## Scope

**In scope** (the only files you should modify):
- `components/sections/Contact.tsx`

**Out of scope** (do NOT touch):
- `components/sections/Social.tsx` — the newsletter form there has a similar placeholder pattern but posts via native form action to Mailchimp; different mechanics, separate decision.
- Adding a server route / API proxy for the form — Formspree is the chosen architecture.
- `.env.example` creation — handled by plan 004.

## Git workflow

- Branch: `advisor/001-contact-form-honest-status`
- Commit style: conventional commits, matching repo history (e.g. `fix: contact form reports real submit status`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Replace the boolean `submitted` with a status state machine

In `components/sections/Contact.tsx`, replace
`const [submitted, setSubmitted] = useState(false);` with:

```tsx
type SubmitStatus = "idle" | "sending" | "sent" | "error";
const [status, setStatus] = useState<SubmitStatus>("idle");
```

Rewrite `handleSubmit`:

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!id) {
    setStatus("error");
    return;
  }
  const data = new FormData(form);
  data.set("inquiry_type", inquiry);
  setStatus("sending");
  try {
    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    setStatus(res.ok ? "sent" : "error");
  } catch {
    setStatus("error");
  }
}
```

**Verify**: `npm run lint` → exit 0.

### Step 2: Update the render branches

- The success panel (currently `submitted ? (...)`) renders when `status === "sent"`. Keep its markup unchanged.
- The form renders in all other states.
- Submit button: when `status === "sending"`, set `disabled` and label it `Sending…`; add `disabled:opacity-50` to its className.
- Below the submit button, when `status === "error"`, render an inline error (match the section's mono-label styling, but readable size):

```tsx
{status === "error" && (
  <p role="alert" className="font-sans text-sm text-amber">
    Couldn't send your message. Email us directly at{" "}
    <a href="mailto:contact@ktd.ph" className="underline">contact@ktd.ph</a>{" "}
    or try again.
  </p>
)}
```

**Verify**: `npm run build` → exit 0.

### Step 3: Manual verification in dev

Run `npm run dev`, open http://localhost:3000/#contact, fill the form, submit.
With no `NEXT_PUBLIC_FORMSPREE_ID` set, the error message must appear and the
"Message Sent." panel must NOT appear.

**Verify**: behavior above observed; no console errors related to Contact.

## Test plan

No test infrastructure exists yet (plan 006 introduces it). Verification for
this plan is the build gate plus the manual dev check in Step 3. If plan 006
has already landed when you execute this, add a Playwright case to the smoke
spec: submitting the form without a configured form ID shows the `role="alert"`
error and not "Message Sent."

## Done criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `grep -n "catch(() => {})" components/sections/Contact.tsx` returns no matches
- [ ] `grep -n "placeholder\"" components/sections/Contact.tsx` returns no matches (the `?? "placeholder"` fallback is gone)
- [ ] Manual check from Step 3 passed
- [ ] Only `components/sections/Contact.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `handleSubmit` in the live file doesn't match the excerpt above (drift).
- The build fails for reasons unrelated to your change, twice.
- You find a server action or API route already handling the form (architecture changed since planning).

## Maintenance notes

- When the real Formspree ID is added to `.env.local` / Vercel env, re-test a real submission end-to-end — Formspree returns 2xx with JSON `{ ok: true }`.
- Reviewer should scrutinize: the success panel must be unreachable without a confirmed 2xx.
- Deferred: spam protection (honeypot field / Formspree reCAPTCHA setting) — worth doing when the real form ID goes live.
