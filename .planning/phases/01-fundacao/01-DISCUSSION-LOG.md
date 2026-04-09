# Phase 1: Fundacao - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 01-fundacao
**Areas discussed:** Tema visual, Estrutura DB, Pipeline scraping, Layout base

---

## Tema Visual

### Estilo visual

| Option | Description | Selected |
|--------|-------------|----------|
| Dark tribal | Fundo escuro, acentos dourados/laranja, texturas orgânicas | ✓ |
| Gaming moderno | Dark mode limpo estilo Discord/Steam | |
| Wiki clássica | Fundo claro, layout tipo Fandom/wiki.gg | |

**User's choice:** Dark tribal
**Notes:** Remetendo ao mundo tribal do jogo

### Paleta de cores

| Option | Description | Selected |
|--------|-------------|----------|
| Dourado + escuro | Preto/cinza escuro com acentos dourados e marrons | ✓ |
| Verde + escuro | Tons de verde selva com fundo escuro | |
| Azul + escuro | Azul com fundo escuro | |

**User's choice:** Dourado + escuro
**Notes:** Tom tribal/premium

### Hero banner

| Option | Description | Selected |
|--------|-------------|----------|
| Sim, imersivo | Hero grande com arte do Soulmask | ✓ |
| Compacto | Header pequeno, ir direto pro conteúdo | |
| Você decide | Claude escolhe | |

**User's choice:** Sim, imersivo

---

## Estrutura DB

### Armazenamento wiki

| Option | Description | Selected |
|--------|-------------|----------|
| MDX no repo | Arquivos MDX versionados no git | ✓ |
| Supabase tables | Conteúdo no banco de dados | |
| Você decide | Claude escolhe | |

**User's choice:** MDX no repo
**Notes:** Zero custo, fácil de editar, ISR na Vercel

### Dados do servidor

| Option | Description | Selected |
|--------|-------------|----------|
| Essencial | Nome, IP, porta, descrição, banner URL, status, owner_id | ✓ |
| Completo | Essencial + jogadores online, mapa, modo, região, uptime | |
| Você decide | Claude define | |

**User's choice:** Essencial

### Auth model

| Option | Description | Selected |
|--------|-------------|----------|
| Sim, roles | Admin + server_owner com RLS diferente | |
| Só owner | Todos são donos de servidor, sem admin no v1 | ✓ |
| Você decide | Claude define | |

**User's choice:** Só owner

---

## Pipeline Scraping

### Wiki fonte

| Option | Description | Selected |
|--------|-------------|----------|
| Fandom wiki | soulmask.fandom.com | |
| wiki.gg | soulmask.wiki.gg | |
| Ambas + mais | Múltiplas fontes, consolidar | ✓ |
| Não sei | Investigar | |

**User's choice:** Ambas + mais

### Prioridade de scraping

| Option | Description | Selected |
|--------|-------------|----------|
| Estrutura só | Phase 1 só cria o pipeline | |
| Itens básicos | ~20 itens como dados de teste | |
| Tudo possível | Scrappear o máximo na Phase 1 | ✓ |

**User's choice:** Tudo possível

### Fluxo de tradução

| Option | Description | Selected |
|--------|-------------|----------|
| Manual total | Traduzir e reescrever tudo manualmente | |
| IA + revisão | IA para rascunho, revisão manual depois | ✓ |
| Você decide | Claude define | |

**User's choice:** IA + revisão

---

## Layout Base

### Navegação

| Option | Description | Selected |
|--------|-------------|----------|
| Topbar + mega menu | Barra superior fixa com dropdown | |
| Sidebar + topbar | Sidebar lateral + topbar com busca | ✓ |
| Topbar simples | Barra superior com links e busca | |
| Você decide | Claude escolhe | |

**User's choice:** Sidebar + topbar

### Homepage

| Option | Description | Selected |
|--------|-------------|----------|
| Cards de categoria | Grid de cards com categorias | |
| Feed de conteúdo | Mix de conteúdos, news, servidores | |
| Misto | Cards em cima + notícias e servidores embaixo | ✓ |
| Você decide | Claude monta | |

**User's choice:** Misto

### Footer

| Option | Description | Selected |
|--------|-------------|----------|
| Links + social | Navegação, redes sociais, créditos | |
| Minimalista | Só copyright e link de contato | ✓ |
| Você decide | Claude define | |

**User's choice:** Minimalista

---

## Claude's Discretion

- Escolha de fonte tipográfica
- Espaçamento e grid system
- Animações e transições
- Estrutura interna dos arquivos MDX
- Detalhes do schema de votos e ranking

## Deferred Ideas

None — discussion stayed within phase scope
