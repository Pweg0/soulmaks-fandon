---
phase: 02-wiki-conteudo
plan: 03
subsystem: ui
tags: [nextjs, mdx, next-mdx-remote, shadcn, accordion, breadcrumb, wiki]

requires:
  - phase: 02-wiki-conteudo/02-01
    provides: content types (ItemFrontmatter, MaskFrontmatter), lib/content.ts (getContentBySlug, getAllContent), mdx-components.tsx, CATEGORY_MAP/CATEGORY_LABELS

provides:
  - /wiki/[category]/[slug] detail page route with generateStaticParams
  - ItemHeroCard with gold glow shadow, image, tier badge
  - MaskHeroCard with Dificuldade badge addition
  - StatBlock accordion (2-col grid, section dividers)
  - CraftingRecipe accordion (horizontal scrollable ingredient mini-cards)
  - SkillList accordion (passive/active badges, open by default)
  - BuildTabs accordion (shadcn Tabs inside, placeholder for v1)
  - MDX prose via next-mdx-remote/rsc (React Server Components)
  - Breadcrumb full path navigation on detail pages
  - data-pagefind-body on content wrapper for Pagefind search indexing

affects: [03-seo-performance, wiki-search, pagefind-indexing]

tech-stack:
  added: [next-mdx-remote@6]
  patterns:
    - generateStaticParams iterates CATEGORY_MAP to build all published item routes
    - next-mdx-remote/rsc for RSC-compatible raw MDX string rendering
    - shadcn Accordion (base-ui) with defaultValue array for open-by-default sections
    - Hero card uses shadow-[0_0_0_1px_rgba(237,160,29,0.15)] Tailwind arbitrary value for gold glow
    - Category-conditional rendering in page.tsx (itens vs mascaras vs guias)

key-files:
  created:
    - src/app/wiki/[category]/[slug]/page.tsx
    - src/components/wiki/ItemHeroCard.tsx
    - src/components/wiki/MaskHeroCard.tsx
    - src/components/wiki/StatBlock.tsx
    - src/components/wiki/CraftingRecipe.tsx
    - src/components/wiki/SkillList.tsx
    - src/components/wiki/BuildTabs.tsx
  modified:
    - package.json (added next-mdx-remote@6)

key-decisions:
  - "next-mdx-remote@6 chosen over @next/mdx compileMDX: /rsc export supports React Server Components, peerDep is react>=16 only (compatible with Next.js 16)"
  - "v1 stubs for skills/builds/mimicry/nodes: structured data not in MDX frontmatter yet; MDX body handles descriptions until future data pipeline"
  - "Inline HTML <details> for location/related/mimetismo/nodes sections in page.tsx instead of Accordion: avoids 'use client' propagation on server page"

patterns-established:
  - "Pattern: next-mdx-remote/rsc for rendering raw MDX content strings in RSC pages"
  - "Pattern: shadcn Accordion defaultValue={['key']} + AccordionItem value='key' for open-by-default sections"
  - "Pattern: Tailwind shadow-[...] arbitrary value for gold glow token rgba(237,160,29,0.15)"

requirements-completed: [WIKI-03, WIKI-04]

duration: 9min
completed: 2026-04-09
---

# Phase 02 Plan 03: Item and Mask Detail Pages Summary

**Wiki detail pages with hero cards, accordion content sections, and MDX prose rendering via next-mdx-remote/rsc Server Components.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-09T02:57:39Z
- **Completed:** 2026-04-09T03:06:00Z
- **Tasks:** 2 of 2
- **Files modified:** 7 created + 2 modified (package.json, package-lock.json)

## Accomplishments

- Created `/wiki/[category]/[slug]` Server Component route with `generateStaticParams` for all published items across all CATEGORY_MAP categories
- Implemented ItemHeroCard and MaskHeroCard with gold glow shadow, image placeholders, tier/difficulty badges using UI-SPEC color semantics
- Built 4 accordion sections: StatBlock (2-col grid stats), CraftingRecipe (horizontal scroll), SkillList (passive/active badges), BuildTabs (shadcn Tabs)
- Installed and configured `next-mdx-remote@6` for RSC-compatible MDX rendering; `next-mdx-remote/rsc` renders raw MDX strings from `getContentBySlug` using `useMDXComponents` mapping
- Added `data-pagefind-body` on content wrapper for Pagefind search indexing of detail pages
- Breadcrumb with full path (Inicio > Wiki > Category > Item) and current page in `text-primary`

