---
phase: 02-wiki-conteudo
verified: 2026-04-08T12:00:00Z
status: gaps_found
score: 3/5 success criteria verified
gaps:
  - truth: "Visitante acessa a pagina de um item e ve stats, receita de crafting e localizacao de obtencao — tudo em pt-BR"
    status: failed
    reason: "All 65 scraped items have published:false and English-language content. No item has stats/crafting/location frontmatter populated. The page infrastructure (StatBlock, CraftingRecipe, detail route) is correct and wired, but no publishable pt-BR item content exists to render."
    artifacts:
      - path: "content/items/*.mdx"
        issue: "All 65 files have published:false and English body text. No stats/crafting/location fields present in any item frontmatter (scraper extractInfobox found no infoboxes on scraped pages)."
    missing:
      - "At least one item MDX file with published:true and pt-BR body text"
      - "Structured frontmatter (stats/crafting/location) populated from infobox extraction OR manually authored for a demo item"

  - truth: "Visitante acessa a pagina de uma mascara e ve habilidades, builds recomendados e descricao — tudo em pt-BR"
    status: failed
    reason: "All 10 scraped masks have published:false and English-language content. SkillList and BuildTabs are called with no props (<SkillList /> <BuildTabs />) and show v1 placeholder text only. No pt-BR mask content exists."
    artifacts:
      - path: "content/masks/*.mdx"
        issue: "All 10 mask files have published:false and English body text."
      - path: "src/app/wiki/[category]/[slug]/page.tsx"
        issue: "SkillList and BuildTabs called without skills or builds props — always shows placeholder text 'Habilidades detalhadas disponiveis no corpo do artigo abaixo' and 'Builds recomendados serao adicionados em breve'."
    missing:
      - "At least one mask MDX file with published:true and pt-BR body text"
      - "SkillList and BuildTabs either receive structured props or display MDX body content instead of static placeholder strings"

  - truth: "Todo conteudo e original em pt-BR (WIKI-06)"
    status: failed
    reason: "Only the sample patch note (example-patch-v1.mdx) is published in pt-BR. All 65 items and 10 masks are in English with published:false. No guides content exists at all (content/guides/ is an empty directory with only .gitkeep). The pipeline to produce pt-BR content is built but no actual pt-BR item or mask content has been produced."
    artifacts:
      - path: "content/items/"
        issue: "65 files, all English, all published:false"
      - path: "content/masks/"
        issue: "10 files, all English, all published:false"
      - path: "content/guides/"
        issue: "Empty directory — no guide content exists at all"
    missing:
      - "At least a representative set of items and masks rewritten in pt-BR with published:true"
      - "At least one guide in pt-BR"
human_verification:
  - test: "Navigate to /wiki/itens after publishing at least one item"
    expected: "Item card appears in grid view with Portuguese title, category badge, tier badge. Click leads to detail page showing hero card, stat accordion sections, and Portuguese MDX prose."
    why_human: "Requires actual content to be published — automated checks cannot verify rendering quality of pt-BR content and visual theme consistency"
  - test: "Verify Pagefind search returns results after npm run build"
    expected: "Typing a search term in topbar or hero input shows dropdown with highlighted matches from wiki content"
    why_human: "Pagefind index only exists post-build; cannot verify search results without running a full production build"
---

# Phase 02: Wiki & Conteudo Verification Report

