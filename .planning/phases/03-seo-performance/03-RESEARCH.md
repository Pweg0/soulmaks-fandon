# Phase 3: SEO & Performance — Research

**Researched:** 2026-04-08
**Domain:** Next.js 16 App Router SEO — metadata API, sitemap, JSON-LD Schema.org, Core Web Vitals
**Confidence:** HIGH (primary sources: Next.js 16.2.3 bundled docs in node_modules, codebase inspection)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Titulo template: "SoulmaskBR | [Nome do Conteudo]" — marca primeiro, conteudo depois
- **D-02:** Open Graph tags completas em cada pagina: og:title, og:description, og:image — otimizado para compartilhamento no Discord, WhatsApp, etc.
- **D-03:** Tipos JSON-LD a implementar: VideoGame (homepage/site), HowTo (guias), FAQPage (se houver FAQ), BreadcrumbList (todas as paginas com breadcrumb)
- **D-04:** Escopo: JSON-LD em todas as paginas publicas, cada uma com o tipo apropriado ao conteudo
- **D-05:** Imagens otimizadas via next/image — lazy loading e otimizacao automatica do Next.js
- **D-06:** Fontes via next/font — fontes locais (Cinzel + Inter) com zero layout shift e subset automatico
- **D-07:** Bundle: confiar nas otimizacoes padrao do Next.js 16 (code splitting automatico, Turbopack), sem otimizacao manual extra

### Claude's Discretion

- Formato exato das meta descriptions por tipo de pagina
- Frequencia de revalidacao do sitemap
- Estrategia de og:image (estatica vs dinamica)
- Detalhes do JSON-LD por tipo de conteudo (campos especificos)
- Robots.txt configuracao

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Cada pagina tem meta title, description e canonical URL unicos e otimizados para pt-BR | Next.js `generateMetadata` + `metadataBase` + title template in root layout |
| SEO-02 | Sitemap.xml gerado automaticamente com todas as paginas | `app/sitemap.ts` convention with `MetadataRoute.Sitemap` type — reads MDX content at build time |
| SEO-03 | Schema.org JSON-LD em paginas relevantes (VideoGame, HowTo, FAQPage, BreadcrumbList) | Inline `<script type="application/ld+json">` in Server Components — no library needed |
| SEO-04 | Design responsivo mobile-first com boa performance (Core Web Vitals) | `next/font` already in place, `next/image` for images, static site generation (ISR) already active |
</phase_requirements>

---

## Summary

Phase 3 is a focused SEO augmentation on an already well-structured Next.js 16 App Router codebase. Phases 1 and 2 built the foundation correctly: static generation with ISR (`revalidate=86400`), App Router file conventions, and server components throughout. The SEO layer adds metadata objects/functions, sitemap/robots files, and inline JSON-LD scripts — none of which require new dependencies.

**Critically:** The additional context in CONTEXT.md says "fontes via next/font — fontes locais (Cinzel + Inter)". Inspecting `src/app/layout.tsx` shows fonts are already loaded via `next/font/google` (NOT Google Fonts CDN) — `Inter` and `Cinzel` use `next/font/google` with `display: swap` and proper CSS variables. D-06 is already done. The planner should NOT create a font migration task.

**Primary recommendation:** Add `generateMetadata` exports to each page type, create `app/sitemap.ts` using existing `getAllContent()`, create `app/robots.ts`, inject JSON-LD as server-side `<script>` tags, and verify Core Web Vitals with PageSpeed Insights. No new npm packages required.

---

## Project Constraints (from CLAUDE.md → AGENTS.md)

CLAUDE.md defers to AGENTS.md, which contains:

> "This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."

**Directives enforced in this research:**
- All Next.js API patterns verified against `node_modules/next/dist/docs/01-app/` (v16.2.3)
- `params` in dynamic routes is a `Promise<{...}>` — must be `await`-ed (confirmed in existing page files)
- `generateMetadata` function signature: `async function generateMetadata({ params, searchParams }, parent): Promise<Metadata>` — `params` is a Promise
- `sitemap.(js|ts)` is cached by default unless dynamic config is used
- File-based metadata (sitemap.ts, robots.ts) has higher priority than metadata object

---

## Standard Stack

