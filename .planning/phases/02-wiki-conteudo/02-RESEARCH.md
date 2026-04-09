# Phase 2: Wiki & Conteudo — Research

**Researched:** 2026-04-08
**Domain:** Next.js 16 App Router + MDX file system + Pagefind search + Fandom MediaWiki API scraping
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Layout "card expansivo" — card grande no topo com stats + conteúdo abaixo em seções colapsáveis (não wiki-style com infobox lateral)
- **D-02:** Dados a mostrar: stats básicos (nome, categoria, imagem, descrição), receita de crafting (materiais necessários), localização (onde encontrar), uso/utilidade (para que serve, itens relacionados)
- **D-03:** Máscaras têm layout próprio — seções específicas para skills, builds e tier (diferente do template de itens)
- **D-04:** Visualização mista — grid de cards por padrão com opção de trocar para tabela
- **D-05:** Filtros: por subcategoria/tipo, busca inline rápida, e ordenação (nome, tipo)
- **D-06:** Paginação numérica (melhor para SEO) — não infinite scroll
- **D-07:** Re-scrape profundo — melhorar o scraper para extrair mais dados (stats, descrição, imagens, receitas) do Fandom
- **D-08:** Frontmatter expandido: adicionar campos `tags` (array) e `tier`/`difficulty` (string) além dos existentes (title, slug, category, gameVersion, sourceUrl, published)
- **D-09:** Patch notes em lista cronológica — mais recente primeiro
- **D-10:** Implementação de busca: Claude's Discretion (recomendar melhor opção para 75+ páginas MDX estáticas)
- **D-11:** Busca aparece apenas no topbar e hero banner — sem command palette ou página dedicada

### Claude's Discretion

- Escolha da biblioteca de busca (Pagefind, Fuse.js, ou outra — baseado na melhor opção para conteúdo MDX estático)
- Design exato dos cards de item na listagem
- Estrutura das seções colapsáveis na página de item
- Layout específico das páginas de máscara (quais seções de skills/builds)
- Estratégia de ISR/revalidação para páginas MDX
- Componentes MDX customizados (se necessários)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WIKI-01 | Usuário pode navegar pelo conteúdo organizado por categorias (itens/crafting, máscaras/skills, guias/tutoriais, patch notes) | Category listing pages with `generateStaticParams` reading MDX frontmatter; filter bar with subcategory tabs |
| WIKI-02 | Usuário pode buscar conteúdo por texto livre com resultados relevantes | Pagefind post-build index; client-side `SearchDropdown` attached to existing Topbar and HeroBanner inputs |
| WIKI-03 | Usuário pode acessar página individual de cada item com detalhes completos (stats, receitas, localização) | Dynamic route `/wiki/itens/[slug]`; MDX render with custom components; accordion sections; re-scraped frontmatter fields |
| WIKI-04 | Usuário pode acessar página individual de cada máscara com habilidades e builds | Dynamic route `/wiki/mascaras/[slug]`; mask-specific accordion layout with skills/builds/mimicry/nodes |
| WIKI-05 | Usuário pode ler patch notes e notícias traduzidas para pt-BR | `/wiki/patch-notes` listing + `/wiki/patch-notes/[slug]` individual pages; chronological sort; manual MDX content |
| WIKI-06 | Todo conteúdo é original em pt-BR (reescrito da wiki oficial, não copiado) | Enforced by `published: false` default in scraper; content body must be manually rewritten before publishing |
</phase_requirements>

---

## Summary

Phase 2 builds the complete wiki reading experience on top of the Phase 1 layout shell. The technical foundation is solid: Next.js 16 App Router with `@next/mdx` already configured, 75 MDX files in `content/` (65 items + 10 masks), `gray-matter` installed, and the scraper pipeline operational. The gaps are: no dynamic routes exist yet, no MDX rendering utilities for content pages, no search implementation, and MDX frontmatter lacks the fields (stats, crafting, tier, tags, images) required for rich item/mask pages.

