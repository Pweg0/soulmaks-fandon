---
phase: 02-wiki-conteudo
plan: 02
subsystem: ui
tags: [nextjs, react, tailwind, shadcn, typescript, mdx, wiki]

requires:
  - phase: 02-01
    provides: ContentItem types, getAllContent/getContentCategories functions, CATEGORY_MAP/CATEGORY_LABELS

provides:
  - /wiki/[category] route with generateStaticParams for itens, mascaras, guias, patch-notes
  - CategoryListing client component with filter/sort/pagination state via URL params
  - FilterBar with sticky subcategory tabs, sort select, and ViewToggle
  - ViewToggle with LayoutGrid/Table2 icons, tooltips, aria-pressed
  - ItemCard grid card with image, category badge, tier badge, hover gold border
  - Empty state for categories with no published content

affects: [02-03, 02-04, 03-seo-performance]

tech-stack:
  added: []
  patterns:
    - "useSearchParams for shareable filter/sort/page URLs in client components"
    - "Server Component fetches all data (including unpublished), client filters to published-only"
    - "Pagination with ellipsis: 7-page window, currentPage-centered"
    - "Tier badge semantics: S/Legendary=gold border, A=steel-blue, B+=gray"

key-files:
  created:
    - src/app/wiki/[category]/page.tsx
    - src/app/wiki/[category]/layout.tsx
    - src/components/wiki/CategoryListing.tsx
    - src/components/wiki/FilterBar.tsx
    - src/components/wiki/ViewToggle.tsx
    - src/components/wiki/ItemCard.tsx
  modified: []

key-decisions:
  - "Server Component passes all items (published=false) to CategoryListing; client filters to published=true — avoids searchParams in Server Component (RESEARCH Pitfall 1)"
  - "useSearchParams with router.push for view/sub/sort/page — URLs are shareable and bookmarkable"
  - "Grid: 24 items/page, Table: 50 items/page (per UI-SPEC D-06)"
  - "Stub components (StatBlock, CraftingRecipe, SkillList, BuildTabs) created to unblock build — replaced by Plan 03 parallel agent"

patterns-established:
  - "Pattern: Client filtering component receives all server data, applies published filter first"
  - "Pattern: URL params as single source of truth for filter/sort/page state"

requirements-completed: [WIKI-01]

duration: 35min
completed: 2026-04-09
---

# Phase 2 Plan 02: Category Listing Pages Summary

**Category listing pages at /wiki/[category] with sticky FilterBar (subcategory tabs, sort, view toggle), grid/table views, ItemCard components, and client-side pagination via URL params**

## Performance

- **Duration:** 35 min
- **Started:** 2026-04-09T03:00:00Z
- **Completed:** 2026-04-09T03:35:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- `/wiki/[category]` Server Component with `generateStaticParams` covering itens, mascaras, guias, patch-notes — static at build time with 24h ISR revalidation
- `CategoryListing` client component with `useSearchParams` for shareable filter/sort/page URLs — avoids searchParams in Server Component (RESEARCH Pitfall 1 compliance)
- `FilterBar` sticky below topbar (top-14, z-10) with pill tabs, sort select, ViewToggle
- `ViewToggle` with LayoutGrid/Table2 icons, TooltipProvider delay=500ms, aria-pressed states
- `ItemCard` with 64x64 image/fallback, category badge, tier badge (gold/steel-blue/gray semantics), hover gold border + shadow, navigates to detail page

## Task Commits

Each task was committed atomically:

1. **Task 1: Category listing route + CategoryListing client component** - `a3e5930` (feat)
2. **Task 2: FilterBar + ViewToggle + ItemCard components** - `403255c` (feat — captured in Plan 03 docs commit due to parallel agent timing)

**Plan metadata:** (see state update commit below)

## Files Created/Modified

