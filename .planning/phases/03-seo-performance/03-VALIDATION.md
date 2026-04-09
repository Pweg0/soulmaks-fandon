---
phase: 3
slug: seo-performance
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (existing from Phase 1) |
| **Config file** | vitest.config.ts (exists) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-T1 | 03-01 | 1 | SEO-01 | build + unit | `npx next build && npm test -- tests/seo/metadata.test.ts` | ❌ Wave 0 | ⬜ pending |
| 03-01-T2 | 03-01 | 1 | SEO-02 | build + unit | `npx next build && npm test -- tests/seo/sitemap.test.ts` | ❌ Wave 0 | ⬜ pending |
| 03-02-T1 | 03-02 | 2 | SEO-03 | build + unit | `npx next build && npm test -- tests/seo/jsonld.test.ts` | ❌ Wave 0 | ⬜ pending |
| 03-02-T2 | 03-02 | 2 | SEO-04 | manual | PageSpeed Insights check (checkpoint:human-verify) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/seo/metadata.test.ts` — covers SEO-01 (meta title, description, OG tags)
- [x] `tests/seo/sitemap.test.ts` — covers SEO-02 (sitemap.xml generation)
- [x] `tests/seo/jsonld.test.ts` — covers SEO-03 (JSON-LD structured data)

*Wave 0 test stubs are created in Plan 03-01 Task 1 before implementation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| PageSpeed green on mobile | SEO-04 | Requires deployed site | Run PageSpeed Insights on production URL |
| OG preview in Discord/WhatsApp | SEO-01 | Requires share test | Share a page link, verify preview card |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
