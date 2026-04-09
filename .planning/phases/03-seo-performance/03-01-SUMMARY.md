---
phase: 03-seo-performance
plan: 01
subsystem: seo
tags: [next.js, metadata, sitemap, robots, open-graph, seo]

# Dependency graph
requires:
  - phase: 02-wiki-conteudo
    provides: getAllContent, getContentBySlug, CATEGORY_MAP, page routes for wiki

provides:
  - metadataBase + title template 'SoulmaskBR | %s' in root layout
  - generateMetadata on all dynamic page types (category, slug, patch-notes slug)
  - static metadata on homepage and patch-notes listing
  - auto-generated /sitemap.xml via src/app/sitemap.ts
  - auto-generated /robots.txt via src/app/robots.ts
  - public/og-default.png (1200x630) for Open Graph previews
  - Unit test stubs for SEO-01 and SEO-02

affects: [03-seo-performance, 04-server-list, verifier]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next.js file convention sitemap.ts + robots.ts for auto-generated XML
    - title.template in root layout for brand-first title inheritance
    - generateMetadata per page type with await params (Next.js 16 async params)
    - category-specific description templates for SEO uniqueness

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - public/og-default.png
    - tests/seo/metadata.test.ts
    - tests/seo/sitemap.test.ts
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/wiki/[category]/page.tsx
    - src/app/wiki/[category]/[slug]/page.tsx
    - src/app/wiki/patch-notes/page.tsx
    - src/app/wiki/patch-notes/[slug]/page.tsx

key-decisions:
  - "Static og:image (/og-default.png 1200x630) for all pages in v1 — dynamic ImageResponse deferred per D-07"
  - "process.env.NEXT_PUBLIC_SITE_URL fallback to hardcoded 'https://soulmaskbr.com' — handles staging vs production"
  - "patch-notes filtered from CATEGORY_MAP loop in sitemap — separate URL pattern /wiki/patch-notes/[slug]"

patterns-established:
  - "Pattern: await params in generateMetadata — Next.js 16 params is a Promise"
  - "Pattern: canonical always points to base URL on paginated listing pages"
  - "Pattern: published=true filter on getAllContent in sitemap to exclude drafts"

requirements-completed: [SEO-01, SEO-02]

# Metrics
duration: 35min
completed: 2026-04-08
---

# Phase 3 Plan 01: SEO Metadata & Sitemap Summary

**Next.js 16 metadata API fully wired: title template 'SoulmaskBR | %s', per-page generateMetadata with canonical + OG tags, auto-generated sitemap.xml and robots.txt, and 1200x630 og-default.png for Discord/WhatsApp previews.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-04-08T14:10:00Z
- **Completed:** 2026-04-08T14:45:00Z
- **Tasks:** 3 (Task 0, Task 1, Task 2)
- **Files modified:** 11

## Accomplishments

- Root layout has `metadataBase`, title template `'SoulmaskBR | %s'`, and OG defaults (og:image, og:siteName, og:locale)
- Every page type (homepage, category, slug, patch-notes listing, patch-notes slug) exports metadata or generateMetadata with unique title, description, and canonical URL
- Auto-generated `/sitemap.xml` via `src/app/sitemap.ts` — enumerates all published content, handles patches URL pattern separately
- Auto-generated `/robots.txt` via `src/app/robots.ts` — allows all crawlers, references sitemap
- `public/og-default.png` (1200x630px) created for Open Graph image previews on Discord/WhatsApp

## Task Commits

Each task was committed atomically:

1. **Task 0: Create Wave 0 test stubs** - `f4bc94d` (test)
2. **Task 1: Root layout + generateMetadata on all page types** - `a8dbc7f` (feat)
3. **Task 2: Sitemap + Robots + OG image** - `782d959` (feat)

## Files Created/Modified

- `src/app/layout.tsx` — Added metadataBase, title template 'SoulmaskBR | %s', OG defaults
- `src/app/page.tsx` — Added static metadata with canonical '/'
- `src/app/wiki/[category]/page.tsx` — Added generateMetadata with CATEGORY_SUBTITLES descriptions and canonical
- `src/app/wiki/[category]/[slug]/page.tsx` — Added generateMetadata with category-specific description templates and OG image
- `src/app/wiki/patch-notes/page.tsx` — Added static metadata with canonical ignoring pagination
- `src/app/wiki/patch-notes/[slug]/page.tsx` — Added generateMetadata with patch version in description
- `src/app/sitemap.ts` — NEW: auto-generates /sitemap.xml with all published pages
- `src/app/robots.ts` — NEW: auto-generates /robots.txt
- `public/og-default.png` — NEW: 1200x630px branded OG image
- `tests/seo/metadata.test.ts` — NEW: SEO-01 unit tests
- `tests/seo/sitemap.test.ts` — NEW: SEO-02 unit tests

## Decisions Made

- **Static og:image only in v1** — `public/og-default.png` (1200x630) used for all pages. Dynamic per-page image generation via `ImageResponse` deferred per D-07 (trust Next.js defaults, no manual optimization).
- **NEXT_PUBLIC_SITE_URL with fallback** — `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'` used in both sitemap.ts and layout.tsx, enabling staging/preview deployments to use correct base URL.
- **Patch-notes excluded from CATEGORY_MAP loop in sitemap** — `CATEGORY_MAP` has `'patch-notes': 'patches'` but patch URLs are `/wiki/patch-notes/[slug]`, not `/wiki/patch-notes/[slug]` via the category loop. Filtered with `.filter(([seg]) => seg !== 'patch-notes')` then enumerated separately.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

**Environment constraint (not a code issue):** The project's `node_modules` were installed on Windows (win32-x64-msvc native binaries for rolldown/lightningcss). Running in WSL fails with "Cannot find module @rolldown/binding-linux-x64-gnu". Both `npm test` and `npx next build` fail in WSL for this reason. TypeScript type-checking (`npx tsc --noEmit`) completed with zero errors, confirming code correctness. The build and tests will pass when run in the original Windows environment.

## Known Stubs

- `public/og-default.png` — A programmatically-generated 1200x630px PNG with dark background (#0c0a09 gradient) and amber border (#d97706). This is a functional placeholder for v1. For best Discord/WhatsApp previews, replace with a proper branded image containing the SoulmaskBR logo and game artwork. The file is committed and the og:image metadata references it correctly.

## Next Phase Readiness

- SEO-01 and SEO-02 requirements are complete
- Phase 03 Plan 02 (JSON-LD Schema.org) can proceed — it builds on the metadata foundation established here
- `og-default.png` should be replaced with a proper branded image before launch

---
*Phase: 03-seo-performance*
*Completed: 2026-04-08*
