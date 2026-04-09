# Domain Pitfalls — SoulmaskBR (Game Wiki + Server List)

**Domain:** Game wiki/guide portal with server listing and premium monetization
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH (verified through multiple sources; Soulmask-specific data is LOW where not publicly documented)

---

## Critical Pitfalls

Mistakes that cause rewrites, legal exposure, or total SEO loss.

---

### Pitfall 1: Scraping Fandom/Official Wiki Without Legal Cover

**What goes wrong:** The Soulmask wiki lives on `soulmask.fandom.com`. Fandom's Terms of Use explicitly prohibit using "robots, spiders, or other automated means to scrape, extract, retrieve or index content without express written permission." Scraping and republishing that content — even translated — exposes the project to DMCA takedowns. The game developer (Qooland Games) independently holds copyright over all game assets, item descriptions, and lore text.

**Why it happens:** Builders assume "it's public data" = "it's free to use." It is not. Two separate copyright holders exist: Fandom (the platform) and Qooland Games (the content). Both can send takedown notices.

**Consequences:**
- DMCA takedown removes all scraped content (site becomes empty overnight)
- Hosting provider (Vercel/Netlify) suspends account on repeat violations
- Google de-indexes the domain, losing all accumulated SEO
- No legal recourse — terms of use were violated

**Prevention:**
- Treat scraped content as a *research input only*, not the published output
- All published text must be manually rewritten/translated — never copy-paste from the source wiki
- Use scraping only to understand game data structure, then write original Portuguese descriptions
- Add a `robots.txt` and `noindex` to any staging/import pipeline pages
- Document the transformation process: scrape → translate → rewrite → publish
- If in doubt, contact Qooland Games for a fan-site permission statement (they are incentivized to support community content)

**Warning signs:**
- Developers storing raw scraped HTML in the database as "content"
- "We'll translate it later" becoming "we never did"
- Pages with game item descriptions that read like machine-translated English

**Phase:** Address in Phase 1 (content pipeline design) — not after content is already published.

---

### Pitfall 2: Republishing Scraped Content = Duplicate Content SEO Penalty

**What goes wrong:** Even if legal issues are avoided, publishing text that closely mirrors the source wiki triggers Google's duplicate/thin content filters. Google's 2024–2025 algorithm updates (Helpful Content, Site Reputation Abuse) specifically targeted sites republishing content without meaningful transformation. Scraped-and-lightly-translated text will not rank — it will be filtered entirely.

**Why it happens:** The assumption is that translating to Portuguese makes content "unique." Google's systems detect semantic similarity across languages. The English Fandom wiki already ranks globally; the Portuguese translation will be identified as a derivative.

**Consequences:**
- Pages are deprioritized or excluded from indexing
- Domain authority never builds — the site is invisible to Google searches
- Content from the original wiki outranks the translation on Portuguese queries

**Prevention:**
- Add substantial original analysis: "what this item is useful for," "which build uses this mask," "our testing showed..." — not just translated descriptions
- Structure content around Portuguese player questions, not English wiki structure
- Use `lastmod` in sitemaps and visible "last updated" dates on every page
- Target long-tail Portuguese queries: "melhor máscara para iniciantes soulmask" rather than mirroring English categories
- Aim for content updated within 30 days of any game patch

**Warning signs:**
- Google Search Console showing pages indexed but receiving zero impressions
- All pages have the same structure as the source wiki
- No original opinions, tips, or Brazilian community context

**Phase:** Address in Phase 1 (content strategy) and Phase 2 (SEO structure).

---

### Pitfall 3: Server Verification Is Trivially Gameable

**What goes wrong:** A TCP port-check to verify a game server is online can be spoofed or gamed in multiple ways: (1) a server owner runs a lightweight TCP listener on the game port without actually running the game, (2) a server passes verification then goes offline between checks, (3) VPNs and NAT configurations cause false negatives (legitimate servers flagged as offline), (4) the same server is registered multiple times under different names/IPs (via VPS clones).

**Why it happens:** Server list sites treat IP:port TCP connection success as ground truth. It is not — it only proves a TCP listener exists on that port, not that a functional game server is running.

**Consequences:**
- Players connect to fake servers and distrust the platform
- Bad actors list dozens of fake servers to dominate the "Online" filter
- Premium server slots are purchased for dead servers
- Legitimate servers that use non-standard ports or NAT appear offline

