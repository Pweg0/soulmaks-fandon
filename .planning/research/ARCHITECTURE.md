# Architecture Patterns

**Project:** SoulmaskBR — Guia & Server List
**Domain:** Game wiki/guide portal with server listing system
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

---

## Recommended Architecture

The system is a **content-heavy portal with a transactional server listing layer** — two distinct concerns that must be architected separately and composed into one Next.js application deployed on Vercel.

**Mental model:** static wiki (reads from file system / Supabase) + dynamic server list (reads/writes Supabase) + a background pinger (Vercel Cron) + payment hooks (Stripe webhooks).

```
┌──────────────────────────────────────────────────────────────────┐
│                         Vercel / Netlify                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Next.js App (App Router)                  │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │   Wiki   │  │  Map     │  │ Server   │  │  Auth  │  │    │
│  │  │  Pages   │  │  Page    │  │  List    │  │  Pages │  │    │
│  │  │ (ISR/SSG)│  │(CSR+SSR) │  │  (SSR)  │  │  (SSR) │  │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │    │
│  │       │              │              │              │       │    │
│  │  ┌────┴──────────────┴──────────────┴──────────────┴───┐  │    │
│  │  │                 API Route Layer                      │  │    │
│  │  │  /api/servers  /api/ping  /api/webhooks/stripe       │  │    │
│  │  └──────────────────────────┬───────────────────────────┘  │    │
│  └─────────────────────────────┼────────────────────────────┘    │
│                                 │                                  │
│  ┌──────────────────────────────┴───────────────────────────┐    │
│  │                  Vercel Cron Jobs                         │    │
│  │            /api/cron/ping-servers (1x/day)               │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
            │                     │                    │
     ┌──────┴──────┐     ┌────────┴───────┐   ┌───────┴───────┐
     │  Supabase   │     │  Stripe API    │   │  Game Wiki    │
     │  (Postgres  │     │  (Subscriptions│   │  (Scraping    │
     │  + Auth +   │     │  + Webhooks)   │   │   Source)     │
     │  Storage)   │     └────────────────┘   └───────────────┘
     └─────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Rendering Strategy | Communicates With |
|-----------|---------------|-------------------|-------------------|
| **Wiki Pages** | Display translated game content (items, masks, guides, patch notes) | ISR (revalidate on demand after scraping/editing) | Supabase (content table) or MDX files |
| **Interactive Map** | Render custom Soulmask game map image with filterable markers (resources, NPCs, dungeons, custom pins) | SSR shell + CSR Leaflet (no SSR for Leaflet) | Supabase (markers table) |
| **Server List** | Display verified servers, filter/sort, show uptime/ping status | SSR (fresh data per request) | Supabase (servers table) |
| **Server Registration** | Form for server owner to submit IP:port, select plan, upload banner | SSR + API Route | Supabase (servers + users) |
| **Auth Pages** | Login/register/recover — only for server owners | SSR | Supabase Auth |
| **Server Owner Dashboard** | Edit server info, view stats, manage plan | SSR + protected route middleware | Supabase (servers + subscriptions) |
| **API: /api/servers** | CRUD for server records, guarded by session | Serverless Function | Supabase |
| **API: /api/ping** | On-demand single server ping triggered by form submission | Serverless Function | External: server IP:port |
| **API: /api/cron/ping-servers** | Bulk ping all active servers, update `is_online` + `last_checked` | Vercel Cron (1x/day on Hobby) | Supabase (servers table) |
| **API: /api/webhooks/stripe** | Handle subscription events (created, cancelled, upgraded) | Serverless Function | Stripe, Supabase |
| **Content Ingestion Script** | Scrape official wiki, store raw HTML/markdown, flag for review | Offline script (local or GitHub Action) | Supabase or local MDX files |

---

## Data Flow

### 1. Wiki Content Flow

```
Official Wiki (fandom/gamepedia)
    → Scraping Script (local or GitHub Action)
        → Raw content stored in Supabase (wiki_content table) OR .mdx files in /content
            → Editor reviews + translates (manual step, no automation)
                → Published flag set to true / file committed
                    → Next.js ISR page revalidated
                        → Visitor reads translated PT-BR page
```

**Decision point:** MDX files in the repo (simpler, no DB reads, git history) vs Supabase content table (CMS-like, easier to edit without redeploy). For a small team: MDX files + `next/mdx` + on-demand revalidation via `revalidatePath()` is the lower-ops choice. Supabase content table adds editing UI — warranted if non-developer editors join later.

### 2. Interactive Map Flow

```
Game Map Image (static asset in /public or Supabase Storage)
    → Leaflet.js renders as CRS.Simple (non-geographic) custom image layer
        → Markers loaded from Supabase (markers table) or static JSON
            → Filter state managed in React client state
                → URL query params sync filter state (shareable links)
                    → Visitor pins/unmarks categories
