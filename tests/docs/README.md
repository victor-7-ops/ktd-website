# KTD Website — QA Documentation

## Files

| File | Purpose |
|------|---------|
| `01-FUNCTIONAL-TEST-CASES.md` | All 48 functional + perf + a11y + responsive test cases (AAA format) |
| `02-SECURITY-TEST-CASES.md` | 10 OWASP-aligned security test cases |
| `TEST-EXECUTION-TRACKING.csv` | Live execution status — update after each test |
| `BUG-TRACKING.csv` | Bug log with severity (P0-P4) and repro steps |
| `BASELINE-METRICS.md` | Snapshot of QA state at project start (2026-06-17) |

## Test Files

| File | Type | Tests |
|------|------|-------|
| `tests/smoke.spec.ts` | Playwright | 7 smoke checks (nav, title, console errors, form fields) |
| `tests/functional.spec.ts` | Playwright | 14 automated functional/a11y/security checks |

## Running Tests

```bash
npm test                    # Playwright smoke + functional (starts dev server)
npx playwright test --ui    # Interactive Playwright UI
```

## Quality Gates (all must pass before release)

| Gate | Target |
|------|--------|
| Test execution | 100% of 58 tests run |
| Pass rate | ≥ 80% |
| P0 bugs open | 0 |
| P1 bugs open | ≤ 5 |
| Playwright coverage | ≥ 80% of P0/P1 tests automated |
| Security coverage | 9/10 OWASP threats checked |

## Execution Order (recommended)

1. P0 tests first — stop if any fail
2. P1 tests
3. P2–P3 tests
4. Security tests last (need prod or staging URL for headers/HTTPS)

## Bug Severity Guide

| Level | SLA | Examples |
|-------|-----|---------|
| P0 | Fix same day | Crash, blank page, data loss, XSS |
| P1 | Fix within 3 days | Core feature broken, broken form |
| P2 | Fix this sprint | Cosmetic defect, edge case |
| P3 | Backlog | Minor copy issues |
| P4 | Optional | Docs typo |