**Prevention:**
- Use game-protocol-level verification, not just TCP ping — for Soulmask (Steam-based survival game), use the Steam Query Protocol (A2S_INFO) which returns actual server metadata (player count, map, game version)
- Schedule verification at multiple intervals (every 5 min, every 30 min, 1 hour) and show average uptime percentage rather than binary online/offline
- Implement rate limiting on server registration (max 3 servers per account, verified email required)
- Add a player-reported "flag this server" mechanism as a second verification layer
- Show "last verified" timestamp prominently so players know data freshness

**Warning signs:**
- Server count grows suspiciously fast after launch
- Servers with 0 players always show as "online"
- Multiple registrations from the same IP subnet

**Phase:** Address in Phase 2 (server list MVP) — build the correct verification protocol from day one, not after fake servers appear.

---

### Pitfall 4: Vercel/Netlify Free Tier Surprises Under Real Traffic

**What goes wrong:** Both platforms offer 100GB/month bandwidth and serverless function execution limits. A gaming site that gets a Reddit/Twitter moment (e.g., a viral guide post) can exhaust monthly bandwidth in hours. Worse: neither platform caps billing by default — a traffic spike without a spending limit set generates four-to-five-figure bills before monitoring catches it.

**Specific limits that bite:**
- Vercel Hobby: 10-second serverless function timeout (server verification jobs that check multiple servers sequentially will time out)
- Vercel Hobby: no WebSocket support (real-time server status updates require polling instead)
- Netlify free: 100GB bandwidth, 125k function invocations/month, 300MB function bundle size limit
- Both: serverless functions cannot maintain persistent connections — database connection pools get re-created on every cold start

**Why it happens:** Free tier looks sufficient for development load. Production gaming communities are bursty — a popular Reddit post or Discord share creates a traffic spike that's 100x normal in minutes.

**Consequences:**
- Site goes down mid-traffic spike (exactly when new users would have converted)
- Unexpected bill arrives with no prior warning
- Server ping verification jobs timeout if checking more than ~20 servers sequentially in one function

**Prevention:**
- Set up billing alerts immediately on both platforms (Vercel has spend limits in Dashboard > Settings > Billing)
- Evaluate Cloudflare Pages as the static hosting layer — unlimited bandwidth on free tier, no spike cost
- Move server verification to a background job outside the request/response cycle (use Vercel Cron Jobs or an external cron service like Upstash QStash)
- Use Supabase connection pooling via Supavisor (transaction mode) — never direct connections from serverless
- Cache server status results in a database table; serve status from DB, not from live checks per request
- Pre-generate static pages for wiki content (SSG/ISR in Next.js) to minimize function invocations

**Warning signs:**
- Server verification running inside API route handlers (should be background job)
- Direct PostgreSQL connections in serverless functions (not pooled)
- No billing alert configured on the hosting account

**Phase:** Address in Phase 1 (architecture decisions) and Phase 2 (infrastructure setup).

---

### Pitfall 5: Interactive Map Renders Hundreds of Markers in DOM — Mobile Kills

**What goes wrong:** Leaflet.js default behavior creates one DOM element per marker. A Soulmask game map with resources, NPCs, dungeons, and bosses can easily have 500–2000 markers visible at once. On mobile devices, panning with 500+ DOM elements causes frame drops to single digits. On desktop it's tolerable but still slow. Users bounce before the map is useful.

**Why it happens:** Developers test the map with 20 sample markers during development. The production dataset has 500+. The performance cliff is invisible until real data is loaded.

**Consequences:**
- Map is the highest-value feature and the worst-performing one
- Mobile users (significant portion of gaming audiences) cannot use the feature
- High bounce rate on the map page hurts overall SEO

**Prevention:**
- Use Leaflet's Canvas renderer instead of SVG for markers: `L.canvas()` — renders thousands of markers as canvas pixels, not DOM nodes
- Implement marker clustering (`leaflet.markercluster`) for zoom levels where many markers overlap
- Use tile-based rendering for large datasets: pre-render markers into image tiles at each zoom level (can be done with a build script)
- Load markers lazily by viewport: only render what is currently visible + a small buffer
- Test with the full production dataset from day one of map development
- Consider Pixi.js overlay (pixi-overlay for Leaflet) for extreme marker counts (10k+)

**Warning signs:**
- Map development tests use fewer than 50 markers
- All markers loaded in a single GeoJSON fetch on page load
- No mobile testing during development

**Phase:** Address in Phase 2 (interactive map implementation) — choose the right renderer before writing a single marker.

---

## Moderate Pitfalls

---

### Pitfall 6: Payment Integration Breaks for Brazilian Users