The work divides into four clear tracks: (1) enhance the scraper to extract structured data into expanded frontmatter, (2) build the category listing pages with filter + pagination, (3) build the item and mask detail pages with accordion sections, and (4) implement Pagefind search wired to existing topbar and hero inputs. Patch notes require manual MDX authoring since Fandom has no structured patch history.

**Primary recommendation:** Use `gray-matter` + `fs/promises` to read MDX files at build time via `generateStaticParams`. Render MDX bodies with `@next/mdx` + a custom `mdx-components.tsx`. Index all published pages with Pagefind via a `postbuild` script. Keep all content `published: false` until manually reviewed and rewritten in pt-BR.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@next/mdx` | 16.2.3 | MDX rendering in Next.js App Router | Already installed; official plugin; supports RSC; handles `.mdx` page extensions |
| `gray-matter` | 4.0.3 | Parse MDX frontmatter into JS objects | Already installed; gold standard for YAML frontmatter; used in every Next.js MDX guide |
| `next` | 16.2.3 | App Router, `generateStaticParams`, ISR | Already installed |
| `lucide-react` | 1.7.0 | Icons across all UI | Already installed |
| `shadcn/ui` | 4.2.0 (cli) | `accordion`, `table`, `tabs`, `select`, `skeleton`, `tooltip`, `breadcrumb`, `pagination` | Already initialized; add new components with `npx shadcn@latest add` |

### New Dependencies for Phase 2

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `pagefind` | 1.4.0 (stable) | Static full-text search index built post-build | Zero runtime cost; pre-built binary; MDX pages are indexed as static HTML; best fit for 75-200 static pages; Nextra 4 uses it |
| `@pagefind/default-ui` | 1.4.0 | Optional UI kit (not used — custom `SearchDropdown` instead) | Skip — use raw `window.pagefind.search()` API for the custom dropdown |

**Why Pagefind over Fuse.js:**
- Pagefind: index built at build time, binary search index, sub-100ms queries, works offline, scales to 10k+ pages
- Fuse.js: loads ALL content into memory at runtime, slow on 75+ files, re-executes on every page load
- Decision confirmed in 02-UI-SPEC.md (already resolved as Claude's Discretion)

**Installation:**
```bash
npm install --save-dev pagefind
npx shadcn@latest add accordion table tabs select skeleton tooltip breadcrumb pagination
```

**Version verification (checked 2026-04-08):**
- `pagefind`: 1.4.0 is current stable (1.5.0-beta1 exists but not production-ready)
- `gray-matter`: 4.0.3 confirmed current
- `@next/mdx`: 16.2.3 (ships with Next.js)

---

## Architecture Patterns

### Recommended Route Structure

```
src/app/
├── wiki/
│   ├── [category]/
│   │   ├── page.tsx              # Category listing — /wiki/itens, /wiki/mascaras, /wiki/guias
│   │   └── [slug]/
│   │       └── page.tsx          # Item/mask detail — /wiki/itens/bloodstone
│   └── patch-notes/
│       ├── page.tsx              # Patch notes list
│       └── [slug]/
│           └── page.tsx          # Individual patch note
├── mdx-components.tsx            # REQUIRED by @next/mdx with App Router
src/lib/
├── content.ts                    # MDX file reading utilities (getAllItems, getItem, etc.)
src/components/
├── wiki/
│   ├── ItemCard.tsx              # Grid card component
│   ├── StatBlock.tsx             # Accordion stats section
│   ├── CraftingRecipe.tsx        # Horizontal ingredient list
│   ├── SkillList.tsx             # Mask skills list
│   ├── BuildTabs.tsx             # Mask builds tabs
│   ├── ViewToggle.tsx            # Grid/Table toggle
│   ├── FilterBar.tsx             # Sticky filter bar
│   └── SearchDropdown.tsx        # Pagefind results panel
```

### Pattern 1: MDX File System Reading (Content Layer)

**What:** Central utility module reads MDX files from `content/` using Node.js `fs/promises` + `gray-matter`. All build-time data fetching goes through this module.

**When to use:** Every category listing page and every detail page.

```typescript
// src/lib/content.ts
// Source: Next.js official docs + gray-matter docs pattern
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface ItemFrontmatter {
  title: string
  slug: string
  category: 'items' | 'masks' | 'guides' | 'patches'
  subcategory?: string
  gameVersion: string
  sourceUrl: string
  published: boolean
  // Phase 2 additions (D-08):
  tags?: string[]
  tier?: string
  difficulty?: string
  image?: string
  stats?: Record<string, string | number>
  crafting?: Array<{ item: string; quantity: number }>
  location?: string[]
}