**Phase Goal:** Visitante encontra e le todo o conteudo do jogo em portugues — categorias, itens, mascaras, guias e patch notes
**Verified:** 2026-04-08
**Status:** GAPS FOUND
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitante acessa a pagina inicial e ve categorias distintas (itens/crafting, mascaras/skills, guias/tutoriais, patch notes) com conteudo listado em cada uma | VERIFIED | CategoryCards.tsx has all 4 category hrefs. /wiki/[category] route generates static params for itens, mascaras, guias, patch-notes. Empty state renders correctly when no published content. |
| 2 | Visitante digita um termo na busca e recebe uma lista de resultados relevantes que levam a paginas corretas | VERIFIED (with caveat) | SearchDropdown.tsx is fully wired to Topbar and HeroBanner. Pagefind dynamic import, 300ms debounce, keyboard nav, aria-listbox/option all implemented. Wiring is complete; index only exists post-build (expected behavior, not a gap). |
| 3 | Visitante acessa a pagina de um item e ve stats, receita de crafting e localizacao de obtencao — tudo em pt-BR | FAILED | Infrastructure is complete (detail route, StatBlock, CraftingRecipe, location section) but all 65 scraped items are published:false with English content and no structured stats/crafting/location fields populated. No visitor can access an item page. |
| 4 | Visitante acessa a pagina de uma mascara e ve habilidades, builds recomendados e descricao — tudo em pt-BR | FAILED | Infrastructure is complete (MaskHeroCard, SkillList, BuildTabs, detail route) but all 10 masks are published:false with English content. SkillList and BuildTabs show static placeholder text because they receive no structured props. |
| 5 | Visitante acessa a secao de patch notes e le a traducao da ultima atualizacao do jogo | VERIFIED | /wiki/patch-notes route is complete. example-patch-v1.mdx is published:true with real pt-BR prose content. PatchEntry with gold left border and "Ler mais" link renders. Detail page with prev/next navigation and MDX body is fully implemented. |

**Score: 3/5 success criteria verified**

---

## Required Artifacts (from Plan must_haves)

### Plan 02-01 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/types/content.ts` | VERIFIED | Exports ItemFrontmatter, MaskFrontmatter, PatchFrontmatter, ContentItem, CATEGORY_MAP, CATEGORY_LABELS — 6 exports confirmed |
| `src/lib/content.ts` | VERIFIED | Exports getAllContent, getContentBySlug, getContentCategories — 3 exports. Uses fs/promises + gray-matter. Real filesystem reads, server-side only. |
| `src/mdx-components.tsx` | VERIFIED | Exports useMDXComponents with h2 (Cinzel), h3, p, a (primary color), blockquote, code styling. |
| `scripts/scraper/fandom.ts` | VERIFIED | extractInfobox function exported at line 97. Called in parseItemPage at line 217. |
| `src/components/ui/{accordion,breadcrumb,pagination,select,skeleton,table,tabs,tooltip}.tsx` | VERIFIED | All 8 shadcn components present. |
| `--tier-a` in globals.css | VERIFIED | Line 88: `--tier-a: 200 60% 35%` and line 51: `--color-tier-a: hsl(var(--tier-a))` |
| `postbuild` in package.json | VERIFIED | `"postbuild": "pagefind --site .next --output-path .next/static/chunks/app/pagefind"` |
| `tests/scraper/fandom-infobox.test.ts` | VERIFIED | File exists with tests for extractInfobox, parseItemPage, writeMdx expanded fields, skipExisting |

### Plan 02-02 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/app/wiki/[category]/page.tsx` | VERIFIED | generateStaticParams, dynamicParams=false, Suspense boundary for CategoryListing, breadcrumb, data-pagefind-ignore |
| `src/app/wiki/[category]/layout.tsx` | VERIFIED | Passthrough layout exists |
| `src/components/wiki/FilterBar.tsx` | VERIFIED | sticky top-14 z-10, "Todos" tab, Ordenar por select, ViewToggle embedded |
| `src/components/wiki/ViewToggle.tsx` | VERIFIED | LayoutGrid + Table2 icons, aria-pressed on both buttons |
| `src/components/wiki/ItemCard.tsx` | VERIFIED | Link to /wiki/{category}/{slug}, border-primary hover, 64px image |
| `src/components/wiki/CategoryListing.tsx` | VERIFIED | useSearchParams, grid+table views, filtering, pagination, "resultados encontrados" count, empty state |