- `src/app/wiki/[category]/page.tsx` — Server Component with generateStaticParams, breadcrumb, hero title, CategoryListing
- `src/app/wiki/[category]/layout.tsx` — Passthrough layout enabling nested [slug] route
- `src/components/wiki/CategoryListing.tsx` — Client component: filter/sort/paginate with useSearchParams, grid + table views, empty state
- `src/components/wiki/FilterBar.tsx` — Sticky filter bar: subcategory pills, sort select, ViewToggle
- `src/components/wiki/ViewToggle.tsx` — Grid/Table toggle: LayoutGrid + Table2, tooltips, aria-pressed
- `src/components/wiki/ItemCard.tsx` — Grid card: 64x64 image, category/tier badges, hover border-primary

## Decisions Made

- Server Component fetches all items (`publishedOnly=false`) and passes to CategoryListing; client filters to `published===true` — this avoids using `searchParams` in the Server Component (RESEARCH.md Pitfall 1)
- `useSearchParams` + `router.push` for all filter state: view, sub, sort, page — URLs are shareable and bookmarkable
- Grid = 24 items/page, Table = 50 items/page (per UI-SPEC D-06)
- `data-pagefind-ignore` on category page wrapper — listing pages excluded from Pagefind search index

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created stub components to unblock build**
- **Found during:** Task 1 (verifying build)
- **Issue:** Pre-existing `src/app/wiki/[category]/[slug]/page.tsx` (from Plan 01) imported StatBlock, CraftingRecipe, SkillList, BuildTabs — which didn't exist yet (Plan 03 components). TypeScript build failed.
- **Fix:** Created stub implementations for all 4 missing components. These stubs were subsequently replaced by Plan 03's parallel agent with full implementations before this plan's commits were finalized.
- **Files modified:** src/components/wiki/StatBlock.tsx, CraftingRecipe.tsx, SkillList.tsx, BuildTabs.tsx
- **Verification:** TypeScript check exits 0, build passes
- **Committed in:** Captured in Plan 03 agent commits (parallel execution)

**2. [Rule 1 - Bug] Fixed TypeScript type error in FilterBar Select onValueChange**
- **Found during:** Task 2 TypeScript check
- **Issue:** `onValueChange` type from base-ui Select is `(value: string | null, ...) => void` but handler expected `string`
- **Fix:** Added null guard: `(value) => value && onSortChange(value)`
- **Files modified:** src/components/wiki/FilterBar.tsx
- **Verification:** TypeScript exits 0

**3. [Rule 1 - Bug] Fixed TooltipTrigger asChild incompatibility**
- **Found during:** Task 2 TypeScript check
- **Issue:** `TooltipTrigger` from base-ui doesn't accept `asChild` prop — causes TS2322 error
- **Fix:** Used `TooltipTrigger` directly as button element instead of wrapping native `<button>` with asChild
- **Files modified:** src/components/wiki/ViewToggle.tsx
- **Verification:** TypeScript exits 0

---

**Total deviations:** 3 auto-fixed (1 blocking, 2 bugs)
**Impact on plan:** All auto-fixes necessary for build correctness. No scope creep.

## Issues Encountered

- Parallel agent (Plan 03) was executing concurrently and committed FilterBar/ViewToggle/ItemCard files as part of its docs commit — these files were created in this plan's working tree but captured in the 03 commit. Functionally identical outcome, just different commit attribution.

## Known Stubs

None in this plan's components — all data flows from real `getAllContent` / `getContentCategories` calls. The empty state ("Nenhum conteudo publicado ainda") correctly renders when no published content exists, which is the expected state for v1 before content is reviewed and published.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Category listing pages at /wiki/itens, /wiki/mascaras, /wiki/guias, /wiki/patch-notes are statically generated
- FilterBar, ViewToggle, ItemCard all ready for use by detail page plan (Plan 04)
- Empty state renders correctly — content becomes visible once `published: true` is set in MDX frontmatter

---
*Phase: 02-wiki-conteudo*
*Completed: 2026-04-09*
