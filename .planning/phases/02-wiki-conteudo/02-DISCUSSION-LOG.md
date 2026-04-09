# Phase 2: Wiki & Conteudo - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 02-wiki-conteudo
**Areas discussed:** Páginas de item, Listagem/categorias, Conteúdo MDX, Busca

---

## Páginas de Item

### Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Wiki detalhada | Infobox lateral + conteúdo principal | |
| Card expansivo | Card grande no topo + seções colapsáveis | ✓ |
| Simples | Título + imagem + texto corrido | |

**User's choice:** Card expansivo

### Dados mostrados

| Option | Description | Selected |
|--------|-------------|----------|
| Stats básicos | Nome, categoria, imagem, descrição | ✓ |
| Crafting | Receita de crafting | ✓ |
| Localização | Onde encontrar | ✓ |
| Uso/utilidade | Para que serve, itens relacionados | ✓ |

**User's choice:** Todos selecionados

### Layout de máscaras

| Option | Description | Selected |
|--------|-------------|----------|
| Mesmo layout | Mesmo template para itens e máscaras | |
| Layout próprio | Seções específicas (skills, builds, tier) | ✓ |

**User's choice:** Layout próprio

---

## Listagem / Categorias

### Visualização

| Option | Description | Selected |
|--------|-------------|----------|
| Grid de cards | Cards em grid | |
| Tabela | Tabela com colunas | |
| Misto | Grid padrão + opção tabela | ✓ |

**User's choice:** Misto

### Filtros

| Option | Description | Selected |
|--------|-------------|----------|
| Categoria/tipo | Filtrar por subcategoria | ✓ |
| Busca inline | Campo de busca rápida | ✓ |
| Ordenação | Ordenar por nome, tipo | ✓ |

**User's choice:** Todos selecionados

### Paginação

| Option | Description | Selected |
|--------|-------------|----------|
| Paginação | Páginas numéricas | ✓ |
| Load more | Botão carregar mais | |
| Todos de uma vez | Mostrar todos | |

**User's choice:** Paginação

---

## Conteúdo MDX

### Como popular conteúdo

| Option | Description | Selected |
|--------|-------------|----------|
| Re-scrape profundo | Melhorar scraper pra extrair mais dados | ✓ |
| Conteúdo manual | Escrever manualmente | |
| IA + templates | Gerar com IA usando templates | |
| Misto | Re-scrape + IA + revisão | |

**User's choice:** Re-scrape profundo

### Frontmatter adicional

| Option | Description | Selected |
|--------|-------------|----------|
| Imagem | Campo image/thumbnail | |
| Tags | Tags pra filtros e busca | ✓ |
| Dificuldade/tier | Nível de dificuldade ou tier | ✓ |
| Suficiente | Frontmatter atual já basta | |

**User's choice:** Tags + Dificuldade/tier

### Patch notes

| Option | Description | Selected |
|--------|-------------|----------|
| Lista cronológica | Ordenada por data, recente primeiro | ✓ |
| Por versão | Agrupado por versão | |
| Blog style | Resumo + leia mais | |

**User's choice:** Lista cronológica

---

## Busca

### Implementação

| Option | Description | Selected |
|--------|-------------|----------|
| Pagefind | Indexa no build, busca client-side | |
| Fuse.js | Fuzzy search client-side | |
| Algolia | Busca hospedada | |
| Você decide | Claude escolhe | ✓ |

**User's choice:** Claude's Discretion

### UX da busca

| Option | Description | Selected |
|--------|-------------|----------|
| Command palette | Ctrl+K spotlight | |
| Só topbar + hero | Campos que já existem | ✓ |
| Página de busca | Rota /busca | |

**User's choice:** Só topbar + hero

---

## Claude's Discretion

- Biblioteca de busca
- Design dos cards na listagem
- Seções colapsáveis na página de item
- Layout das páginas de máscara
- ISR/revalidação
- Componentes MDX customizados

## Deferred Ideas

None