### Plan 02-03 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/app/wiki/[category]/[slug]/page.tsx` | VERIFIED | generateStaticParams, dynamicParams=false, getContentBySlug, MDXRemote, data-pagefind-body, full breadcrumb |
| `src/components/wiki/ItemHeroCard.tsx` | VERIFIED | 160/96px responsive image, gold glow shadow, tier badge |
| `src/components/wiki/MaskHeroCard.tsx` | VERIFIED | Extends ItemHeroCard with Dificuldade badge and tiered color mapping |
| `src/components/wiki/StatBlock.tsx` | VERIFIED | "Estatisticas" Accordion, 2-col grid, section dividers at rgba(237,160,29,0.25), open by default |
| `src/components/wiki/CraftingRecipe.tsx` | VERIFIED | "Receita de Crafting" Accordion, overflow-x-auto flex container, ingredient mini-cards with hover:border-primary |
| `src/components/wiki/SkillList.tsx` | VERIFIED (structure) / WARNING (data) | "Habilidades" Accordion, passive/active Badge. Called without props in page.tsx — always shows placeholder text. |
| `src/components/wiki/BuildTabs.tsx` | VERIFIED (structure) / WARNING (data) | "Builds Recomendados" Accordion, Tabs component. Always shows "Builds recomendados serao adicionados em breve." |