**What goes wrong:** Stripe is the default payment gateway recommendation, but Stripe's Brazilian support has friction: Brazilian-registered businesses need a Stripe Brazil entity (or use EBANX as intermediary). IOF tax (3.5%) applies to all international transactions and must be surfaced to users. PIX is Brazil's dominant payment method and must be supported — card payments alone will lose a significant portion of Brazilian server owners.

**Prevention:**
- Use Stripe + EBANX integration for Brazil, or evaluate Abacatepay/Mercado Pago/PagSeguro as domestic alternatives with native PIX support
- Always display final price including IOF tax before checkout
- Support PIX as first-class payment method (not an afterthought)
- Avoid Stripe Checkout's default UI — it does not know about Brazilian tax requirements
- Test the full payment flow with a Brazilian test card and a PIX test before launch

**Warning signs:**
- Payment integration only tested with international Visa test cards
- IOF not mentioned anywhere in pricing copy
- PIX treated as optional/future enhancement

**Phase:** Address in Phase 3 (monetization/premium plans).

---

### Pitfall 7: Content Goes Stale After Game Patches

**What goes wrong:** Soulmask is an actively developed game. Every patch can change item stats, crafting recipes, skill trees, and map locations. Wiki content built from a scrape at one point in time becomes incorrect within weeks. Players who use incorrect guides distrust the entire site.

**Prevention:**
- Build a "last verified for patch [version]" label into every content page from day one — make staleness visible
- Store game version alongside every content record in the database
- Set up a GitHub webhook or RSS monitor on Soulmask's Steam patch notes page to get notified of updates
- Design the CMS so that game-version-sensitive fields (stats, recipes) are separate from evergreen content (lore, general tips)
- Prioritize accuracy flags in the admin panel — editors should be able to mark pages as "needs review after patch X"

**Warning signs:**
- No "last updated" date on content pages
- No process for reviewing content after a game patch ships
- Content stored as a single monolithic text field rather than structured fields

**Phase:** Address in Phase 1 (content database schema) — the data model must support versioning from the start.

---

### Pitfall 8: Missing Structured Data Means Missing Rich Results

**What goes wrong:** Gaming content benefits significantly from schema markup: `VideoGame`, `FAQPage`, `HowTo`, `BreadcrumbList`. Without it, wiki pages appear as plain blue links in Google while competitors with schema get rich snippets (star ratings, FAQ dropdowns, breadcrumbs). 71% of pages cited by AI assistants (ChatGPT, Gemini) use schema markup — omitting it reduces the chance of AI-driven traffic.

**Prevention:**
- Implement `VideoGame` schema on the main game page
- Use `HowTo` schema on crafting guides and tutorial content
- Use `FAQPage` schema on any Q&A or tips sections
- Use `BreadcrumbList` on all content pages
- Validate schema with Google's Rich Results Test before launch

**Warning signs:**
- No JSON-LD blocks in page source
- Google Search Console showing zero rich results impressions

**Phase:** Address in Phase 2 (SEO foundation) — bake schema into the component library, not retrofitted page by page.

---

### Pitfall 9: Supabase Free Tier Connection Limits Under Serverless

**What goes wrong:** Supabase free tier provides 60 concurrent database connections. Each serverless function invocation can open a new connection. Under traffic, 100 simultaneous requests can exhaust the pool and return "too many connections" errors, taking the entire site down.

**Prevention:**
- Always use Supabase's Supavisor pooler URL (transaction mode) instead of the direct connection string in serverless environments
- Set `max: 1` in connection pool config for serverless (each invocation uses max one connection from the pool)
- Cache read-heavy data (server list, wiki articles) in-memory with short TTLs or in a Redis-compatible layer (Upstash) rather than hitting the database on every request

**Warning signs:**
- Using the `postgresql://` direct connection string in Vercel environment variables
- No connection pooling configured
- Database errors only appear under load (not in development with one user)

**Phase:** Address in Phase 1 (infrastructure setup) — wrong connection string from day one causes production outages.

---

## Minor Pitfalls

---

### Pitfall 10: SEO Cannibalization from Category + Item Pages

**What goes wrong:** Having a "Masks" category page and 50 individual mask pages all targeting "Soulmask masks" splits authority and causes internal cannibalization. Google picks one winner (usually the category page) and demotes all item pages.

**Prevention:**
- Differentiate intent: category pages target broad queries ("all masks in Soulmask"), item pages target specific queries ("Galewind Mask stats and uses")
- Use canonical tags correctly — item pages should not canonicalize to the category page
- Internal linking from category → items passes authority downward

**Phase:** Address in Phase 2 (SEO structure/URL design).

