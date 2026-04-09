---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-04-09T00:13:46.784Z"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 4
  completed_plans: 0
---

# Project State: SoulmaskBR — Guia & Server List

**Last updated:** 2026-04-08
**Updated by:** roadmapper (initial creation)

---

## Project Reference

**Core Value:** Ser a referência central em português para jogadores de Soulmask — reunindo todo o conhecimento do jogo e conectando a comunidade através da server list.

**Current Focus:** Phase 01 — fundacao

---

## Current Position

Phase: 01 (fundacao) — EXECUTING
Plan: 1 of 4
**Milestone:** v1
**Phase:** 1 — Fundacao
**Plan:** None yet (run `/gsd:plan-phase 1` to begin)
**Status:** Executing Phase 01

**Progress:**

```
Phase 1 [          ] 0%   Fundacao
Phase 2 [          ] 0%   Wiki & Conteudo
Phase 3 [          ] 0%   SEO & Performance
Phase 4 [          ] 0%   Server List — Consulta
Phase 5 [          ] 0%   Server List — Cadastro
Phase 6 [          ] 0%   Monetizacao Premium

Overall: 0/6 phases complete
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Requirements defined | 28 |
| Requirements mapped | 28 |
| Phases planned | 6 |
| Plans created | 0 |
| Plans complete | 0 |
| Phases complete | 0 |

---

## Accumulated Context

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 16 (App Router) + Vercel | ISR para wiki, SSR para server list, zero-config deploy |
| Supabase (Postgres + Auth + Storage) | All-in-one backend gratuito com RLS |
| Tailwind v4 + shadcn/ui | CSS-first, sem vendor lock-in |
| Mercado Pago SDK v2.x | PIX nativo para mercado brasileiro |
| Axios + Cheerio (local) | Scraping leve, sem dependencia de servico externo |
| cron-job.org para verificacao | Contorna limite de 1x/dia do Vercel Hobby |
| Email/senha apenas (sem OAuth) | Simplifica v1 para donos de servidor |
| Conteudo reescrito manualmente | Evita DMCA + garante qualidade SEO |

### Research Flags (validate before phase)

| Flag | Phase | Detail |
|------|-------|--------|
| UDP em Vercel serverless | Phase 4 | Verificar viabilidade do A2S_INFO (UDP) em funcoes serverless |
| Mercado Pago Pix Automatico | Phase 6 | Confirmar cobertura do SDK v2.x |

### Active Todos

- [ ] Validate A2S_INFO UDP feasibility in Vercel serverless before starting Phase 4
- [ ] Confirm Mercado Pago SDK v2.x Pix Automatico support before starting Phase 6

### Blockers

None.

---

## Session Continuity

**To resume:** Run `/gsd:plan-phase 1` to create the execution plan for Phase 1 (Fundacao).

**Context needed:**

- Stack: Next.js 16 + Supabase + Tailwind v4 + shadcn/ui + Mercado Pago
- Hosting: Vercel (free tier) + cron-job.org
- Mapa interativo e features avancadas estao em v2

---

## Phase Quick Reference

| Phase | Goal Summary | Key Requirements |
|-------|-------------|-----------------|
| 1 - Fundacao | Deploy + DB + Auth + Scraping pipeline | INFR-01..05, UI-01..03 |
| 2 - Wiki & Conteudo | Conteudo navegavel em pt-BR | WIKI-01..06 |
| 3 - SEO & Performance | Indexacao e performance mobile | SEO-01..04 |
| 4 - Server List — Consulta | Listar, filtrar, votar em servidores | SRVL-01..03, SRVL-07 |
| 5 - Server List — Cadastro | Conta + cadastro + dashboard do dono | SRVL-04..06 |
| 6 - Monetizacao Premium | Planos premium + pagamento PIX | MONE-01..03 |

---
*State initialized: 2026-04-08*
