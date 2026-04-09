# Phase 1: Fundacao - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Infraestrutura completa funcionando — deploy automático na Vercel, banco de dados Supabase com connection pooling, autenticação para donos de servidor, pipeline de scraping local, cron externo para verificação de servidores, e tema visual base com navegação e layout. Tudo que as fases seguintes precisam para funcionar.

</domain>

<decisions>
## Implementation Decisions

### Tema Visual
- **D-01:** Estilo "dark tribal" — fundo escuro com acentos dourados/laranja e texturas orgânicas remetendo ao mundo tribal de Soulmask
- **D-02:** Paleta de cores: preto/cinza escuro como base com acentos dourados e marrons (tom tribal/premium)
- **D-03:** Homepage com hero/banner grande e imersivo usando arte do Soulmask, nome do site e busca sobreposta

### Estrutura de Dados
- **D-04:** Conteúdo da wiki armazenado como arquivos MDX no repositório (versionados no git, zero custo, ISR na Vercel) — NÃO no Supabase
- **D-05:** Dados de servidor no Supabase: nome, IP, porta, descrição, banner URL, status online/offline, owner_id, created_at
- **D-06:** Schema de auth simples — todos os usuários são donos de servidor, sem role de admin no v1

### Pipeline de Scraping
- **D-07:** Fonte de dados: múltiplas fontes (Fandom wiki, wiki.gg, e outras) — consolidar o melhor de cada
- **D-08:** Phase 1 deve scrappear o máximo possível de conteúdo, não apenas criar o pipeline
- **D-09:** Fluxo de tradução: IA gera rascunho da tradução, seguido de revisão manual para qualidade e SEO

### Layout Base
- **D-10:** Navegação: sidebar lateral com categorias + topbar com busca e logo
- **D-11:** Homepage: hero banner em cima + cards de categorias + últimas notícias e servidores em destaque embaixo
- **D-12:** Footer minimalista — só copyright e link de contato

### Claude's Discretion
- Escolha exata de fonte tipográfica (desde que combine com tema tribal/gaming)
- Espaçamento e grid system
- Animações e transições
- Estrutura interna dos arquivos MDX (frontmatter schema)
- Detalhes do schema de votos e ranking (vem na Phase 4)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in:

### Project Context
- `.planning/PROJECT.md` — Project vision, core value, constraints
- `.planning/REQUIREMENTS.md` — All v1 requirements with traceability
- `.planning/ROADMAP.md` — Phase structure and success criteria

### Research
- `.planning/research/STACK.md` — Technology stack decisions (Next.js 16, Supabase, Tailwind v4, shadcn/ui)
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, build order
- `.planning/research/PITFALLS.md` — Critical risks (scraping legal, Supabase pooling, Vercel cron limits)
- `.planning/research/SUMMARY.md` — Synthesized research findings

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Nenhum — projeto greenfield

### Established Patterns
- Nenhum — primeira fase define os padrões

### Integration Points
- Vercel deploy (CI/CD via git push)
- Supabase (banco + auth + storage)
- cron-job.org (scheduler externo para verificação de servidores)

</code_context>

<specifics>
## Specific Ideas

- Hero banner deve ser imersivo com arte do jogo Soulmask — estilo tribal/survival
- Sidebar de navegação inspirada em wikis de jogos (wiki.gg, Fandom) mas com visual dark/premium
- Conteúdo MDX permite que cada página de item/máscara tenha componentes React customizados
- Scraping deve ser agressivo na Phase 1 para já ter volume de conteúdo para traduzir

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-fundacao*
*Context gathered: 2026-04-08*