export async function getAllContent(
  category: string,
  publishedOnly = true
): Promise<ItemFrontmatter[]> {
  const dir = path.join(CONTENT_DIR, category)
  let files: string[]
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const items = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), 'utf-8')
        const { data } = matter(raw)
        return data as ItemFrontmatter
      })
  )
  return publishedOnly ? items.filter((i) => i.published) : items
}

export async function getContentBySlug(
  category: string,
  slug: string
): Promise<{ frontmatter: ItemFrontmatter; content: string } | null> {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return { frontmatter: data as ItemFrontmatter, content }
  } catch {
    return null
  }
}
```

### Pattern 2: generateStaticParams for Dynamic Routes

**What:** Build-time static generation of all published item/mask pages.

**When to use:** `/wiki/[category]/[slug]/page.tsx` and all detail pages.

```typescript
// src/app/wiki/[category]/[slug]/page.tsx
// Source: Next.js docs — generateStaticParams
import { getAllContent, getContentBySlug } from '@/lib/content'
import { notFound } from 'next/navigation'

const CATEGORY_MAP: Record<string, string> = {
  itens: 'items',
  mascaras: 'masks',
  guias: 'guides',
}

export async function generateStaticParams() {
  const results = []
  for (const [urlSegment, fsDir] of Object.entries(CATEGORY_MAP)) {
    const items = await getAllContent(fsDir, true)
    for (const item of items) {
      results.push({ category: urlSegment, slug: item.slug })
    }
  }
  return results
}

export const dynamicParams = false // 404 for any slug not in generateStaticParams

export default async function ContentPage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const fsDir = CATEGORY_MAP[params.category]
  if (!fsDir) notFound()
  const data = await getContentBySlug(fsDir, params.slug)
  if (!data || !data.frontmatter.published) notFound()
  // render...
}
```

### Pattern 3: MDX Custom Components (mdx-components.tsx)

**What:** Required file for `@next/mdx` in App Router. Maps HTML elements to styled React components.

**Critical:** This file MUST exist at the project root or `src/` — without it, `@next/mdx` in App Router silently falls back to unstyled HTML.

```typescript
// src/mdx-components.tsx  (or project root mdx-components.tsx)
// Source: Next.js official docs file-conventions/mdx-components
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="font-cinzel text-2xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-inter text-base font-bold mt-6 mb-3 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-primary hover:underline transition-colors duration-150">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary bg-muted px-4 py-3 my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-muted text-sm px-1 rounded">{children}</code>
    ),
    ...components,
  }
}
```

### Pattern 4: Pagefind Integration

**What:** Post-build search index + client-side search dropdown wired to existing inputs.

**When to use:** After `next build` runs; client-side only, never SSR.

**Step 1 — postbuild script in package.json:**
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "pagefind --site .next --output-path .next/static/chunks/app/pagefind"
  }
}
```

**Step 2 — data-pagefind-body attribute on content pages:**
Add `data-pagefind-body` to the main content container of item/mask/patch pages. Add `data-pagefind-ignore` to topbar, sidebar, footer, and breadcrumbs so they don't pollute results.

**Step 3 — client-side search component:**
```typescript
// src/components/wiki/SearchDropdown.tsx
'use client'
// Source: petemillspaugh.com/nextjs-search-with-pagefind
declare global {
  interface Window {
    pagefind?: {
      search: (query: string) => Promise<{ results: PagefindResult[] }>
      debouncedSearch: (query: string) => Promise<{ results: PagefindResult[] } | null>
    }
  }
}

async function loadPagefind() {
  if (typeof window.pagefind === 'undefined') {
    try {
      window.pagefind = await import(
        /* webpackIgnore: true */ '/pagefind/pagefind.js'
      )
    } catch {
      // Dev mode fallback — index only exists after build
      window.pagefind = { search: async () => ({ results: [] }), debouncedSearch: async () => null }
    }
  }
}
```

