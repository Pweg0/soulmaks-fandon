---
phase: 02-wiki-conteudo
plan: 04
subsystem: ui
tags: [pagefind, search, mdx, patch-notes, next.js, shadcn]

requires:
  - phase: 02-wiki-conteudo-01
    provides: content types, lib/content.ts, MDX setup, pagefind devDependency
  - phase: 02-wiki-conteudo-02
    provides: CategoryListing, FilterBar, ItemCard, ViewToggle
  - phase: 02-wiki-conteudo-03
    provides: ItemHeroCard, MaskHeroCard, StatBlock, CraftingRecipe, SkillList, BuildTabs, MDX rendering with next-mdx-remote

provides:
  - SearchDropdown component with Pagefind dynamic import and dev fallback
  - Topbar search input wired to SearchDropdown
  - HeroBanner search input wired to SearchDropdown
  - gold <mark> highlight style in globals.css
  - PatchEntry card component (gold left border, version badge, Ler mais)
  - /wiki/patch-notes listing page (chronological, paginated)
  - /wiki/patch-notes/[slug] detail page (MDX body, prev/next, data-pagefind-body)
  - sample patch note MDX (example-patch-v1, published: true)

affects: [03-seo-performance, pagefind-postbuild]

tech-stack:
  added: []
  patterns:
    - "Pagefind dynamic import with webpackIgnore comment and dev-mode graceful fallback"
    - "useSearchParams() client components wrapped in Suspense boundary in parent server component"
    - "Patch notes sorted by date descending via localeCompare on ISO date strings"
    - "Static route /wiki/patch-notes takes precedence over dynamic /wiki/[category] in Next.js App Router"

key-files:
  created:
    - src/components/wiki/SearchDropdown.tsx
    - src/components/wiki/PatchEntry.tsx
    - src/app/wiki/patch-notes/page.tsx
    - src/app/wiki/patch-notes/[slug]/page.tsx
    - content/patches/example-patch-v1.mdx
  modified:
    - src/components/layout/Topbar.tsx
    - src/components/home/HeroBanner.tsx
    - src/app/globals.css
    - src/app/wiki/[category]/page.tsx

key-decisions:
  - "Pagefind dynamic import uses @ts-ignore + webpackIgnore to bypass TS module resolution (pagefind.js is a post-build asset, not a compile-time module)"
  - "SearchDropdown renders null when query is empty — no empty-state flash on focus"
  - "Dedicated /wiki/patch-notes/[slug] route built separately from /wiki/[category]/[slug] to support prev/next navigation without contaminating the generic route"
  - "CategoryListing wrapped in Suspense in [category]/page.tsx to satisfy Next.js useSearchParams() CSR bailout requirement"

patterns-established:
  - "Pattern: Pagefind client-side search — loadPagefind() on mount, window.pagefind.debouncedSearch() with 300ms debounce, dev-mode empty results"
  - "Pattern: Suspense boundary wrapping any client component that uses useSearchParams() — required by Next.js 16 for static prerendering"

requirements-completed: [WIKI-02, WIKI-05]

duration: 35min
completed: 2026-04-08
---

# Phase 2 Plan 04: Search + Patch Notes Summary

**Pagefind-powered SearchDropdown wired to topbar and hero, plus /wiki/patch-notes listing and /wiki/patch-notes/[slug] detail pages with MDX body and prev/next navigation**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-04-08T00:00:00Z
- **Completed:** 2026-04-08T00:35:00Z
- **Tasks:** 2 automated + 1 human-verify checkpoint
- **Files modified:** 9

## Accomplishments

- SearchDropdown client component: Pagefind dynamic import with webpackIgnore, 300ms debounce, keyboard navigation (arrows, enter, escape), aria-listbox/option, gold mark highlight, dev-mode graceful fallback to empty results
- Topbar and HeroBanner inputs wired to SearchDropdown with open/close state and click-outside handling
- PatchEntry card with Cinzel title, gold left border (border-l-[3px] border-primary), version badge (bg-muted + border-primary), and "Ler mais" link
- /wiki/patch-notes listing page: chronological sort (most recent first), 10 per page pagination, empty state
- /wiki/patch-notes/[slug] detail page: generateStaticParams, MDX body, data-pagefind-body, prev/next navigation
- Sample patch note (example-patch-v1.mdx) with published: true for immediate testing

## Task Commits

1. **Task 1: SearchDropdown + Topbar + HeroBanner** - `b269de3` (feat)
2. **Task 2: Patch notes listing and detail pages** - `34fa629` (feat)
3. **Task 3: Visual verification** - pending human approval (checkpoint)

## Files Created/Modified

- `src/components/wiki/SearchDropdown.tsx` — Pagefind search results dropdown, client component
- `src/components/layout/Topbar.tsx` — wired searchQuery state and SearchDropdown
- `src/components/home/HeroBanner.tsx` — wired searchQuery state and SearchDropdown (maxWidth=560px)
- `src/app/globals.css` — added mark tag gold highlight style
- `src/components/wiki/PatchEntry.tsx` — patch notes list entry card component
- `src/app/wiki/patch-notes/page.tsx` — listing page, chronological, paginated
- `src/app/wiki/patch-notes/[slug]/page.tsx` — detail page with prev/next, MDX rendering
- `content/patches/example-patch-v1.mdx` — sample patch note (published: true)
- `src/app/wiki/[category]/page.tsx` — wrapped CategoryListing in Suspense (deviation fix)

## Decisions Made

- Used `@ts-ignore` + `webpackIgnore` comment on pagefind import (post-build asset, not a TS module)
- Built dedicated `/wiki/patch-notes/[slug]` route (not reusing `[category]/[slug]`) to support prev/next cross-patch navigation cleanly
- SearchDropdown returns null when query is empty — no empty-state flash on input focus

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Wrapped CategoryListing in Suspense boundary**
- **Found during:** Task 2 verification (next build)
- **Issue:** `CategoryListing.tsx` calls `useSearchParams()` which requires a Suspense boundary for static prerendering; build failed with "useSearchParams() should be wrapped in a suspense boundary at page /wiki/[category]"
- **Fix:** Added `import { Suspense } from 'react'` and wrapped `<CategoryListing>` in `<Suspense fallback={...}>` in `src/app/wiki/[category]/page.tsx`
- **Files modified:** `src/app/wiki/[category]/page.tsx`
- **Verification:** `npx next build` succeeded after fix
- **Committed in:** `34fa629` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking build error)
**Impact on plan:** Required fix — pre-existing bug from Plan 02-02 that only surfaced during production build. No scope creep.

## Issues Encountered

- TypeScript flagged `import('/pagefind/pagefind.js')` as cannot-find-module — resolved with `// @ts-ignore` since pagefind.js is a post-build asset that doesn't exist at compile time

## Known Stubs

None — all data is wired. Sample patch note has real MDX content. Search shows "Nenhum resultado encontrado" in dev mode (expected; Pagefind index built via postbuild script only).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All wiki content routes complete: category listings, item/mask detail pages, patch notes listing and detail
- Search is wired and will function after `npm run build` (Pagefind postbuild script indexes data-pagefind-body pages)
- Phase 03 (SEO & Performance) can proceed: all content pages have proper metadata structure, data-pagefind-body attributes, static generation
- To test search: run `npm run build && npm run start`, then type in topbar/hero search inputs

---
*Phase: 02-wiki-conteudo*
*Completed: 2026-04-08*
