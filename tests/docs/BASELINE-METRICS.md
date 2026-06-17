# QA Baseline Metrics — KTD Website

**Date**: 2026-06-17  
**Branch**: master (commit 362c6de)

## Test Suite Snapshot

| Category        | Total Tests | Automated | Manual |
|----------------|-------------|-----------|--------|
| Navigation      | 4           | 1         | 3      |
| Hero            | 5           | 3         | 2      |
| About           | 2           | 0         | 2      |
| Members         | 3           | 0         | 3      |
| Music           | 3           | 0         | 3      |
| Achievements    | 2           | 0         | 2      |
| Media           | 2           | 0         | 2      |
| Shows           | 3           | 0         | 3      |
| Merch           | 3           | 0         | 3      |
| Social          | 3           | 0         | 3      |
| Contact         | 5           | 3         | 2      |
| Story           | 2           | 0         | 2      |
| Performance     | 3           | 0         | 3      |
| Accessibility   | 5           | 0         | 5      |
| Responsive      | 3           | 0         | 3      |
| Security        | 10          | 0         | 10     |
| **TOTAL**       | **58**      | **7**     | **51** |

## Existing Playwright Smoke Suite (automated)
- 7 tests in `tests/smoke.spec.ts`
- Status: PASSING (baseline)

## Quality Gates

| Gate                | Target | Current | Status |
|--------------------|--------|---------|--------|
| Test Execution     | 100%   | 12%     | ❌     |
| Pass Rate          | ≥80%   | 100%*   | ✅*    |
| P0 Bugs Open       | 0      | 0       | ✅     |
| P1 Bugs Open       | ≤5     | 0       | ✅     |
| Playwright Coverage| ≥80%   | 12%     | ❌     |
| Security Coverage  | 90%    | 0%      | ❌     |

*only smoke suite run — full suite not yet executed

## Priority Breakdown

| Priority | Count |
|---------|-------|
| P0      | 2     |
| P1      | 14    |
| P2      | 22    |
| P3      | 16    |
| P4      | 0     |
| **Total** | **58** |

## Known Issues at Baseline
- None open. Previous P0 (HEVC video) resolved in commit f6c73fc.
- Contact form submit success path (TC-CONTACT-004) requires `NEXT_PUBLIC_FORMSPREE_ID` — not tested in CI.