**Dev mode note:** Pagefind index is generated only after `next build`. During `next dev`, the search returns empty results — this is expected behavior, not a bug.

### Pattern 5: Frontmatter Expansion (D-07, D-08)

**What:** Enhance `ScrapedContent` type and `writeMdx` to include new structured fields.

**New frontmatter fields to add:**

```yaml
# Existing fields (keep)
title: "Bloodstone"
slug: "bloodstone"
category: "items"
gameVersion: "unknown"
sourceUrl: "..."
published: false

# New fields (D-08)
tags: ["recurso", "mineral"]
tier: "comum"            # items: comum | incomum | raro | épico | lendário
difficulty: ""           # masks only: Iniciante | Intermediário | Avançado
image: ""                # URL or relative path to item image
subcategory: "recursos"  # items: armas | armaduras | recursos | alimentos | ferramentas
                         # masks: combate | suporte | exploração | iniciante

# Structured data (D-02 — extracted from wikitext)
stats:
  peso: "0.5"
  durabilidade: "—"
crafting:
  - item: "Iron Ore"
    quantity: 2
  - item: "Coal"
    quantity: 1
location:
  - "Holy Ruins (zona úmida)"
  - "Ancient Ruins Dungeon"
```

**Scraper extraction approach (D-07):** The Fandom MediaWiki API (`action=parse&prop=wikitext`) returns raw wikitext. The existing `wikitextToMarkdown` function strips templates. For Phase 2, extend parsing to extract infobox template parameters (stats, image, description) using regex on wikitext template syntax `{{Infobox|param=value}}` before converting body to markdown. The `location` field can often be extracted from a "Location" or "Found in" section heading in wikitext.

### Pattern 6: ISR Strategy (Claude's Discretion)

**What:** Since content is MDX files in git (not a database), ISR provides no benefit for day-to-day operation. New content only appears after a git push + Vercel deploy.

**Recommendation:** Use `export const revalidate = 86400` (24h) on all wiki pages as a safety net, but do not rely on ISR for content updates. Content publishing workflow is: re-scrape locally → edit MDX → set `published: true` → git push → Vercel redeploys.

```typescript
// At the top of any wiki page component:
export const revalidate = 86400 // 24 hours — safety net only
```

**Do NOT** set `revalidate = 0` (forces SSR — defeats static generation for 75+ pages). **Do NOT** use `force-dynamic` on wiki pages.

### Anti-Patterns to Avoid

- **Importing MDX files directly as modules:** Works for `@next/mdx` page routes (files at `app/.../*.mdx`) but is awkward for data-driven rendering. Use `gray-matter` + `fs` for the data layer, and `@next/mdx` for rendering the body. Mixing both patterns causes confusion.
- **Using `searchParams` on category listing pages:** `searchParams` (for sort/filter) disables static generation — the page becomes dynamic. Pass filter state via URL query params and handle client-side with `useSearchParams()` in a Client Component wrapper, keeping the page shell as a Server Component.
- **Running Pagefind during `next dev`:** The index only exists after `next build`. Always wrap the import in try-catch; provide a no-op fallback for dev mode.
- **Setting `dynamicParams = true` with no fallback:** If `published: false` items are not in `generateStaticParams`, accessing their URLs directly returns 500. Use `dynamicParams = false` to get a clean 404 instead.
- **Re-running the scraper without reviewing existing content:** The scraper overwrites existing MDX files. Add a `--skip-existing` flag or check file existence before writing to protect manually edited content.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-text search index | Custom inverted index | `pagefind` | Handles tokenization, stemming, ranking, multi-language; 5-line integration |
| Frontmatter parsing | Custom YAML regex parser | `gray-matter` | Handles edge cases, nested YAML, special characters; already installed |
| Accordion collapse animation | CSS transitions from scratch | `shadcn/ui accordion` (Radix `Collapsible`) | Handles `aria-expanded`, keyboard navigation, height animation |
| Pagination math | Custom page slice logic | `shadcn/ui pagination` + simple array slice | Shadcn handles ellipsis rendering; slice is just `items.slice((page-1)*perPage, page*perPage)` |
| MDX syntax highlighting | Prism/Shiki custom setup | Not needed for Phase 2 | Wiki content is prose + data, not code; no code blocks in game wiki content |
| wikitext-to-HTML conversion | Full MediaWiki parser | Regex + targeted extraction for known patterns | Full WikiText parsing is a 100KB library; Soulmask wiki uses a predictable subset of templates |

