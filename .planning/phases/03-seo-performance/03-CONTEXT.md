# Phase 3: SEO & Performance - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Cada página do site é indexável de forma ótima por buscadores brasileiros e carrega rapidamente em dispositivos móveis. Inclui meta tags únicas, sitemap automático, Schema.org JSON-LD, e otimização de Core Web Vitals.

</domain>

<decisions>
## Implementation Decisions

### Meta Tags
- **D-01:** Template de título: "SoulmaskBR | [Nome do Conteúdo]" — marca primeiro, conteúdo depois
- **D-02:** Open Graph tags completas em cada página: og:title, og:description, og:image — otimizado para compartilhamento no Discord, WhatsApp, etc.

### Schema.org JSON-LD
- **D-03:** Tipos a implementar: VideoGame (homepage/site), HowTo (guias), FAQPage (se houver FAQ), BreadcrumbList (todas as páginas com breadcrumb)
- **D-04:** Escopo: JSON-LD em todas as páginas públicas, cada uma com o tipo apropriado ao conteúdo

### Performance
- **D-05:** Imagens otimizadas via next/image — lazy loading e otimização automática do Next.js
- **D-06:** Fontes via next/font — fontes locais (Cinzel + Inter) com zero layout shift e subset automático
- **D-07:** Bundle: confiar nas otimizações padrão do Next.js 16 (code splitting automático, Turbopack), sem otimização manual extra

### Claude's Discretion
- Formato exato das meta descriptions por tipo de página
- Frequência de revalidação do sitemap
- Estratégia de og:image (estática vs dinâmica)
- Detalhes do JSON-LD por tipo de conteúdo (campos específicos)
- Robots.txt configuração

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project vision, constraints
- `.planning/REQUIREMENTS.md` — SEO-01 through SEO-04 requirements
- `.planning/ROADMAP.md` — Phase 3 success criteria

### Prior Phase Decisions
- `.planning/phases/01-fundacao/01-CONTEXT.md` — Theme decisions, layout structure
- `.planning/phases/01-fundacao/01-UI-SPEC.md` — Design tokens (fonts, colors)
- `.planning/phases/02-wiki-conteudo/02-CONTEXT.md` — Content structure, page types

### Research
- `.planning/research/PITFALLS.md` — SEO pitfalls for gaming content in pt-BR
- `.planning/research/FEATURES.md` — SEO as table stakes feature

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/layout.tsx` — Root layout where metadata and fonts are configured
- `src/app/wiki/[category]/page.tsx` — Category pages with generateStaticParams
- `src/app/wiki/[category]/[slug]/page.tsx` — Detail pages with generateStaticParams
- `src/app/wiki/patch-notes/page.tsx` — Patch notes listing
- Breadcrumb component already imported and used in all wiki pages

### Established Patterns
- Next.js App Router metadata API (export const metadata / generateMetadata)
- ISR with revalidate=86400 on wiki pages
- MDX frontmatter has: title, slug, category, tags, tier

### Integration Points
- Each page type needs its own generateMetadata function
- Sitemap at /sitemap.xml via Next.js sitemap convention
- Robots.txt at /robots.txt
- JSON-LD injected as <script type="application/ld+json"> in page components

</code_context>

<specifics>
## Specific Ideas

- Títulos em formato "SoulmaskBR | [Item]" para branding consistente no Google
- OG tags completas para que links compartilhados no Discord/WhatsApp mostrem preview rico
- Schema.org BreadcrumbList em todas as páginas porque breadcrumbs já existem no HTML

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-seo-performance*
*Context gathered: 2026-04-09*
