# SoulmaskBR — Guia & Server List

## What This Is

Portal comunitário brasileiro para o jogo Soulmask, funcionando como wiki/guia completo em português com conteúdo traduzido e adaptado da wiki oficial. Inclui mapa interativo, categorias organizadas de conteúdo do jogo (itens, máscaras, guias, news), e uma server list com verificação de IP onde donos de servidores cadastram e promovem seus servidores. Voltado para toda a comunidade lusófona de Soulmask.

## Core Value

Ser a referência central em português para jogadores de Soulmask — reunindo todo o conhecimento do jogo e conectando a comunidade através da server list.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Wiki/guia traduzido e organizado por categorias (itens/crafting, máscaras/skills, guias/tutoriais, patch notes)
- [ ] Mapa interativo com filtros (recursos, NPCs/tribos, dungeons/bosses, marcações custom)
- [ ] Server list com cadastro de servidores, banner, verificação de IP
- [ ] Sistema de contas para donos de servidores
- [ ] Planos premium para destaque de servidores na lista
- [ ] Conteúdo extraído via scraping da wiki oficial + edição/tradução manual
- [ ] Patch notes e notícias traduzidas
- [ ] Interface 100% em português

### Out of Scope

- Conta/perfil para visitantes comuns — apenas donos de servidor precisam de conta (v1)
- App mobile nativo — web responsive é suficiente
- Chat/fórum integrado — foco em conteúdo e server list, não em rede social
- Conteúdo em outros idiomas — foco exclusivo em português
- Edição colaborativa estilo wiki — conteúdo gerenciado pela equipe, não pelos usuários

## Context

- **Soulmask** é um jogo de sobrevivência/RPG relativamente novo que ainda não tem uma comunidade organizada em português
- Referências: https://fantasfor.wixsite.com/fantasfor-soulmask/ (guia existente), wiki oficial do jogo
- Conteúdo será extraído da wiki oficial via scraping e depois traduzido/adaptado manualmente
- A server list é o diferencial — não existe ainda para Soulmask como existe para Minecraft
- Monetização via planos premium para servidores (destaque na lista)
- Hospedagem planejada: Vercel/Netlify (tier gratuito)
- Mapa interativo inspirado em mapas de outros jogos de sobrevivência (tipo Ark, Rust)

## Constraints

- **Hospedagem**: Vercel/Netlify — precisa ser compatível com serverless/edge
- **Custo**: Minimizar custos, usar tiers gratuitos onde possível
- **Idioma**: Interface e conteúdo 100% em português brasileiro
- **Conteúdo**: Depende de scraping da wiki oficial — estrutura pode mudar com atualizações do jogo
- **Pagamento**: Sistema de planos premium precisa de integração com gateway de pagamento

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stack a definir via research | Deixar pesquisa recomendar o melhor stack | — Pending |
| Verificação de servidor via IP | Garantir que servidores listados estão realmente online | — Pending |
| Conta apenas para donos de servidor | Simplificar v1, sem necessidade de sistema social completo | — Pending |
| Monetização via servidor premium | Modelo sustentável sem impactar experiência do visitante | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-08 after initialization*
