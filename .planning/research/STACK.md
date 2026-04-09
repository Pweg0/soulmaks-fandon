# Technology Stack

**Project:** SoulmaskBR — Guia & Server List
**Researched:** 2026-04-08
**Overall confidence:** MEDIUM-HIGH

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.2.x (current stable) | Full-stack React framework | App Router is now mature; React Server Components cut client bundle; Vercel-native deploy with zero config; ISR for wiki pages that update rarely; Server Actions replace separate API layer for most mutations |
| React | 19.2.x | UI runtime | Ships with Next.js 16; React Compiler stable — automatic memoization; View Transitions API for page navigation feel |
| TypeScript | 5.x | Type safety | Required for maintainability; Supabase types are generated from schema; Payload CMS is TypeScript-native |

**Confidence:** HIGH — verified via official Next.js blog (next-16, next-16-1) and releasebot.io April 2026 data.

---

### Database & Backend

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase | latest | PostgreSQL database, Auth, Storage | Free tier: 500 MB DB + 1 GB storage + 50k MAUs — enough for v1; Row Level Security handles server owner permissions without custom middleware; Auth covers server-owner accounts; Storage for server banners; direct Postgres available if you outgrow Supabase's SDK |
| Supabase Auth | — | Server owner authentication | Built into Supabase free tier; handles email/password, magic link; JWT integrates with Next.js middleware; no separate auth service cost |

**Free tier limits (verified 2026):** 500 MB DB, 1 GB file storage, 50k MAUs, 2 active projects, projects pause after 1 week inactivity (mitigable with uptime pings).

**Confidence:** HIGH — verified via supabase.com/pricing and uibakery.io/blog/supabase-pricing.

---

### Content Management

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase (Postgres tables) | — | Store wiki content (items, masks, guides, locations) | Scraped content structured into tables is simpler than a full CMS for a team-edited, code-deployed workflow; content editors work via a lightweight admin UI you build, not a third-party CMS vendor |
| No external CMS (avoid Sanity/Payload for v1) | — | — | Sanity is $300+/mo at scale; Payload requires self-hosted Node server (incompatible with Vercel free tier static hosting model); for a small team editing translated game content, direct DB rows + a protected admin route is lower complexity and zero cost |

**Rationale for no CMS:** The content workflow is scrape → manual translate → publish, not real-time editorial collaboration. Structured Postgres rows with a custom admin table UI (using shadcn/ui DataTable) covers this at zero cost. Add Payload CMS only if a non-developer editor joins and needs a rich WYSIWYG interface.

**Confidence:** MEDIUM — based on constraint analysis (free tier + Vercel serverless) vs. CMS pricing/hosting requirements.

---

### Styling & UI

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | v4.x | Utility-first CSS | CSS-first config (no tailwind.config.ts needed); faster builds; ships with Next.js 16 default scaffolding |
| shadcn/ui | latest (v4-compatible) | Component library | Not a package — components are copied into your repo; zero vendor lock-in; dark mode with next-themes; DataTable, Tabs, Dialog, Badge all needed for server list and wiki nav; Tailwind v4 support confirmed |
| next-themes | ^0.3 | Dark mode toggle | 2-line integration with shadcn; persists preference |

**Confidence:** HIGH — verified via shadcn/ui official docs and dev.to guides confirming Tailwind v4 + Next.js 15/16 compatibility.

---

### Interactive Map

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Leaflet | ^1.9.x | Map engine | Industry standard for custom image-based game maps (DayZ, Ark use this pattern); works with custom CRS (no real-world coordinates needed); tileLayer with local image tiles at different zoom levels |
| react-leaflet | ^4.x | React bindings | Wraps Leaflet for React; must be loaded client-side only (`dynamic(() => import(...), { ssr: false })`); v4 confirmed working with Next.js 15/16 App Router |
| Leaflet.markercluster | ^1.5.x | Marker clustering | Required when showing hundreds of resource/NPC markers; prevents performance degradation |

**Implementation note:** Soulmask has a custom game world map (not real-world geography). Use Leaflet with `L.CRS.Simple` and `imageOverlay` or tile the map image with GDAL/MapTiler for zoom levels. The map image must be sliced into tiles once and stored in Supabase Storage or a public CDN path. Markers (resources, NPCs, dungeons) stored in Supabase and fetched via API route.

**Why not Mapbox/Google Maps:** These require API keys, have usage costs, and are built for real-world geography. For a game map with a custom image, Leaflet with a simple CRS is the correct tool.

**Confidence:** MEDIUM-HIGH — Leaflet game map pattern verified via GitHub issue #4333 and existing game wikis (DayZDB). React-leaflet Next.js 16 integration verified via xxlsteve.net July 2025 post.

