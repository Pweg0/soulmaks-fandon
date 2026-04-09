---
phase: 1
slug: fundacao
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts (created in 01-01 Task 1) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-T1 | 01-01 | 1 | INFR-01 | build + test runner | `cd soulmaskbr && npm run build && npx vitest run --reporter=verbose` | vitest.config.ts, tests/setup.ts | ⬜ pending |
| 01-01-T2 | 01-01 | 1 | INFR-02, INFR-03 | unit test | `npx vitest run tests/lib/supabase-client.test.ts --reporter=verbose` | tests/lib/supabase-client.test.ts | ⬜ pending |
| 01-02-T1 | 01-02 | 2 | UI-01, UI-02, UI-03 | build | `npm run build` | src/components/layout/Topbar.tsx, Sidebar.tsx, Footer.tsx | ⬜ pending |
| 01-02-T2 | 01-02 | 2 | UI-01, UI-02 | build | `npm run build` | src/components/home/HeroBanner.tsx, CategoryCards.tsx, FeaturedSection.tsx | ⬜ pending |
| 01-02-T3 | 01-02 | 2 | UI-03 | manual | Human visual inspection (checkpoint:human-verify) | N/A | ⬜ pending |
| 01-03-T1 | 01-03 | 2 | INFR-04 | unit test (TDD) | `npx vitest run tests/scraper/mdx-writer.test.ts --reporter=verbose` | tests/scraper/mdx-writer.test.ts | ⬜ pending |
| 01-03-T2 | 01-03 | 2 | INFR-04 | unit test + integration | `npx vitest run tests/scraper/ --reporter=verbose && test -f scripts/translate/WORKFLOW.md` | tests/scraper/fandom.test.ts, scripts/translate/WORKFLOW.md | ⬜ pending |
| 01-04-T1 | 01-04 | 2 | INFR-05 | unit test (TDD) | `npx vitest run tests/api/ping-servers.test.ts --reporter=verbose` | tests/api/ping-servers.test.ts | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `vitest` — installed in 01-01 Task 1
- [x] `vitest.config.ts` — created in 01-01 Task 1
- [x] `tests/setup.ts` — created in 01-01 Task 1

*Wave 0 is handled by Plan 01-01 Task 1 which scaffolds the entire project including test infrastructure.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel deploy works | INFR-01 | Requires external service | Push to git, verify deploy URL loads |
| Supabase connection pooling | INFR-02 | Requires Supabase project | Connect via Supavisor URL, verify query works |
| cron-job.org calls endpoint | INFR-05 | Requires external cron service | Configure cron, check server logs for ping |
| Visual theme matches tribal style | UI-03 | Subjective visual check | 01-02 Task 3 checkpoint: Open homepage, verify dark theme with gold accents |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