```

Leaflet must be loaded client-side only (`dynamic(() => import(...), { ssr: false })`). The map component wraps Leaflet in a Next.js dynamic import to prevent SSR hydration crashes.

### 3. Server Registration and Verification Flow

```
Server Owner fills form (IP, port, name, description, banner)
    → /api/servers POST: inserts row with is_verified=false, is_online=false
        → /api/ping: attempts TCP/UDP connection to IP:port
            → If reachable: is_verified=true, is_online=true
            → If unreachable: stays is_verified=false, error shown to owner
                → Server appears in list only when is_verified=true
                    → Nightly Cron re-pings all verified servers
                        → Updates is_online, last_checked, player_count (if game protocol supports query)
```

**IP verification mechanism:** Vercel Serverless Functions can open outbound TCP connections. For Soulmask (a survival game), servers typically expose a Steam query port (UDP). The ping function should attempt a UDP query packet and parse the response (A2S_INFO protocol). If direct UDP proves unreliable in serverless, fall back to ICMP ping or HTTP health check to the server's web panel if one exists.

**Cron constraint on Hobby plan:** Vercel Hobby allows cron jobs triggered at most once per day. If more frequent updates are needed, use an external free scheduler (cron-job.org) to call the Vercel API route with a shared secret header — this bypasses the Hobby plan cron limit without cost.

### 4. Premium Plan Flow

```
Server Owner clicks "Upgrade to Premium"
    → Stripe Checkout Session created via /api/stripe/checkout
        → Owner completes payment on Stripe-hosted page
            → Stripe fires webhook to /api/webhooks/stripe
                → Webhook updates subscription_status in Supabase users/servers table
                    → Server gains "promoted" flag → appears at top of list
                        → Stripe Customer Portal used for plan management
```

### 5. Authentication Flow

```
Server Owner registers (email + password via Supabase Auth)
    → Email confirmation sent
        → Account created, role = "server_owner" stored in user metadata
            → Supabase RLS policies restrict server writes to owning user
                → Next.js middleware (middleware.ts) checks session on /dashboard/* routes
                    → Unauthenticated → redirect to /login
```

---

## Patterns to Follow

### Pattern 1: ISR for Wiki Content

Static generation per page with on-demand revalidation. Wiki pages do not need to be real-time. Generate at build, revalidate when content is updated.

```typescript
// app/wiki/[slug]/page.tsx
export const revalidate = false; // fully static by default

export async function generateStaticParams() {
  const slugs = await getAllWikiSlugs();
  return slugs.map(slug => ({ slug }));
}

// Trigger via: fetch('/api/revalidate?path=/wiki/iron-ore&secret=TOKEN')
```

### Pattern 2: Client-Only Leaflet Map

Leaflet accesses `window` and `document` — it cannot run on the server. Always wrap it in a dynamic import with `ssr: false`.

```typescript
// components/Map.tsx (this file is the shell)
import dynamic from 'next/dynamic';

const GameMap = dynamic(() => import('./GameMapClient'), { ssr: false });

export default function Map() {
  return <GameMap />;
}
```

### Pattern 3: Supabase RLS as the Authorization Layer

Do not rely solely on Next.js middleware for data access control. Use Supabase Row Level Security policies as the authoritative enforcement layer. Middleware protects UI routes; RLS protects data.

```sql
-- Servers table: owners can only write their own servers
CREATE POLICY "owners can update own servers"
ON servers FOR UPDATE
USING (auth.uid() = owner_id);
```

### Pattern 4: Stripe Webhook Idempotency

Stripe webhooks can deliver events more than once. Always check `event.id` against a processed events log in Supabase before applying subscription changes.

### Pattern 5: Server Ping in Isolated API Route

Keep the ping logic in its own route (`/api/ping`) separate from CRUD operations. This allows the cron job and the registration form to share the same ping function, and limits blast radius if the UDP socket logic causes timeouts.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: SSR for the Leaflet Map

**What:** Rendering the Leaflet component on the server.
**Why bad:** Leaflet directly accesses browser globals. The page crashes with `window is not defined` at hydration.
**Instead:** Use `dynamic(() => import('./MapComponent'), { ssr: false })` always.

### Anti-Pattern 2: Trusting Server-Submitted Player Counts

**What:** Accepting player count from the server owner's form input.
**Why bad:** Owners inflate player counts to gain ranking. BattleMetrics explicitly flags servers suspected of inflating counts.
**Instead:** Only show player counts if they can be read via game server query protocol (A2S_INFO). If not parseable, omit the field.

### Anti-Pattern 3: Storing All Wiki Content in Supabase Free Tier

**What:** Importing thousands of wiki pages into Supabase.
**Why bad:** Free tier is 500 MB. With images, game data tables, and server records, content pages will exhaust the limit.
**Instead:** Store wiki content as MDX files in the repository (no DB cost). Reserve Supabase for transactional data: servers, users, subscriptions, markers.

### Anti-Pattern 4: Relying on Vercel Hobby Cron for Sub-Daily Pings

**What:** Setting cron schedule to `*/30 * * * *` on Hobby plan.
**Why bad:** Vercel Hobby only allows once-per-day crons. The deployment will fail or the cron will silently not run.
**Instead:** Use cron-job.org (free) or GitHub Actions (free tier) to trigger the Vercel API route on whatever schedule is needed.

### Anti-Pattern 5: Unguarded Stripe Webhooks

**What:** Processing Stripe events without verifying the webhook signature.
**Why bad:** Any actor can POST fake subscription events to your endpoint.
**Instead:** Always verify with `stripe.webhooks.constructEvent(body, sig, secret)` before processing.

---

## Scalability Considerations

| Concern | At 100 users / 20 servers | At 1K users / 200 servers | At 10K users / 2K servers |
|---------|--------------------------|---------------------------|---------------------------|
| Wiki reads | Vercel edge cache handles it | ISR cache + CDN, no problem | Same — static pages scale infinitely |
| Map markers | Static JSON file, fine | Still fine, JSON payload <50KB | Move to Supabase, add pagination |
| Server list | Simple SSR query, fine | Add Supabase indexes on is_online, plan | Add Redis cache layer (Upstash free tier) |
| Cron ping | 20 servers in one cron run, fast | 200 servers, may hit 10s function timeout | Batch pings across multiple cron invocations |
| Supabase free tier | Well within 500 MB | Monitor storage — approach limit | Upgrade to Supabase Pro ($25/mo) |
| Stripe webhooks | Idempotent, handles fine | Same | Same |

---

## Build Order (Phase Dependencies)

The components have clear hard dependencies that dictate build order:

```
Phase 1: Foundation
  ├── Next.js project + Supabase project + Vercel deployment
  ├── Database schema (servers, users, subscriptions, wiki_content, markers)
  └── Supabase Auth + session middleware