---

### Pitfall 11: Server Banners Slow Page Load

**What goes wrong:** Server list owners want to upload custom banners (images). Without size/format constraints and CDN delivery, a server list page loading 20 server banners can make 20 separate image requests, totaling 5–10MB. Page load times above 3 seconds lose 50%+ of users.

**Prevention:**
- Enforce maximum banner dimensions and file size on upload (e.g., 468x60px, max 100KB)
- Convert uploads to WebP format automatically (Sharp library in Node.js)
- Serve banners through Cloudflare R2 or Supabase Storage with CDN caching
- Use `loading="lazy"` on below-the-fold banners

**Phase:** Address in Phase 2 (server registration feature).

---

### Pitfall 12: Premium Plans Without Fraud Detection

**What goes wrong:** Server owners pay for premium placement, then abandon the server. The premium badge stays displayed while the server is offline, misleading players and undermining the paid tier's value proposition.

**Prevention:**
- Tie premium badge visibility to live server status — a premium server that is offline for >1 hour should show a "currently offline" indicator, not be hidden from the premium section
- Premium placement should be for an online server — define this in terms of service clearly

**Phase:** Address in Phase 3 (monetization).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Content pipeline (Phase 1) | Scraping Fandom violates ToS → DMCA | Manual rewrite + translation workflow; scrape only for structure reference |
| Content database schema (Phase 1) | No game version tracking → stale content crisis after patch | Add `game_version` and `last_verified_at` fields from day one |
| Infrastructure setup (Phase 1) | Direct DB connections in serverless → connection pool exhaustion | Use Supavisor pooler URL in all environments |
| Interactive map (Phase 2) | DOM marker explosion → mobile unusable | Use Canvas renderer + clustering; test with full dataset immediately |
| Server list MVP (Phase 2) | TCP-only verification → fake/dead servers dominate | Use Steam Query Protocol (A2S_INFO) for game-level verification |
| SEO foundation (Phase 2) | No schema markup → no rich results, reduced AI citation | Bake JSON-LD into component library |
| Banner uploads (Phase 2) | Unoptimized images → slow list page → user bounce | Enforce size limits + WebP conversion + CDN from the start |
| Monetization (Phase 3) | Brazilian payment friction → lost conversions | Support PIX natively; surface IOF tax; test with Brazilian payment methods |
| Premium features (Phase 3) | Premium badge on dead servers → player distrust | Couple badge visibility to live verification status |
| Hosting (all phases) | No billing cap → unexpected bill on traffic spike | Set spending limits; evaluate Cloudflare Pages for static layer |

---

## Sources

- Fandom Terms of Use (anti-scraping clause): https://www.fandom.com/terms-of-use
- Web scraping legality 2025: https://www.scraperapi.com/web-scraping/is-web-scraping-legal/
- Google duplicate/thin content penalties 2025: https://kedra.io/blog/content-scraping-seo-impact-2025/
- Vercel function timeout and limits: https://vercel.com/docs/functions/limitations
- Vercel Fluid Compute (2025): https://upstash.com/blog/vercel-cost-workflow
- Netlify free tier limits 2025: https://flexprice.io/blog/complete-guide-to-netlify-pricing-and-plans
- Vercel vs Netlify vs Cloudflare bandwidth: https://niobond.com/vercel-vs-netlify-vs-cloudflare/
- Leaflet marker DOM performance: https://andrejgajdos.com/leaflet-developer-guide-to-high-performance-map-visualizations-in-react/
- Canvas tile rendering for maps: https://chairnerd.seatgeek.com/high-performance-map-interactions-using-html5-canvas/
- Supabase connection pooling in Next.js: https://needthisdone.com/blog/supabase-connection-pooling-production-nextjs
- Supavisor FAQ: https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI
- Stripe PIX Brazil: https://docs.stripe.com/payments/pix
- Stripe IOF tax Brazil: https://stripe.com/resources/more/payments-in-brazil
- Content freshness SEO 2025: https://outreachmonks.com/content-freshness/
- Schema markup gaming SEO: https://www.playwire.com/blog/gaming-website-seo-recommendations-how-to-use-schema-markup
- AI citation and structured data: https://seranking.com/blog/structured-data/
- FTC fake review rule (gaming/hosting): https://www.sarasotamagazine.com/advantagepoint/2025/12/new-ftc-rule-against-fake-reviews-what-changes-for-hosting-and-gaming-server-comparisons
- Fake servers in game server browsers: https://github.com/ValveSoftware/Source-1-Games/issues/5101