**Key insight:** The MDX pipeline (`@next/mdx` + `gray-matter` + `generateStaticParams`) is already half-assembled. Phase 2 completes the assembly — it does not introduce new paradigms.

---

## Common Pitfalls

### Pitfall 1: searchParams Breaks Static Generation on Category Pages

**What goes wrong:** Adding `searchParams` prop to a category listing page (for sort/filter URL state) causes Next.js to switch the page to dynamic rendering. The build succeeds but the page no longer generates static HTML — it server-renders on every request.

**Why it happens:** Next.js treats any use of `searchParams` in a Server Component as a dynamic signal.

**How to avoid:** Create a thin Client Component wrapper (`FilteredListing`) that uses `useSearchParams()`. The page component stays a Server Component that fetches all items and passes them to the Client Component. The filter/sort logic runs client-side on the already-fetched array.

**Warning signs:** `next build` output shows `ƒ (Dynamic)` instead of `○ (Static)` for `/wiki/itens`.

### Pitfall 2: MDX Rendering Without mdx-components.tsx

**What goes wrong:** `@next/mdx` in App Router renders MDX body without any custom styles because `mdx-components.tsx` is missing. All headings, links, and code blocks render as unstyled browser defaults.

**Why it happens:** `mdx-components.tsx` is a required convention file for App Router — unlike Pages Router where styles could be applied via CSS selectors. Without it, the MDX components mapping is undefined.

**How to avoid:** Create `src/mdx-components.tsx` (or root `mdx-components.tsx`) at project start as Wave 0. The file must export `useMDXComponents`.

**Warning signs:** MDX page renders but all text appears with no custom styling; `h2` is not Cinzel; links are default blue.

### Pitfall 3: Pagefind Index Missing in Production

**What goes wrong:** Search returns zero results in Vercel production even though it works locally after `next build`. The `postbuild` script runs but the index files are not served.

**Why it happens:** The `postbuild` output path must be inside `.next/static/` for Vercel to include it in the deployment. If the path is wrong (e.g., `./pagefind/` at root), the files are not included in the Vercel build output.

**How to avoid:** Set `--output-path .next/static/chunks/app/pagefind`. Verify in Vercel build logs that `pagefind` files appear in the static output.

**Warning signs:** Search works after local `npm run build && npm start` but fails on Vercel.

### Pitfall 4: Scraper Overwrites Manually Edited MDX

**What goes wrong:** Running `npm run scrape` after manually editing content MDX files (correcting translations, adding stats) silently overwrites those edits with the scraped version.

**Why it happens:** `writeMdx` uses `fs.writeFile` with no existence check — it always overwrites.

**How to avoid:** Add a `--skip-existing` CLI flag to the scraper. Before `fs.writeFile`, check if the file exists with `fs.access`; if it does and `--skip-existing` is set, skip it. The re-scrape deep pass (D-07) should run once before any manual editing begins.

**Warning signs:** Manually added `tags`, `tier`, or translated content disappears after a scrape run.

### Pitfall 5: Published Content Filter Not Applied

**What goes wrong:** Items with `published: false` appear in category listings or have accessible URLs. Visitors see stub pages with minimal or placeholder content.

**Why it happens:** Forgetting to filter `publishedOnly = true` in `getAllContent()`, or passing incorrect args.

**How to avoid:** The `getAllContent` utility defaults to `publishedOnly = true`. Always use the default. In `generateStaticParams`, only published items get static routes — so `dynamicParams = false` means `published: false` slugs return 404.

**Warning signs:** Pages like `/wiki/itens/unknown-item` return 200 with empty content instead of 404.

