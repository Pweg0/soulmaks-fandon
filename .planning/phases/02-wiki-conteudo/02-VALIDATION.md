---
phase: 2
slug: wiki-conteudo
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-08
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.3 + Testing Library |
| **Config file** | vitest.config.ts (exists from Phase 1) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green + manual smoke test
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-T1 | 02-01 | 1 | WIKI-01, WIKI-03, WIKI-04 | unit | `npm test -- tests/lib/content.test.ts` | ❌ Wave 0 | ⬜ pending |
| 02-01-T2 | 02-01 | 1 | WIKI-06 | unit + integration | `npm test -- tests/scraper/` | tests/scraper/mdx-writer.test.ts ✅ | ⬜ pending |
| 02-02-T1 | 02-02 | 2 | WIKI-01 | build | `npm run build` | N/A | ⬜ pending |
| 02-02-T2 | 02-02 | 2 | WIKI-01 | build | `npm run build` | N/A | ⬜ pending |
| 02-03-T1 | 02-03 | 2 | WIKI-03, WIKI-04 | build + unit | `npm run build && npm test -- tests/components/SkillList.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-03-T2 | 02-03 | 2 | WIKI-03, WIKI-04 | build | `npm run build` | N/A | ⬜ pending |
| 02-04-T1 | 02-04 | 3 | WIKI-02 | unit | `npm test -- tests/components/SearchDropdown.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-04-T2 | 02-04 | 3 | WIKI-05 | build | `npm run build` | N/A | ⬜ pending |
| 02-04-T3 | 02-04 | 3 | WIKI-01..06 | manual | Human visual inspection (checkpoint:human-verify) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/lib/content.test.ts` — covers WIKI-01, WIKI-03, WIKI-05 (content utility functions)
- [x] `tests/components/SearchDropdown.test.tsx` — covers WIKI-02 (empty state, result rendering)
- [x] `tests/components/SkillList.test.tsx` — covers WIKI-04 (mask skill rendering)
- [x] `pagefind` — install search library (`npm install --save-dev pagefind`)
- [x] shadcn components — `npx shadcn@latest add accordion table tabs select skeleton tooltip breadcrumb pagination`
- [x] `src/mdx-components.tsx` — required by `@next/mdx` App Router
- [x] `remotePatterns` for Fandom CDN images in `next.config.ts`

*Wave 0 is handled by Plan 02-01 which installs all dependencies and creates foundational files.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Category pages display correct content | WIKI-01 | Visual layout check | Open /wiki/itens, verify grid shows items |
| Item page shows stats, crafting, location | WIKI-03 | Visual layout check | Open an item page, verify all accordion sections |
| Mask page shows skills, builds | WIKI-04 | Visual layout check | Open a mask page, verify unique sections |
| Patch notes are readable | WIKI-05 | Content quality check | Open /wiki/patch-notes, verify translations |
| All text in pt-BR | WIKI-06 | Language check | Browse all page types, confirm no English |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending execution