---

### Server Status Verification

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js `net` module (built-in) | — | TCP connection check to verify game server is online | Vercel Serverless Functions run Node.js and support outbound TCP via `net.connect()`; connect to server IP:port with a 5-second timeout; success = server online |
| Next.js API Route (Node runtime) | — | Endpoint called on a schedule or on-demand | Must use `export const runtime = 'nodejs'` — NOT Edge runtime (Edge has no TCP/UDP) |

**Critical constraint:** Vercel Edge Functions cannot make raw TCP connections — only HTTP. The server ping check MUST run in a Node.js serverless function. Vercel free tier allows 100 GB-hours of serverless compute/month, sufficient for periodic pings.

**Scheduling:** Vercel Cron Jobs (free tier: 2 cron jobs) can trigger a ping route every 5-10 minutes to update server status in Supabase. Alternatively, ping on-demand when a user views the server list.

**Confidence:** MEDIUM — Vercel docs confirm outbound TCP from Node runtime functions; Edge runtime limitation confirmed via byteiota.com 2025 edge vs. serverless comparison. Cron job availability on free tier needs verification against current Vercel pricing page before implementation.

---

### Payment & Premium Plans

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Mercado Pago | SDK v2.x | PIX + credit card payments for Brazil | Market-dominant payment processor in Brazil; native PIX support (QR code + copia-e-cola); Pix Automático (recurring) launched June 2025; no monthly fee — percentage per transaction only; Brazilian audience expects Mercado Pago or PIX |
| Stripe | ^14.x | Fallback / international cards | If Mercado Pago integration complexity is blocking, Stripe added PIX support via EBANX and has excellent Next.js + Vercel documentation; higher international fee but simpler integration |

**Recommendation:** Start with Mercado Pago for the Brazilian market. Community guide exists for Next.js 15 App Router integration (tabnews.com.br). Use Stripe only if Mercado Pago API proves too complex during implementation.

**Premium plan structure:** Store plan tier (free/bronze/silver/gold) in Supabase user profile row. On payment webhook confirmation, update tier. Webhook endpoint is a Next.js API route.

**Confidence:** MEDIUM — Mercado Pago PIX integration confirmed via official docs and community Next.js guide. Pix Automático (recurring) launched June 2025 per Stripe and MP announcements. Exact SDK version needs verification at implementation time.

---

### Scraping (Content Pipeline)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Axios + Cheerio | axios ^1.x, cheerio ^1.x | Scrape Soulmask Fandom wiki (soulmask.fandom.com) | Fandom pages are server-rendered HTML — no JS execution needed; Cheerio is jQuery-like, tiny (8.8 kB), runs in Node; 50x lighter than Puppeteer; fits Vercel 50 MB function limit |
| Node.js script (local, not serverless) | — | Run scraper as a one-time or periodic local CLI script | Scraping is a data pipeline operation, not a user request; run locally, push results to Supabase; avoids Vercel function timeout (10s on free tier) and Vercel's function size limit with Chromium |

**Why not Puppeteer/Playwright:** Fandom wiki content is static HTML; headless Chrome is unnecessary overhead and exceeds Vercel's 50 MB function limit (Chromium is ~100 MB). Run scraper as a local Node.js script, not a deployed serverless function.

**Scraping ethics note:** Fandom has a public API (api.php) that is cleaner than HTML scraping. Prefer `soulmask.fandom.com/api.php?action=query` for structured data. HTML scraping as fallback for content Fandom API doesn't expose.

**Confidence:** HIGH — Cheerio vs. Puppeteer comparison verified via proxyway.com 2026 guide and apify.com 2025 guide. Fandom API publicly documented.

---

### Infrastructure & Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | Free tier | Hosting, CI/CD, serverless functions | Native Next.js platform; zero-config deploy from GitHub; free tier: 100 GB bandwidth, unlimited deployments, 2 cron jobs; ISR and Server Actions work natively |
| GitHub | Free | Source control, CI trigger | Standard; Vercel auto-deploys on push to main |
| Supabase Storage | Free tier (1 GB) | Server banner images, map tile storage | 1 GB free sufficient for banner images; map tiles may need CDN if large (consider Cloudflare R2 free tier if tiles exceed 1 GB) |
| Cloudflare R2 | Free (10 GB/mo) | Map tiles CDN if Supabase Storage insufficient | 10 GB free storage, zero egress fees; public bucket for map tiles; only needed if the game map tile set is large |