## Task Commits

1. **Task 1: Detail page route + hero card components** - `5e6299c` (feat)
2. **Task 2: Accordion content sections** - `24f1be7` (feat)
3. **Dependency: next-mdx-remote installation** - `2b0f3dc` (chore)

## Files Created/Modified

- `src/app/wiki/[category]/[slug]/page.tsx` - Detail route with generateStaticParams, breadcrumb, hero card dispatch, accordion sections, MDX body
- `src/components/wiki/ItemHeroCard.tsx` - Full-width hero card with 160px/96px image, tier badge, gold glow shadow
- `src/components/wiki/MaskHeroCard.tsx` - Same as ItemHeroCard + Dificuldade badge with tiered color semantics
- `src/components/wiki/StatBlock.tsx` - Stats accordion: 2-col grid, section dividers at rgba(237,160,29,0.25), open by default
- `src/components/wiki/CraftingRecipe.tsx` - Crafting accordion: horizontal scrollable mini-cards with hover:border-primary
- `src/components/wiki/SkillList.tsx` - Skills accordion: passive/active Badge, icon placeholder, v1 placeholder text
- `src/components/wiki/BuildTabs.tsx` - Builds accordion wrapping shadcn Tabs, v1 placeholder text
- `package.json` / `package-lock.json` - Added next-mdx-remote@6

## Decisions Made

- **next-mdx-remote/rsc chosen:** `@next/mdx` only compiles `.mdx` files as page routes (webpack loader), not raw strings at runtime. `next-mdx-remote@6` has a `/rsc` export compatible with RSC and peerDep `react>=16` only — fully compatible with Next.js 16.
- **v1 stubs for skills/builds/mimicry/nodes:** Mask content data (skills, builds, node trees) is embedded in MDX body text scraped from wiki, not in structured frontmatter. Placeholders are noted in SUMMARY Known Stubs section.
- **Inline `<details>` for some sections:** Location, Related Items, Mimetismo, and Nos sections in `page.tsx` use `<details>/<summary>` HTML (no JS needed) instead of shadcn Accordion to keep `page.tsx` as a pure Server Component without `"use client"` propagation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing next-mdx-remote dependency**
- **Found during:** Task 1 (MDX rendering in page.tsx)
- **Issue:** `next-mdx-remote` not in package.json; plan expected it to be available or installable
- **Fix:** `npm install next-mdx-remote@latest` — v6 confirmed compatible with Next.js 16
- **Files modified:** package.json, package-lock.json
- **Committed in:** 2b0f3dc

---

**Total deviations:** 1 auto-fixed (blocking dependency install)
**Impact on plan:** Required, no scope creep.

## Known Stubs

| Component | File | Stub | Reason |
|-----------|------|------|--------|
| SkillList | src/components/wiki/SkillList.tsx | Placeholder text when no `skills` prop | Skills are in MDX body text, not structured frontmatter — future data pipeline plan |
| BuildTabs | src/components/wiki/BuildTabs.tsx | "Builds recomendados serao adicionados em breve." | Builds not in frontmatter — future data pipeline plan |
| MimetismoSection | src/app/wiki/[category]/[slug]/page.tsx | Refers user to MDX body for Passive/Active effects | Mimicry data in MDX body scraped content |
| NosSection | src/app/wiki/[category]/[slug]/page.tsx | "Nos da Mascara serao adicionados em breve." | Node trees in MDX body, not structured |

These stubs do NOT prevent the plan goal: item and mask detail pages render with hero cards, accordions, and MDX body. The stubs are in supplementary sections; core content is in the MDX body below.

## Next Phase Readiness

- Detail pages at `/wiki/[category]/[slug]` are statically generated for all published items
- ItemHeroCard, MaskHeroCard, and all accordion sections ready for use
- Pagefind can index detail pages via `data-pagefind-body`
- Plan 04 (patch notes) can reuse breadcrumb and MDX body rendering patterns