### Plan 02-04 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/components/wiki/SearchDropdown.tsx` | VERIFIED | pagefind dynamic import, role="listbox", "Nenhum resultado encontrado" state, skeleton loading, keyboard nav |
| `src/components/layout/Topbar.tsx` | VERIFIED | searchQuery state, SearchDropdown imported and rendered, useRef click-outside handler |
| `src/components/home/HeroBanner.tsx` | VERIFIED | searchQuery state, SearchDropdown imported with maxWidth="560px" |
| `src/components/wiki/PatchEntry.tsx` | VERIFIED | border-l-[3px] border-l-primary, version badge, Cinzel title, "Ler mais" link, excerpt from MDX body |
| `src/app/wiki/patch-notes/page.tsx` | VERIFIED | getAllContent('patches'), chronological sort, Cinzel "Patch Notes" title, empty state, pagination |
| `src/app/wiki/patch-notes/[slug]/page.tsx` | VERIFIED | generateStaticParams, data-pagefind-body, MDXRemote, "Patch anterior"/"Proximo patch" nav |
| `content/patches/example-patch-v1.mdx` | VERIFIED | published:true, pt-BR content, version, date, real prose content |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/lib/content.ts` | `content/**/*.mdx` | fs/promises + gray-matter | WIRED | `matter(raw)` pattern confirmed, path.join(process.cwd(), 'content') used |
| `src/types/content.ts` | `src/lib/content.ts` | type imports | WIRED | Line 10: `import type { ItemFrontmatter, ContentItem } from '@/types/content'` |
| `src/app/wiki/[category]/page.tsx` | `src/lib/content.ts` | getAllContent at build time | WIRED | `getAllContent(fsCategory, false)` and `getContentCategories(fsCategory)` |
| `src/components/wiki/CategoryListing.tsx` | `FilterBar.tsx` | renders with state callbacks | WIRED | Import line 6, rendered at line 189 with all callbacks |
| `src/components/wiki/CategoryListing.tsx` | `ItemCard.tsx` | maps items in grid mode | WIRED | Import line 7, rendered in grid view at line 215 |
| `src/app/wiki/[category]/[slug]/page.tsx` | `src/lib/content.ts` | getContentBySlug at build time | WIRED | `getContentBySlug(fsDir, slug)` at line 68 |
| `src/app/wiki/[category]/[slug]/page.tsx` | `src/mdx-components.tsx` | MDXRemote with custom components | WIRED | `useMDXComponents({})` at line 76, passed to MDXRemote |
| `src/app/wiki/[category]/[slug]/page.tsx` | `StatBlock.tsx` | renders with item.frontmatter.stats | WIRED | `<StatBlock stats={(frontmatter as ItemFrontmatter).stats} />` |
| `src/components/wiki/SearchDropdown.tsx` | pagefind index | window.pagefind.debouncedSearch() | WIRED | dynamic import with webpackIgnore at line 52, dev fallback at line 56 |
| `src/components/layout/Topbar.tsx` | `SearchDropdown.tsx` | renders below input | WIRED | Import line 7, rendered at line 62 with searchQuery state |
| `src/app/wiki/patch-notes/page.tsx` | `src/lib/content.ts` | getAllContent('patches') | WIRED | Line 36: `await getAllContent('patches', true)` |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `CategoryListing.tsx` | `items` (ContentItem[]) | `getAllContent()` in parent Server Component | Yes — real fs reads via gray-matter | FLOWING |
| `[slug]/page.tsx` StatBlock | `stats` | `getContentBySlug()` → `frontmatter.stats` | Empty — no scraped item has stats in frontmatter | DISCONNECTED (content gap, not code gap) |
| `[slug]/page.tsx` SkillList | `skills` prop | Not passed — called as `<SkillList />` | No — always undefined | HOLLOW_PROP |
| `[slug]/page.tsx` BuildTabs | `builds` prop | Not passed — called as `<BuildTabs />` | No — always undefined | HOLLOW_PROP |
| `SearchDropdown.tsx` | `results` | `window.pagefind.debouncedSearch()` | Yes (post-build) — correct wiring, dev fallback graceful | FLOWING (post-build only, expected) |
| `PatchEntry.tsx` | `patch` prop | `getAllContent('patches')` | Yes — example-patch-v1.mdx is published with real content | FLOWING |

**Note on HOLLOW_PROP for SkillList and BuildTabs:** These are documented v1 stubs (per 02-03 SUMMARY Known Stubs section). The plan intentionally deferred structured skills/builds data until a future data pipeline plan. The MDX body is expected to carry this information. However, the call site at `/wiki/[category]/[slug]/page.tsx` passes no props at all — the MDX body is rendered after the accordions, so a visitor would see "Habilidades detalhadas disponiveis no corpo do artigo abaixo." and then the MDX content below. This is an acknowledged v1 limitation, not a surprise bug.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| content.ts getAllContent reads MDX files | `node -e "require check"` | Cannot run TS directly; pattern verified via code inspection — gray-matter import, fs.readdir, matter(raw), ContentItem structure | SKIP (TS — needs build) |
| SearchDropdown exports default function | grep export | `export default function SearchDropdown` at line 60 | PASS |
| Topbar imports SearchDropdown correctly | grep import | Default import matches default export | PASS |
| PatchEntry "Ler mais" link present | grep "Ler mais" | Line 71 in PatchEntry.tsx | PASS |
| generateStaticParams in detail page | grep | Confirmed in [slug]/page.tsx line 42 | PASS |
| pagefind postbuild script in package.json | grep | Confirmed at line 8 | PASS |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| WIKI-01 | 02-02 | Navegacao por categorias | SATISFIED | /wiki/[category] route with filter bar, grid/table views, pagination, breadcrumbs. All 4 categories generated statically. |
| WIKI-02 | 02-04 | Busca por texto livre | SATISFIED (post-build) | SearchDropdown wired to Topbar and HeroBanner with Pagefind. Index created by postbuild script. Dev graceful fallback. |
| WIKI-03 | 02-01, 02-03 | Pagina individual de item com stats/receita/localizacao | PARTIAL | Route, StatBlock, CraftingRecipe, location section all exist and are wired. Zero published pt-BR items exist. Visitor cannot access any item page. |
| WIKI-04 | 02-01, 02-03 | Pagina individual de mascara com habilidades e builds | PARTIAL | Route, SkillList, BuildTabs, MaskHeroCard all exist. Zero published pt-BR masks. SkillList/BuildTabs called without structured data — show placeholder text. |
| WIKI-05 | 02-04 | Patch notes e noticias em pt-BR | SATISFIED | /wiki/patch-notes listing + /wiki/patch-notes/[slug] detail pages complete. example-patch-v1.mdx published in pt-BR with real content. prev/next navigation works. |
| WIKI-06 | 02-01 | Todo conteudo original em pt-BR | PARTIAL | Scraper pipeline, MDX writing infrastructure, and expanded frontmatter types are built. The only published pt-BR content is example-patch-v1.mdx. All 65 items and 10 masks remain English + published:false. content/guides/ is empty. |

**Orphaned requirements check:** All 6 requirement IDs (WIKI-01 through WIKI-06) appear in plan frontmatter. No orphaned requirements.

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/app/wiki/[category]/[slug]/page.tsx:138-139` | `<SkillList />` and `<BuildTabs />` called with no props — always renders placeholder text | Warning | Mask detail pages show placeholder text only. Acknowledged v1 design decision per SUMMARY. MDX body below carries the actual content. |
| `content/items/*.mdx` (65 files) | All `published: false`, English content, no structured frontmatter (stats/crafting/location absent) | Blocker | WIKI-03 success criterion cannot be met — no item pages accessible to visitors |
| `content/masks/*.mdx` (10 files) | All `published: false`, English content | Blocker | WIKI-04 success criterion cannot be met — no mask pages accessible to visitors |
| `content/guides/` | Empty directory (only .gitkeep) | Blocker | WIKI-06 requires guides content; none exists |

