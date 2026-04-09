# Project Research Summary

**Project:** SoulmaskBR — Guia & Server List
**Domain:** Game wiki/guide portal + server listing with premium monetization (Portuguese-BR)
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

SoulmaskBR is a content-heavy Portuguese-language portal combining a curated game wiki with a server listing/ranking system for the survival game Soulmask. There is a genuine market gap: no Portuguese-language Soulmask server list exists, and the official wiki is English-only.

The recommended approach is Next.js 16 on Vercel (free tier) with Supabase for database, auth, and file storage. Tailwind v4 and shadcn/ui provide the component layer. Leaflet with `CRS.Simple` handles the interactive game map (v2+ feature). Mercado Pago handles Brazilian PIX payments for premium server tiers. The content pipeline is a local Axios/Cheerio scraper feeding a manual review and rewrite workflow.

## Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | ISR for wiki, SSR for server list, Server Actions for mutations, zero-config Vercel deploy |
| Database/Auth | Supabase (Postgres + Auth + Storage) | All-in-one backend on free tier, RLS policies |
| Styling | Tailwind v4 + shadcn/ui | CSS-first styling, zero vendor lock-in components |
| Map | Leaflet + react-leaflet v4 | Custom game map with `CRS.Simple`, client-side only |
| Payments | Mercado Pago SDK v2.x | Brazil-dominant, native PIX and Pix Automatico |
| Scraping | Axios + Cheerio (local) | Lightweight, fits static Fandom HTML |
| Cron | cron-job.org (external) | Workaround for Vercel Hobby once-per-day cron limit |

## Table Stakes Features (v1)

- Categorized wiki navigation (itens, mascaras, guias, patch notes)
- Full-text search over wiki content
- Server listing page with per-server detail pages
- Server online/offline status via Steam Query Protocol (A2S_INFO)
- Server registration + owner accounts (email auth)
- Patch notes/news section
- Basic SEO: meta titles, descriptions, canonical URLs, sitemap.xml
- 100% Portuguese (pt-BR) interface

## Differentiators

- Server vote/ranking system (post-validation)
- Premium listing tiers with PIX payment
- Schema.org JSON-LD structured data
- Embeddable server banner with live player count

## Deferred (v2+)

- Interactive map (high complexity, high value)
- PWA manifest
- User-saved map pins

## Critical Pitfalls

1. **Scraping Fandom = DMCA + SEO death** — All published content must be manually rewritten in pt-BR
2. **Supabase connection exhaustion** — Always use Supavisor pooler URL (transaction mode)
3. **Vercel Hobby cron = once/day** — Use cron-job.org for sub-daily schedules
4. **TCP-only verification is gameable** — Use Steam Query Protocol (A2S_INFO)
5. **500+ DOM markers destroy mobile** — Canvas renderer + clustering from day one
6. **Brazilian payments need PIX first-class** — Mercado Pago over Stripe for BR market

## Recommended Phase Order

1. **Foundation:** Next.js + Supabase + Auth + DB schema + deployment
2. **Wiki Content + SEO:** Translated articles, search, sitemap, schema.org
3. **Server List (Read):** Listing pages, status display, A2S_INFO ping cron
4. **Server List (Write):** Registration, owner dashboard, IP verification
5. **Premium Plans:** Mercado Pago PIX, premium tiers, vote/ranking
6. **Interactive Map (v2):** Leaflet, game image tiles, filterable markers

## Research Flags

- **UDP in Vercel serverless:** Verify A2S_INFO feasibility before Phase 3
- **Mercado Pago Pix Automatico:** Verify SDK v2.x coverage before Phase 5
- **Soulmask map image:** Source and licensing before Phase 6

---
*Research completed: 2026-04-08*
*Ready for roadmap: yes*