Phase 2: Wiki Content (no auth dependency — read-only)
  ├── MDX content pipeline + category pages
  ├── Scraping script (offline tool)
  └── ISR pages for items, masks, guides, patch notes

Phase 3: Interactive Map (no auth dependency — read-only for visitors)
  ├── Leaflet integration with custom image (CRS.Simple)
  ├── Markers data (static JSON first, Supabase later)
  └── Filter UI (category toggles, URL state sync)

Phase 4: Server List — Read Side (no auth needed to view)
  ├── Server list page (SSR from Supabase)
  ├── Server detail page
  └── Ping status display (is_online, last_checked)

Phase 5: Server List — Write Side (requires auth from Phase 1)
  ├── Server registration form + IP verification endpoint
  ├── Server owner dashboard (CRUD own servers)
  └── Cron job for nightly pings

Phase 6: Premium Plans (requires Phase 5 + Stripe account)
  ├── Stripe Checkout integration
  ├── Webhook handler
  └── Promoted server ranking in list
```

**Why this order:**
- Phases 2 and 3 (wiki + map) are pure content and have zero auth or payment dependencies. They can be built, shipped, and start accumulating SEO value immediately.
- Phase 4 (server list read) can be built before the registration flow exists — populate with test data to validate the UI.
- Phase 5 write-side requires working auth (Phase 1) and the ping infrastructure.
- Phase 6 (payments) is last because it depends on the complete server owner account flow and cannot be tested without a Stripe account and real server records.

---

## Data Model (Supabase Tables)

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `users` | id (FK Supabase auth), role, stripe_customer_id | Role always "server_owner" in v1 |
| `servers` | id, owner_id (FK users), name, ip, port, description, banner_url, is_verified, is_online, last_checked, plan (free/premium), player_count | Core entity |
| `subscriptions` | id, server_id, stripe_subscription_id, status, current_period_end | Stripe sync |
| `markers` | id, map_id, category, lat (CRS.Simple y), lng (CRS.Simple x), label, icon | Can start as static JSON |
| `wiki_content` | id, slug, category, title_pt, body_pt, source_url, published | Optional — use MDX files instead to save DB space |

---

## Sources

- Vercel Cron Jobs docs and Hobby plan limits: https://vercel.com/docs/cron-jobs/usage-and-pricing
- Vercel Cron Jobs once-per-day Hobby constraint confirmed: https://tisankan.dev/vercel-cron-jobs/
- Workaround for Hobby cron limits: https://dev.to/hexshift/how-to-run-cron-jobs-in-a-vercel-serverless-environment-without-paying-extra-502h
- Supabase free tier limits (500 MB, 2 projects): https://supabase.com/pricing
- Supabase Auth + RBAC in Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Stripe + Supabase + Next.js official starter: https://github.com/vercel/nextjs-subscription-payments
- Leaflet + Next.js integration (SSR false pattern): https://medium.com/@tomisinabiodun/displaying-a-leaflet-map-in-nextjs-85f86fccc10c
- Next.js ISR: https://nextjs.org/docs/pages/guides/incremental-static-regeneration
- BattleMetrics IP verification and player count trust model: https://learn.battlemetrics.com/article/36-overview
- Serverless architecture patterns 2026: https://ztabs.co/blog/serverless-architecture-patterns
