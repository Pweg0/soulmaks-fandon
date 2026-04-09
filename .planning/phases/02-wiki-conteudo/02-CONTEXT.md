# Phase 2: Wiki & Conteudo - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitante encontra e lê todo o conteúdo do jogo em português — categorias, itens, máscaras, guias e patch notes. Inclui rotas dinâmicas, páginas de listagem com filtros, páginas individuais de itens/máscaras, busca full-text, e seção de patch notes. Conteúdo MDX precisa ser populado com dados reais.

</domain>

<decisions>
## Implementation Decisions

### Páginas de Item
- **D-01:** Layout "card expansivo" — card grande no topo com stats + conteúdo abaixo em seções colapsáveis (não wiki-style com infobox lateral)
- **D-02:** Dados a mostrar: stats básicos (nome, categoria, imagem, descrição), receita de crafting (materiais necessários), localização (onde encontrar), uso/utilidade (para que serve, itens relacionados)
- **D-03:** Máscaras têm layout próprio — seções específicas para skills, builds e tier (diferente do template de itens)

### Listagem / Categorias
- **D-04:** Visualização mista — grid de cards por padrão com opção de trocar para tabela
- **D-05:** Filtros: por subcategoria/tipo, busca inline rápida, e ordenação (nome, tipo)
- **D-06:** Paginação numérica (melhor para SEO) — não infinite scroll

### Conteúdo MDX
- **D-07:** Re-scrape profundo — melhorar o scraper para extrair mais dados (stats, descrição, imagens, receitas) do Fandom
- **D-08:** Frontmatter expandido: adicionar campos `tags` (array) e `tier`/`difficulty` (string) além dos existentes (title, slug, category, gameVersion, sourceUrl, published)
- **D-09:** Patch notes em lista cronológica — mais recente primeiro

### Busca
- **D-10:** Implementação de busca: Claude's Discretion (recomendar melhor opção para 75+ páginas MDX estáticas)
- **D-11:** Busca aparece apenas no topbar e hero banner — sem command palette ou página dedicada

### Claude's Discretion
- Escolha da biblioteca de busca (Pagefind, Fuse.js, ou outra — baseado na melhor opção para conteúdo MDX estático)
- Design exato dos cards de item na listagem
- Estrutura das seções colapsáveis na página de item
- Layout específico das páginas de máscara (quais seções de skills/builds)
- Estratégia de ISR/revalidação para páginas MDX
- Componentes MDX customizados (se necessários)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project vision, core value, constraints
- `.planning/REQUIREMENTS.md` — WIKI-01 through WIKI-06 requirements
- `.planning/ROADMAP.md` — Phase 2 success criteria

### Phase 1 Decisions (carry forward)
- `.planning/phases/01-fundacao/01-CONTEXT.md` — D-04 (MDX in git), D-09 (AI translation flow), D-10 (sidebar+topbar), tema visual decisions
- `.planning/phases/01-fundacao/01-UI-SPEC.md` — Design system tokens, typography, color, spacing

### Research
- `.planning/research/STACK.md` — Technology stack (Next.js 16, Supabase, Tailwind v4)
- `.planning/research/FEATURES.md` — Feature landscape and priorities
- `.planning/research/PITFALLS.md` — SEO and content pitfalls

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/Topbar.tsx` — Has search input (placeholder, currently non-functional)
- `src/components/layout/Sidebar.tsx` — 4 nav links (Wiki, Servidores, Guias, Patch Notes)
- `src/components/home/CategoryCards.tsx` — 4 category cards linking to category pages
- `src/components/home/HeroBanner.tsx` — Has search input (currently non-functional)
- `src/app/globals.css` — Dark tribal theme CSS variables already set

### Established Patterns
- MDX files in `content/{category}/` with frontmatter schema: title, slug, category, gameVersion, sourceUrl, published
- Scraper pipeline at `scripts/scraper/` — can be enhanced for deeper scraping
- Dark tribal theme: near-black background, gold (#c9973a) accents, Cinzel headings, Inter body

### Integration Points
- 75 MDX files already in content/ (65 items + 10 masks) — all `published: false`, bodies mostly empty
- Sidebar nav links need to route to actual category pages
- Topbar/hero search inputs need to connect to search implementation
- `scripts/translate/WORKFLOW.md` — AI draft + manual review pipeline documented

</code_context>

<specifics>
## Specific Ideas

- Cards expansivos para itens — inspirados em wikis de jogos modernos (não o estilo wiki.gg/Fandom)
- Máscaras merecem layout diferenciado por causa das habilidades e builds
- Grid + tabela toggle permite tanto navegação visual quanto consulta rápida de dados
- Re-scrape deve extrair dados estruturados (stats, crafting, descrições) não só títulos

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-wiki-conteudo*
*Context gathered: 2026-04-08*