**Confidence:** HIGH — Vercel and Supabase free tier limits verified via official pricing pages.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 16 | Remix, Astro | Remix has no Vercel-native ISR; Astro is great for static but lacks App Router's Server Actions for dynamic server list mutations |
| Database | Supabase | PlanetScale, Neon | PlanetScale removed free tier (2024); Neon is good but Supabase bundles Auth + Storage which avoids extra vendor |
| Map | Leaflet + react-leaflet | Mapbox, Google Maps | Both require paid API keys; not designed for custom game world images |
| CMS | None (raw DB) | Payload CMS, Sanity | Payload needs a persistent Node server (incompatible with Vercel-only free hosting); Sanity costs $300+/mo at scale |
| Payments | Mercado Pago | Stripe | Stripe has less market penetration for PIX in Brazil; Mercado Pago is the dominant Brazilian platform; use Stripe only as fallback |
| Scraping | Axios + Cheerio | Puppeteer, Playwright | Puppeteer exceeds Vercel's 50 MB function limit; Fandom pages are static HTML — headless browser is unnecessary |
| Styling | Tailwind v4 + shadcn | Chakra UI, MUI | Chakra/MUI are heavier runtime dependencies; shadcn components are owned by the project (no version breakage risk) |

---

## Installation

```bash
# Bootstrap
npx create-next-app@latest soulmaskbr --typescript --tailwind --app --src-dir --import-alias "@/*"

# UI Components
npx shadcn@latest init
npx shadcn@latest add button card badge table tabs dialog sheet

# Database client
npm install @supabase/supabase-js @supabase/ssr

# Map
npm install leaflet react-leaflet
npm install -D @types/leaflet

# Marker clustering (install after confirming react-leaflet version)
npm install leaflet.markercluster
npm install -D @types/leaflet.markercluster

# Scraping (run locally, not deployed)
npm install axios cheerio
npm install -D @types/cheerio

# Payments
npm install mercadopago
# OR: npm install stripe

# Theme
npm install next-themes
```

---

## Key Architectural Constraints

1. **Edge vs Node runtime split:** Map ping endpoint MUST use `export const runtime = 'nodejs'`. Middleware and auth checks can use Edge runtime. Confusing these causes silent failures with TCP connections.

2. **Leaflet SSR:** Always import the map component with `dynamic(() => import('./Map'), { ssr: false })`. Leaflet accesses `window` at import time — this crashes SSR without dynamic import.

3. **Supabase project pause:** Free tier projects pause after 1 week of inactivity. Set up a simple uptime monitor (UptimeRobot free tier pings the site every 5 min) to prevent pausing during low-traffic periods.

4. **Vercel function timeout:** Free tier functions time out at 10 seconds. Server ping checks must complete within this window — set TCP connection timeout to 5 seconds max. Wiki scraping cannot run as a serverless function; run it locally and push to DB.

5. **Fandom ToS:** Scraping Fandom is technically against their ToS. Use the Fandom API (`/api.php`) wherever possible. Manual copy-paste + translation for content that must be lifted verbatim. Do not automate at high frequency.

---

## Sources

- Next.js 16 release: https://nextjs.org/blog/next-16
- Next.js 16.2 stable (March 2026): https://releasebot.io/updates/vercel/next-js
- Supabase pricing (2026): https://uibakery.io/blog/supabase-pricing
- Supabase + Vercel integration: https://supabase.com/partners/integrations/vercel
- react-leaflet on Next.js 15: https://xxlsteve.net/blog/react-leaflet-on-next-15/
- Leaflet game maps pattern: https://github.com/Leaflet/Leaflet/issues/4333
- Cheerio vs Puppeteer 2026: https://proxyway.com/guides/cheerio-vs-puppeteer-for-web-scraping
- Mercado Pago PIX Next.js 15: https://www.tabnews.com.br/zilvodev/como-integrar-mercado-pago-pix-no-next-js-15-app-router
- Mercado Pago PIX docs: https://www.mercadopago.com.br/developers/pt/docs/checkout-api-payments/integration-configuration/integrate-pix
- Pix Automático launch: https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-integration/pix
- Stripe PIX via EBANX: https://finovate.com/stripe-taps-ebanx-to-facilitate-pix-payments-in-brazil/
- Tailwind v4 + shadcn + Next.js 15: https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl
- Edge vs serverless TCP limits: https://byteiota.com/edge-functions-vs-serverless-the-2025-performance-battle/
- Soulmask Fandom wiki: https://soulmask.fandom.com/wiki/Soulmask_Wiki
- Headless CMS comparison 2026: https://dev.to/pooyagolchian/headless-cms-2026-contentful-vs-strapi-vs-sanity-vs-payload-compared-25mh