### Pitfall 6: Category URL Mismatch Between href and Route

**What goes wrong:** `CategoryCards.tsx` already links to `/wiki/itens` and `/wiki/mascaras`. If the dynamic route segment is named `[category]` but the file system directory is `items` (English), there's a mismatch between URL segment (`itens`) and the `content/items/` directory.

**Why it happens:** URL is Portuguese (`itens`, `mascaras`) but `content/` directories are English (`items`, `masks`).

**How to avoid:** Create a canonical mapping object `{ itens: 'items', mascaras: 'masks', guias: 'guides', 'patch-notes': 'patches' }` in `src/lib/content.ts` and use it everywhere. Patch notes route is `wiki/patch-notes` (separate from the `[category]` segment to avoid ambiguity).

---

## Code Examples

### Reading all published items for category listing

```typescript
// src/app/wiki/[category]/page.tsx
// Source: gray-matter + Node.js fs pattern
import { getAllContent, CATEGORY_URL_MAP } from '@/lib/content'
import { notFound } from 'next/navigation'

export const revalidate = 86400

export async function generateStaticParams() {
  return Object.keys(CATEGORY_URL_MAP).map((cat) => ({ category: cat }))
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const fsDir = CATEGORY_URL_MAP[params.category]
  if (!fsDir) notFound()
  const items = await getAllContent(fsDir, true) // publishedOnly = true
  // sort, pass to Client Component for filtering
  const sorted = items.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
  return <CategoryListing items={sorted} category={params.category} />
}
```

### Pagefind postbuild integration

```json
// package.json — add to scripts
{
  "scripts": {
    "build": "next build",
    "postbuild": "pagefind --site .next --output-path .next/static/chunks/app/pagefind"
  }
}
```

### Scraper: wikitext infobox field extraction

```typescript
// scripts/scraper/utils/wikitext-parser.ts
// Pattern: regex extraction of {{Infobox|field=value}} templates
export function extractInfoboxField(wikitext: string, field: string): string {
  // Matches: | field = value (with optional whitespace)
  const regex = new RegExp(`\\|\\s*${field}\\s*=\\s*([^|}\n]+)`, 'i')
  const match = wikitext.match(regex)
  return match ? match[1].trim() : ''
}

export function extractInfoboxImage(wikitext: string): string {
  const raw = extractInfoboxField(wikitext, 'image')
  if (!raw) return ''
  // Remove [[File:...]] wiki markup
  return raw.replace(/\[\[File:([^\]|]+)[^\]]*\]\]/i, '$1').trim()
}
```

### Patch notes chronological sort