### Core — Already Installed

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.3 | Framework — provides metadata API, sitemap/robots file conventions | Locked project choice |
| next/font/google | (bundled) | Font loading with zero layout shift, automatic subsetting | Already configured in layout.tsx |
| next/image | (bundled) | Automatic image optimization, WebP conversion, lazy loading | Locked in D-05 |

### No New Dependencies Required

All SEO requirements are satisfied by Next.js built-ins:
- `generateMetadata` / `export const metadata` — meta tags, Open Graph, canonical URLs
- `app/sitemap.ts` file convention — auto-generates `/sitemap.xml`
- `app/robots.ts` file convention — auto-generates `/robots.txt`
- Inline `<script type="application/ld+json">` in Server Components — JSON-LD (no schema library needed)

**Installation:** Nothing to install. All tooling is present.

---

## Architecture Patterns

### Recommended Project Structure (additions for Phase 3)

```
src/app/
├── sitemap.ts               # NEW — MetadataRoute.Sitemap, reads all published MDX
├── robots.ts                # NEW — MetadataRoute.Robots
├── layout.tsx               # MODIFY — add metadataBase, title template, OG defaults
├── page.tsx                 # MODIFY — add metadata export (VideoGame JSON-LD)
├── wiki/
│   ├── [category]/
│   │   ├── page.tsx         # MODIFY — add generateMetadata
│   │   └── [slug]/
│   │       └── page.tsx     # MODIFY — add generateMetadata + JSON-LD (HowTo/BreadcrumbList)
│   └── patch-notes/
│       ├── page.tsx         # MODIFY — add metadata export
│       └── [slug]/
│           └── page.tsx     # MODIFY — add generateMetadata + JSON-LD
src/lib/
└── jsonld.ts                # NEW — helper functions returning JSON-LD objects by schema type
```

### Pattern 1: Title Template via Root Layout