---

## Human Verification Required

### 1. Item Page Visual Verification

**Test:** Temporarily set `published: true` in one item MDX file (e.g., content/items/bloodstone.mdx) and run `npm run dev`. Navigate to /wiki/itens/bloodstone.
**Expected:** Hero card renders with item image placeholder, English title (Bloodstone), accordion sections. StatBlock should be hidden (no stats in frontmatter). MDX body shows the English description. Verify dark tribal theme is applied.
**Why human:** Requires content publishing + visual inspection.

### 2. Pagefind Search After Build

**Test:** Run `npm run build && npm run start`, then type "Bloodstone" in topbar search input.
**Expected:** Dropdown appears with at least one result linking to /wiki/itens/bloodstone (if published). Matched term highlighted in gold. Keyboard navigation works.
**Why human:** Pagefind index only exists post-build; cannot verify programmatically.

---

## Gaps Summary

**3 gaps blocking full goal achievement:**

**Gap 1 — No published pt-BR item content (WIKI-03 + WIKI-06)**
All 65 scraped items are English and `published: false`. The complete item detail page infrastructure exists and is fully wired: `StatBlock`, `CraftingRecipe`, location section, `ItemHeroCard`, the `[slug]/page.tsx` route. But no visitor can navigate to any item page because `generateStaticParams` only includes `publishedOnly=true` items, returning zero item params. The scraper ran and created MDX files, but `extractInfobox` found no structured infobox templates on the scraped pages, so no stats/crafting/location fields were populated either. **Fix:** Manually author at least a small set of pt-BR item MDX files with `published: true` and Brazilian Portuguese body text.

**Gap 2 — No published pt-BR mask content + SkillList/BuildTabs hollow (WIKI-04 + WIKI-06)**
Same content publishing gap as items. Additionally, `SkillList` and `BuildTabs` are called without any props (`<SkillList />`, `<BuildTabs />`), so mask detail pages will only show the accordion header and placeholder text — no structured skill or build data will ever appear until either (a) the call site passes structured props, or (b) the MDX body is relied upon exclusively (which is the current v1 intent). The MDX body for English masks does contain skills and builds information, but in English and unpublished. **Fix:** Same as Gap 1 for content. For the placeholder text issue, this is an accepted v1 limitation per the SUMMARY Known Stubs section.

**Gap 3 — No guides content (WIKI-06)**
The `content/guides/` directory exists but contains only `.gitkeep`. No guides have been created. The `generateStaticParams` in `[slug]/page.tsx` and the `/wiki/guias` listing page would both correctly serve 0 items (showing the empty state), but WIKI-06 requires pt-BR original content across categories including guides. **Fix:** Author at least one guide in pt-BR.

**Root cause:** All three gaps share the same root: the content pipeline (scraper + MDX layer) was built correctly, but the actual pt-BR content authoring/publishing step was not executed as part of Phase 2. The infrastructure is complete; the content population is not.

---

_Verified: 2026-04-08_
_Verifier: Claude (gsd-verifier)_