```typescript
// src/app/wiki/patch-notes/page.tsx
// Patch notes sorted newest first (D-09) — by gameVersion string or date in frontmatter
const patches = await getAllContent('patches', true)
const sorted = patches.sort((a, b) => {
  // If patches have a `date` field: new Date(b.date) - new Date(a.date)
  // Fallback: lexicographic reverse on gameVersion
  return (b.gameVersion ?? '').localeCompare(a.gameVersion ?? '')
})
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router `getStaticProps` + `getStaticPaths` | App Router `generateStaticParams` + async Server Components | Next.js 13+ (stable 15+) | No `getStaticProps` pattern needed; data fetching is just `await` in the component |
| `next-mdx-remote` for dynamic MDX | `@next/mdx` with App Router + `mdx-components.tsx` | Next.js 13.4+ | `@next/mdx` is the official path; `next-mdx-remote` still works but adds runtime overhead |
| Fuse.js client-side search | Pagefind build-time index | Pagefind 1.0 (2023) | Pagefind is now the standard for static site search; Fuse.js has no build-time indexing |
| `revalidate` in `getStaticProps` | `export const revalidate = N` at module level | Next.js 13 App Router | Simple constant export; no function needed |

**Deprecated/outdated:**
- `next-mdx-remote`: still maintained but unnecessary when `@next/mdx` is already configured. Adding it would duplicate the MDX processing pipeline.
- `getStaticPaths` + `getStaticProps`: Pages Router patterns — do NOT use in this App Router project.
- `next/image` from `next` v12 patterns: Still valid, but use `unoptimized={true}` for external Fandom image URLs (external domains require `remotePatterns` config).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `fs/promises` content reading | ✓ | WSL Linux | — |
| `gray-matter` | Frontmatter parsing | ✓ | 4.0.3 (installed) | — |
| `@next/mdx` | MDX rendering | ✓ | 16.2.3 (installed) | — |
| `pagefind` CLI | Search index generation | ✗ | Not installed | `npm install --save-dev pagefind` — Wave 0 task |
| shadcn `accordion`, `table`, `tabs`, etc. | UI components | ✗ | Not installed | `npx shadcn@latest add accordion table tabs select skeleton tooltip breadcrumb pagination` |
| Fandom API | Re-scrape (D-07) | ✓ | Public API (no auth) | — |
| `next/image` `remotePatterns` | Fandom images | Configuration needed | — | Must add `fandom.com` to `remotePatterns` in `next.config.ts` |

**Missing dependencies with no fallback:**
- `pagefind` — must be installed before Wave 1 build tasks (WIKI-02)
- shadcn Phase 2 components — must be added before UI implementation begins

**Missing dependencies with fallback:**
- None that would block execution

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.3 + Testing Library |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |
| Setup file | `tests/setup.ts` (exists) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WIKI-01 | `getAllContent('items', true)` returns only published items | unit | `npm test -- tests/lib/content.test.ts` | ❌ Wave 0 |
| WIKI-01 | `CATEGORY_URL_MAP` maps all 4 URL segments to correct fs dirs | unit | `npm test -- tests/lib/content.test.ts` | ❌ Wave 0 |
| WIKI-02 | `SearchDropdown` renders no results state when query is empty | unit | `npm test -- tests/components/SearchDropdown.test.tsx` | ❌ Wave 0 |
| WIKI-03 | `getContentBySlug('items', 'bloodstone')` returns correct frontmatter | unit | `npm test -- tests/lib/content.test.ts` | ❌ Wave 0 |
| WIKI-03 | Item page returns 404 for `published: false` slug | manual smoke | `next build && next start` | — |
| WIKI-04 | Mask page renders skills section accordion | unit | `npm test -- tests/components/SkillList.test.tsx` | ❌ Wave 0 |
| WIKI-05 | Patch notes sorted newest-first (date or version descending) | unit | `npm test -- tests/lib/content.test.ts` | ❌ Wave 0 |
| WIKI-06 | Scraper always writes `published: false` (not overrideable) | unit | `npm test -- tests/scraper/mdx-writer.test.ts` | ❌ Wave 0 |

**Existing tests:** `tests/api/ping-servers.test.ts`, `tests/lib/supabase-client.test.ts` — no wiki-related tests exist.

### Sampling Rate

- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green + manual smoke test of at least one published item page and one mask page before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/lib/content.test.ts` — covers WIKI-01, WIKI-03, WIKI-05 (content utility functions)
- [ ] `tests/components/SearchDropdown.test.tsx` — covers WIKI-02 (empty state, result rendering)
- [ ] `tests/components/SkillList.test.tsx` — covers WIKI-04 (mask skill rendering)
- [ ] `tests/scraper/mdx-writer.test.ts` — covers WIKI-06 (`published: false` enforcement)
- [ ] Install pagefind: `npm install --save-dev pagefind`
- [ ] Add shadcn components: `npx shadcn@latest add accordion table tabs select skeleton tooltip breadcrumb pagination`
- [ ] Create `src/mdx-components.tsx` — required by `@next/mdx` App Router
- [ ] Add `remotePatterns` for Fandom CDN images in `next.config.ts`

---

## Project Constraints (from CLAUDE.md)

`CLAUDE.md` in the project root contains `@AGENTS.md` (delegation directive only — no coding conventions). No project-specific tool requirements, forbidden patterns, or security rules beyond the standard stack decisions already captured in `STATE.md`:

