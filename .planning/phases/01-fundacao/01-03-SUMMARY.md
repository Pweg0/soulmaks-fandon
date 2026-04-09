---
phase: 01-fundacao
plan: 03
subsystem: infra
tags: [scraping, mdx, fandom, mediawiki, axios, cheerio, typescript, translation]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js project structure, vitest setup, axios and cheerio dependencies installed

provides:
  - Rate-limited Axios HTTP client (SoulmaskBR-Wiki-Bot, 1.5s delay)
  - TypeScript interfaces: ScrapedContent, ScrapedItem, ScrapedMask, ScrapedGuide, ScrapedPatch, ScraperOptions
  - writeMdx() function writing MDX with frontmatter (published: false always)
  - Fandom MediaWiki API scraper with category pagination (cmcontinue)
  - wiki.gg Cheerio scraper skeleton with robots.txt check
  - CLI orchestrator (--dry-run, --fandom-only flags)
  - 75 scraped MDX files committed (65 items + 10 masks from Fandom)
  - content/{items,masks,guides,patches}/ directory structure
  - scripts/translate/WORKFLOW.md: AI draft + manual review + publish workflow

affects:
  - Phase 2: Wiki & Conteudo — reads from content/ MDX files for wiki pages
  - All phases: MDX frontmatter schema established here is the canonical schema

# Tech tracking
tech-stack:
  added:
    - tsx (^4.21.0) — TypeScript execution for scraper CLI
  patterns:
    - MediaWiki API pagination via cmcontinue token
    - Rate-limited Axios interceptor (1.5s between requests)
    - Wikitext-to-Markdown transformation pipeline
    - MDX frontmatter schema with published:false default
    - robots.txt compliance check before scraping