Set once in `app/layout.tsx`, all child pages inherit automatically. Child pages export only the variable part.

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://soulmaskbr.com'),
  title: {
    template: 'SoulmaskBR | %s',
    default: 'SoulmaskBR — Guia & Server List',
  },
  description: 'O guia completo de Soulmask em português — itens, máscaras, guias e patch notes',
}
```

Child page:
```typescript
// app/wiki/[category]/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const data = await getContentBySlug(CATEGORY_MAP[category], slug)
  return {
    title: data.frontmatter.title,           // renders: "SoulmaskBR | [title]"
    description: buildDescription(data),
    alternates: { canonical: `/wiki/${category}/${slug}` },
    openGraph: {
      title: data.frontmatter.title,
      description: buildDescription(data),
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
      type: 'article',
    },
  }
}
```

**Key detail for this project:** D-01 says "marca primeiro, conteudo depois" — but `title.template` outputs `%s | SoulmaskBR` format. To get "SoulmaskBR | [Nome]", the template must be `'SoulmaskBR | %s'` and child pages set `title: frontmatter.title`.

### Pattern 2: Sitemap via app/sitemap.ts

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllContent } from '@/lib/content'
import { CATEGORY_MAP } from '@/types/content'

const BASE_URL = 'https://soulmaskbr.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/wiki`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/wiki/patch-notes`, changeFrequency: 'weekly', priority: 0.8 },
    ...Object.keys(CATEGORY_MAP).map(cat => ({
      url: `${BASE_URL}/wiki/${cat}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  const contentRoutes: MetadataRoute.Sitemap = []
  for (const [urlSegment, fsDir] of Object.entries(CATEGORY_MAP)) {
    const items = await getAllContent(fsDir, true) // true = published only
    for (const item of items) {
      contentRoutes.push({
        url: `${BASE_URL}/wiki/${urlSegment}/${item.slug}`,
        lastModified: item.frontmatter.lastScrapedAt
          ? new Date(item.frontmatter.lastScrapedAt)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // Patch notes from dedicated directory
  const patches = await getAllContent('patches', true)
  for (const patch of patches) {
    contentRoutes.push({
      url: `${BASE_URL}/wiki/patch-notes/${patch.slug}`,
      lastModified: patch.frontmatter.date
        ? new Date(patch.frontmatter.date + 'T00:00:00')
        : new Date(),
      changeFrequency: 'never',
      priority: 0.6,
    })
  }

  return [...staticRoutes, ...contentRoutes]
}
```

**Important:** `sitemap.ts` is cached at build time by default (ISR). Since wiki content is also ISR (`revalidate=86400`), this is consistent. The sitemap will re-generate when the page is re-validated.

### Pattern 3: JSON-LD Injection (Server Component inline script)

No library required. Inject as a `<script>` Server Component:

```typescript
// src/lib/jsonld.ts — helper functions

export function videoGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Soulmask',
    description: 'Survival game with mask-based abilities by Qooland Games',
    genre: ['Survival', 'Open World', 'Action RPG'],
    gamePlatform: ['PC', 'Steam'],
    url: 'https://soulmaskbr.com',
    inLanguage: 'pt-BR',
    publisher: { '@type': 'Organization', name: 'Qooland Games' },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function howToSchema(title: string, description: string, steps: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }
}
```

In the page component (Server Component):
```typescript
// app/wiki/[category]/[slug]/page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([...])) }}
/>
```

**Why `dangerouslySetInnerHTML`:** React does not render `<script>` tag children as raw text; `dangerouslySetInnerHTML` is the correct and standard pattern for JSON-LD in React. Content is server-generated (not user input), so XSS is not a concern here.

### Pattern 4: Robots.txt via app/robots.ts

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://soulmaskbr.com/sitemap.xml',
  }
}
```

### Pattern 5: Open Graph Static Image (Discretion decision)

Recommendation: use a **single static og:image** (`/public/og-default.png`, 1200x630px) for all pages in v1. Rationale:
- Dynamic OG image generation (via `ImageResponse`) requires runtime compute on every share, adds complexity.
- A well-designed static image with the game logo and "SoulmaskBR" branding is sufficient for Discord/WhatsApp previews.
- Dynamic per-page images can be added post-launch if engagement data justifies the effort.
- The image file must be created as part of this phase (currently `public/` only has default Next.js SVGs).

### Anti-Patterns to Avoid

- **Template direction error:** Using `'%s | SoulmaskBR'` produces "Item | SoulmaskBR" — D-01 requires "SoulmaskBR | Item". Use `'SoulmaskBR | %s'`.
- **Missing `await params`:** In Next.js 16, `params` in `generateMetadata` is a Promise. Accessing `params.slug` without `await` silently returns undefined. All existing page files correctly `await params` — keep this pattern.
- **Calling `getAllContent` with `published=false` in sitemap:** This would include draft/unpublished pages in the sitemap, causing Google to crawl empty or noindex pages. Always pass `published=true` (second argument `true`) to `getAllContent`.
- **Setting `canonical` via `metadataBase` only:** `metadataBase` resolves relative URLs but does NOT auto-generate canonical tags. Each page's `generateMetadata` must explicitly set `alternates.canonical`.
- **JSON-LD in `<head>` vs `<body>`:** Both positions are valid per Google; in Next.js App Router, placing `<script type="application/ld+json">` inside the JSX of the page component renders it in `<body>`, which Google supports fully.
- **Duplicate routes for patch-notes:** `/wiki/patch-notes/[slug]` is a separate route from `/wiki/[category]/[slug]`. The sitemap must enumerate patches separately from `CATEGORY_MAP` iteration (patches live in `content/patches/`, not routed via `[category]`).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | Custom route handler writing XML strings | `app/sitemap.ts` with `MetadataRoute.Sitemap` | Next.js handles caching, XML encoding, content-type header |
| robots.txt | Static file or string concatenation | `app/robots.ts` with `MetadataRoute.Robots` | Type-safe, handles multiple user agents, auto-serves at `/robots.txt` |
| Meta tag injection | Manual `<head>` manipulation | `export const metadata` / `generateMetadata` | Next.js deduplicates, handles inheritance, merges OG fields |
| JSON-LD schema library | `schema-dts` or `react-schemaorg` | Plain TypeScript object + `dangerouslySetInnerHTML` | Zero additional dependency, full control, server-side only |
| Font loading | Google Fonts `<link>` CDN tag | `next/font/google` (already done) | Self-hosts fonts, eliminates layout shift, subset automatically |

**Key insight:** All SEO infrastructure in Next.js App Router is file-convention-based. The planner should not create tasks that build custom solutions for any of the above — Next.js provides first-class primitives for all of them.

---

## Common Pitfalls

### Pitfall 1: params Not Awaited in generateMetadata

**What goes wrong:** `generateMetadata` in Next.js 16 receives `params` as a Promise. Accessing `params.slug` without `await` returns undefined silently during build, generating empty metadata for all dynamic pages.

**Why it happens:** Next.js 15+ changed params to be async. Training data and many examples show synchronous destructuring.

**How to avoid:** Always: `const { category, slug } = await params` — the pattern already used in all existing page files.

**Warning signs:** Meta titles appear as "SoulmaskBR | undefined" in generated HTML.

### Pitfall 2: og:image Requires Absolute URL

**What goes wrong:** Setting `openGraph: { images: ['/og-default.png'] }` without `metadataBase` configured results in a relative URL in the meta tag, which Discord/WhatsApp cannot resolve.

**Why it happens:** OG crawlers don't follow relative URLs.

**How to avoid:** Set `metadataBase: new URL('https://soulmaskbr.com')` in root `layout.tsx`. Then relative paths like `/og-default.png` are resolved correctly. Verified in Next.js 16 docs: "Using a relative path in a URL-based metadata field without configuring a metadataBase will cause a build error."

**Warning signs:** Discord shows no preview image when sharing links.

### Pitfall 3: Sitemap Includes Unpublished Content

**What goes wrong:** `getAllContent(dir, false)` (second arg = false) returns all items including `published: false`. If sitemap uses this, Google crawls URLs that return 404.

**Why it happens:** Forgetting that `getAllContent` has a `published` filter argument.

**How to avoid:** Always call `getAllContent(dir, true)` in `sitemap.ts`.

**Warning signs:** Sitemap has more entries than actually accessible pages.

### Pitfall 4: Missing Canonical on Category Pages With Pagination

**What goes wrong:** `/wiki/patch-notes?page=2` would be indexed as a separate page competing with `/wiki/patch-notes` for the same content. Without `canonical`, Google may demote both.

**Why it happens:** Paginated listing pages share the same h1 and similar content.

**How to avoid:** Set `alternates.canonical: '/wiki/patch-notes'` on the patch-notes listing (it uses `searchParams` for pagination — the canonical should always point to the first page).

**Warning signs:** Google Search Console showing duplicate content warnings for paginated routes.

### Pitfall 5: HowTo Schema on Non-Guide Pages

**What goes wrong:** Applying `HowTo` schema to item pages or mask pages (which are reference pages, not procedural guides) causes Google Rich Results Test to flag invalid schema — `HowTo` requires `step` array with actionable steps.

**Why it happens:** Confusion between "content about game mechanics" and "procedural how-to guide."

**How to avoid:** Apply schema types strictly:
- Homepage: `VideoGame`
- Category pages: no structured data (or `CollectionPage` if desired, but not required)
- Guide pages (`/wiki/guias/[slug]`): `HowTo` only if content describes steps; otherwise `Article`
- Item/mask pages: `BreadcrumbList` only (no `HowTo`)
- Patch notes: `NewsArticle` or just `BreadcrumbList`

**Warning signs:** Google Rich Results Test returns "Warning: Field 'step' is recommended."

### Pitfall 6: Font Migration Is Already Done

**What goes wrong:** Planning a task to "migrate Google Fonts CDN to next/font" when it was already done in Phase 1.

**Why it happens:** CONTEXT.md says "fontes carregadas via layout.tsx (atualmente Google Fonts CDN — needs migration to next/font)" — this was the state at discussion time, but the implemented `layout.tsx` already uses `next/font/google` with `display: swap` and CSS variables.

**How to avoid:** The planner must NOT create a font migration task. The layout already uses `next/font/google` correctly. D-06 is already satisfied.

**Warning signs:** A plan task saying "replace Google Fonts link with next/font."

---

## Code Examples

### generateMetadata for slug pages (canonical + OG pattern)

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
// app/wiki/[category]/[slug]/page.tsx
type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  if (!CATEGORY_MAP[category]) return {}
  const data = await getContentBySlug(CATEGORY_MAP[category], slug)
  if (!data || !data.frontmatter.published) return {}

  const { frontmatter } = data
  const description = frontmatter.tags?.length
    ? `${frontmatter.title} — ${frontmatter.tags.slice(0, 3).join(', ')} | Soulmask em pt-BR`
    : `Guia completo sobre ${frontmatter.title} no Soulmask. Dicas, stats e estratégias em português.`

  return {
    title: frontmatter.title,
    description,
    alternates: {
      canonical: `/wiki/${category}/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description,
      type: 'article',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: `${frontmatter.title} - SoulmaskBR` }],
    },
  }
}
```

### Metadata description templates (Claude's Discretion)

| Page Type | Description Template |
|-----------|---------------------|
| Item page | `"[Title] — stats, receita de crafting e localização no Soulmask. Guia em português."` |
| Mask page | `"Máscara [Title] no Soulmask — habilidades, builds recomendados e dicas. Guia pt-BR."` |
| Guide page | `"[Title] — guia completo para jogadores de Soulmask em português."` |
| Category page | Use existing `CATEGORY_SUBTITLES` values already in `[category]/page.tsx` |
| Patch note | `"Patch [version] do Soulmask — notas de atualização traduzidas para português."` |
| Homepage | `"O guia completo de Soulmask em português — itens, máscaras, guias e patch notes."` |

### BreadcrumbList JSON-LD matching existing HTML breadcrumbs

The breadcrumb HTML component is already in all pages. JSON-LD must mirror it:

```typescript
// For /wiki/mascaras/galewind-mask
breadcrumbSchema([
  { name: 'Início', url: 'https://soulmaskbr.com' },
  { name: 'Wiki', url: 'https://soulmaskbr.com/wiki' },
  { name: 'Máscaras & Skills', url: 'https://soulmaskbr.com/wiki/mascaras' },
  { name: frontmatter.title, url: `https://soulmaskbr.com/wiki/mascaras/${slug}` },
])
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` for meta tags | `export const metadata` / `generateMetadata` | Next.js 13 (App Router) | Fully server-side, no hydration issues |
| `pages/_document.js` for robots/sitemap | `app/sitemap.ts`, `app/robots.ts` file conventions | Next.js 13.3 | Zero-config, type-safe, cached by default |
| react-helmet for JSON-LD | Inline `<script>` in Server Components | React 18 / Next.js 13 | No client-side overhead |
| Google Fonts `<link>` tag | `next/font/google` | Next.js 13 | Eliminates layout shift, self-hosts fonts |

**Already current in this project:**
- `next/font/google` — already using it (layout.tsx)
- App Router metadata API — already have basic `export const metadata` in layout.tsx
- ISR with `revalidate=86400` — already on all wiki pages
- Static generation with `generateStaticParams` — already on all slug pages

---

## Environment Availability Audit

Step 2.6: SEO phase is code/config-only changes — new files in `src/app/` and modifications to existing page files. No external services, CLIs, or runtimes beyond what is already installed.

**External dependencies for Phase 3:**
- Next.js 16.2.3 — installed, verified
- `getAllContent()` utility — exists at `src/lib/content.ts`
- `CATEGORY_MAP` / `CATEGORY_LABELS` — exists at `src/types/content.ts`
- Static image for OG (`/public/og-default.png`) — NOT YET CREATED — must be created during this phase

**Missing with no fallback:**
- `/public/og-default.png` — 1200x630px OG image. Required for og:image meta tags. Must be created or sourced during the phase. Fallback: set `og:image` to omit until image is ready, but this means no Discord/WhatsApp previews (unacceptable for D-02).

**Verification tool — PageSpeed Insights:**
- Available at: https://pagespeed.web.dev/
- Requires the site to be publicly deployed (on Vercel) before running
- Cannot be checked in CI/CD locally — manual verification step required post-deploy

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.3 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Meta title follows template "SoulmaskBR \| X" on all page types | unit | `npm test -- tests/seo/metadata.test.ts` | ❌ Wave 0 |
| SEO-01 | Canonical URL matches page URL | unit | `npm test -- tests/seo/metadata.test.ts` | ❌ Wave 0 |
| SEO-01 | OG tags present and non-empty on slug pages | unit | `npm test -- tests/seo/metadata.test.ts` | ❌ Wave 0 |
| SEO-02 | Sitemap includes all published pages | unit | `npm test -- tests/seo/sitemap.test.ts` | ❌ Wave 0 |
| SEO-02 | Sitemap excludes unpublished pages | unit | `npm test -- tests/seo/sitemap.test.ts` | ❌ Wave 0 |
| SEO-03 | JSON-LD VideoGame schema on homepage has required fields | unit | `npm test -- tests/seo/jsonld.test.ts` | ❌ Wave 0 |
| SEO-03 | JSON-LD BreadcrumbList has correct item count for slug pages | unit | `npm test -- tests/seo/jsonld.test.ts` | ❌ Wave 0 |
| SEO-04 | Core Web Vitals green on Mobile | manual | PageSpeed Insights post-deploy | manual-only |

**SEO-04 justification for manual-only:** Core Web Vitals require a real browser rendering a deployed URL. No automated Vitest test can replicate PageSpeed Insights mobile simulation. This is a post-deploy verification step.

### Sampling Rate

- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green + PageSpeed Insights Mobile green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/seo/metadata.test.ts` — covers SEO-01 (generateMetadata output by page type)
- [ ] `tests/seo/sitemap.test.ts` — covers SEO-02 (sitemap completeness and exclusion logic)
- [ ] `tests/seo/jsonld.test.ts` — covers SEO-03 (JSON-LD schema shape validation)

---

## Open Questions

1. **og:image content — what image to use**
   - What we know: D-02 requires og:image on every page. A static fallback at `/og-default.png` (1200x630) is the recommended approach.
   - What's unclear: No branded game image exists in the project yet. Who creates it?
   - Recommendation: Include a plan task to create a minimal branded 1200x630px PNG (can use a dark background + "SoulmaskBR" text in Cinzel font style — even a simple SVG-to-PNG conversion works). Dynamic generation via `ImageResponse` is deferred per D-07.

2. **NEXT_PUBLIC_SITE_URL env var vs hardcoded URL**
   - What we know: `metadataBase` and sitemap both need the production URL `https://soulmaskbr.com`. The domain may not be finalized.
   - What's unclear: Is the production domain confirmed?
   - Recommendation: Use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'` in `sitemap.ts` and root `layout.tsx`. Document in `.env.example`.

3. **HowTo vs Article for guide pages**
   - What we know: D-03 specifies HowTo for guides. HowTo requires enumerable `step` items.
   - What's unclear: MDX guide content is free-form prose — may not have machine-readable steps.
   - Recommendation: Apply `HowTo` schema only to guides whose MDX body contains numbered steps. Fallback to `Article` schema for narrative guides. The `category === 'guias'` check is not sufficient — JSON-LD type selection should be a per-page frontmatter flag (`schemaType?: 'HowTo' | 'Article'`) or inferred from the presence of ordered list content. Simplest v1 approach: default all guides to `Article` schema (Google will still index them), and add `HowTo` to guides that explicitly contain steps.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — generateMetadata API, params as Promise, Metadata fields, openGraph, metadataBase
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — sitemap.ts convention, MetadataRoute.Sitemap type, v16 id-as-Promise change
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` — robots.ts convention, MetadataRoute.Robots type
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/index.md` — file-based metadata priority rules
- `src/app/layout.tsx` — confirmed next/font/google already in use (D-06 already done)
- `src/app/wiki/[category]/[slug]/page.tsx` — confirmed params-as-Promise pattern, breadcrumb structure
- `src/types/content.ts` — CATEGORY_MAP, frontmatter fields available for metadata generation
- `.planning/research/PITFALLS.md` — Pitfall 8 (schema markup) and Pitfall 2 (duplicate content) directly relevant

### Secondary (MEDIUM confidence)
- CONTEXT.md D-01 through D-07 — locked decisions verified against codebase state

### Tertiary (LOW confidence)
- None — all findings sourced from the installed Next.js docs or direct codebase inspection.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against installed Next.js 16.2.3 node_modules docs
- Architecture: HIGH — patterns from official bundled docs + codebase inspection
- Pitfalls: HIGH — derived from actual API behavior in Next.js 16 and codebase review

**Research date:** 2026-04-08
**Valid until:** 2026-06-08 (Next.js minor updates unlikely to change these stable APIs)