- Content MDX stored in git, not a CMS (D-04 from Phase 1 CONTEXT)
- All content requires manual review before publishing (`published: false` default enforced in scraper)
- Interface 100% in Portuguese Brazilian (UI-01)
- Conteúdo reescrito manualmente — no automated translation published (WIKI-06 + REQUIREMENTS.md Out of Scope)

---

## Open Questions

1. **Image hosting for item/mask images**
   - What we know: Fandom images are at `static.wikia.nocookie.net` — external domain requires `remotePatterns` in `next.config.ts`. `next/image` will not render them without this config.
   - What's unclear: Whether to re-host images in Supabase Storage or link directly to Fandom CDN. Direct Fandom CDN links work but may break if Fandom changes their CDN structure.
   - Recommendation: For v1, link directly to Fandom CDN (add `remotePatterns`). Migration to Supabase Storage is a Phase 3/maintenance concern.

2. **Patch notes source**
   - What we know: `content/patches/` is empty (0 files). Fandom wiki does not have structured patch notes — they link to Steam store page. The scraper `CATEGORY_MAPPINGS` does not include patches.
   - What's unclear: Whether patch notes will come from manual authoring, Soulmask's Steam news feed, or another source.
   - Recommendation: Manual MDX authoring for the first 3-5 patch notes to unblock WIKI-05. Future: Steam community RSS feed could be scraped with Cheerio.

3. **Subcategory data for items**
   - What we know: Fandom items belong to categories like "Weapons", "Armor", "Resources". The MediaWiki API `action=query&prop=categories` can return which categories an item belongs to.
   - What's unclear: Whether Fandom's category names map cleanly to the desired subcategories (armas, armaduras, recursos, etc.).
   - Recommendation: During re-scrape (D-07), also fetch `prop=categories` and map Fandom category names to Portuguese subcategory labels. Store as `subcategory` in frontmatter.

---

## Sources

### Primary (HIGH confidence)
- `package.json` (project) — verified installed dependencies and versions
- `scripts/scraper/fandom.ts` — verified current scraper capabilities (wikitext fetch, no structured data extraction yet)
- `scripts/scraper/utils/mdx-writer.ts` — verified current frontmatter schema
- `scripts/scraper/utils/types.ts` — verified `ScrapedContent` interface
- `content/items/bloodstone.mdx`, `content/masks/conquest.mdx` — verified existing MDX structure
- `src/app/layout.tsx` — verified layout shell (fonts, ThemeProvider, Sidebar/Topbar structure)
- `src/components/layout/Topbar.tsx` — verified existing search input (non-functional)
- `next.config.ts` — verified `@next/mdx` already configured with `pageExtensions`
- Next.js official docs (generateStaticParams, MDX guides) — HIGH

### Secondary (MEDIUM confidence)
- [Add search to your Next.js static site with Pagefind](https://www.petemillspaugh.com/nextjs-search-with-pagefind) — Pagefind integration pattern, postbuild script, webpackIgnore trick — verified against pagefind.app docs
- [pagefind npm](https://www.npmjs.com/package/pagefind) — version 1.4.0 confirmed stable
- [Next.js MDX Guides](https://nextjs.org/docs/app/guides/mdx) — mdx-components.tsx requirement confirmed
- [generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — confirmed `dynamicParams = false` behavior
- [MediaWiki API: Parsing wikitext](https://www.mediawiki.org/wiki/API:Parsing_wikitext) — infobox extraction approach

### Tertiary (LOW confidence — flag for validation)
- Fandom Portable Infobox API: access returned 403 — infobox field extraction via regex on wikitext is the verified fallback (Fandom API is underdocumented)
- Steam patch notes scraping: not researched — manual authoring recommended as first approach

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in package.json or npm registry
- Architecture patterns: HIGH — official Next.js docs + existing codebase verified
- Pagefind integration: MEDIUM-HIGH — verified via official docs + community guide; output path on Vercel needs validation at deploy time
- Scraper wikitext parsing: MEDIUM — regex approach is standard for MediaWiki; exact Soulmask infobox template names need validation during re-scrape
- Pitfalls: HIGH — searchParams static generation trap and mdx-components.tsx requirement are documented Next.js behaviors

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable ecosystem — Next.js + gray-matter + Pagefind are mature)