key-files:
  created:
    - scripts/scraper/utils/types.ts
    - scripts/scraper/utils/http.ts
    - scripts/scraper/utils/mdx-writer.ts
    - scripts/scraper/tsconfig.json
    - scripts/scraper/fandom.ts
    - scripts/scraper/wikigg.ts
    - scripts/scraper/index.ts
    - scripts/translate/WORKFLOW.md
    - tests/scraper/mdx-writer.test.ts
    - tests/scraper/fandom.test.ts
    - content/items/*.mdx (65 files)
    - content/masks/*.mdx (10 files)
    - content/{items,masks,guides,patches}/.gitkeep
  modified:
    - package.json (added scrape/scrape:dry scripts, tsx devDependency)

key-decisions:
  - "Fandom MediaWiki API (/api.php) used instead of HTML scraping — more reliable and structured"
  - "wiki.gg skeleton skips scraping due to robots.txt disallow — Fandom is primary source"
  - "published:false always set by writeMdx() — requires manual review before publication (D-09)"
  - "ESM/CJS compatibility in index.ts via import.meta.url fallback for __dirname"
  - "Category pages (Category:Armor, etc.) scraped as items — will need filtering in Phase 2"

patterns-established:
  - "Pattern: writeMdx(item, contentDir) — canonical MDX writer used by all scrapers"
  - "Pattern: ScraperOptions.dryRun — controls enumerate-only vs full scrape mode"
  - "Pattern: Per-page try/catch in scrapeFandom — errors logged but scrape continues"

requirements-completed:
  - INFR-04

# Metrics
duration: 10min
completed: 2026-04-09
---

# Phase 01 Plan 03: Scraping Pipeline Summary

**Fandom MediaWiki API scraper with rate-limiting writes 75 MDX files (65 items, 10 masks) to content/ with published:false, plus documented AI draft + manual review translation workflow.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-09T00:40:42Z
- **Completed:** 2026-04-09T00:50:05Z
- **Tasks:** 2 completed
- **Files modified:** 88 (9 utilities/tests + 4 gitkeeps + 75 MDX content files)

## Accomplishments

- Built complete scraping pipeline: types, rate-limited HTTP client, MDX writer (TDD — 4 tests)
- Fandom MediaWiki API scraper enumerates categories via cmcontinue pagination, converts wikitext to Markdown
- Actually scraped and committed 75 MDX files from Fandom wiki (per D-08 aggressive scrape mandate)
- wiki.gg skeleton correctly respects robots.txt (disallowed — skipped gracefully)
- CLI orchestrator with --dry-run and --fandom-only flags, npm run scrape/scrape:dry scripts added
- Translation workflow documented: AI draft -> manual review -> published:true publish flow (per D-09)
- All 5 vitest tests pass (4 mdx-writer + 1 fandom module export)

## Task Commits

1. **Task 1: Scraper utilities — types, HTTP client, MDX writer** - `e58e88a` (feat)
   - TDD: RED (test failed) -> GREEN (4 tests pass)
2. **Task 2: Fandom scraper, wiki.gg, orchestrator, MDX content, WORKFLOW.md** - `8e641db` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified

- `scripts/scraper/utils/types.ts` — ScrapedContent, ScrapedItem, ScrapedMask, ScrapedGuide, ScrapedPatch, ScraperOptions interfaces
- `scripts/scraper/utils/http.ts` — Axios instance with 1.5s rate-limit interceptor and SoulmaskBR-Wiki-Bot User-Agent
- `scripts/scraper/utils/mdx-writer.ts` — writeMdx() creates directories, writes MDX with frontmatter, published:false always
- `scripts/scraper/tsconfig.json` — TypeScript config for scripts with ESM modules
- `scripts/scraper/fandom.ts` — Fandom scraper: getAllPages(), getPageContent(), parseItemPage(), scrapeFandom()
- `scripts/scraper/wikigg.ts` — wiki.gg skeleton: robots.txt check, Cheerio HTML scraping for known pages
- `scripts/scraper/index.ts` — CLI orchestrator with --dry-run and --fandom-only flags
- `scripts/translate/WORKFLOW.md` — AI draft + manual review + publish translation pipeline documentation
- `tests/scraper/mdx-writer.test.ts` — 4 vitest tests for MDX writer (frontmatter, directory creation, gray-matter, published:false)
- `tests/scraper/fandom.test.ts` — Export verification test for scrapeFandom
- `content/items/*.mdx` — 65 scraped MDX files from Fandom Category:Items
- `content/masks/*.mdx` — 10 scraped MDX files from Fandom Category:Masks
- `content/{items,masks,guides,patches}/.gitkeep` — Git directory tracking
- `package.json` — Added scrape/scrape:dry scripts, tsx devDependency

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed __dirname incompatibility in ESM context**
- **Found during:** Task 2 — index.ts uses `__dirname` but tsx/ESM contexts may not define it
- **Issue:** Plan template used `__dirname` which is not defined in ES module context
- **Fix:** Added ESM/CJS compatibility: `typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))`
- **Files modified:** scripts/scraper/index.ts

### Observations (Not Deviations)

- wiki.gg correctly blocked by robots.txt — this is expected behavior, not a failure
- Category pages (Category:Armor, etc.) from Fandom were scraped as items; Phase 2 should filter these out or handle them appropriately
- Guides category on Fandom returned 0 pages — handled gracefully

## Known Stubs

None. All 75 MDX files contain real scraped content from Fandom wiki with `published: false` as intended. Content requires manual translation to pt-BR before publishing.

## Self-Check: PASSED

- `scripts/scraper/utils/types.ts` - EXISTS
- `scripts/scraper/utils/http.ts` - EXISTS
- `scripts/scraper/utils/mdx-writer.ts` - EXISTS
- `scripts/scraper/fandom.ts` - EXISTS
- `scripts/scraper/wikigg.ts` - EXISTS
- `scripts/scraper/index.ts` - EXISTS
- `scripts/translate/WORKFLOW.md` - EXISTS
- `content/items/.gitkeep` - EXISTS
- `content/masks/.gitkeep` - EXISTS
- `content/guides/.gitkeep` - EXISTS
- `content/patches/.gitkeep` - EXISTS
- Commit `e58e88a` - EXISTS (feat(01-03): scraper utilities)
- Commit `8e641db` - EXISTS (feat(01-03): Fandom scraper...)
- 5 tests pass: vitest run tests/scraper/ - CONFIRMED PASS
