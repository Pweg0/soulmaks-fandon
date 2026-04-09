# Feature Research

**Domain:** Game wiki/guide portal + server listing site (Soulmask, Portuguese-BR)
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH (based on analysis of live competitors: TopG, wikily.gg, ARK wiki, Planet Minecraft, Minecraft.buzz, schema.org gaming standards)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Categorized content navigation | Users expect to browse by item type, mechanic, or guide topic — a flat list is unusable | LOW | Categories: itens/crafting, máscaras/skills, guias/tutoriais, patch notes, news |
| Full-text search across wiki content | Every wiki platform has it; without it users can't find anything fast | MEDIUM | Needs index over all articles; static search (pagefind/fuse.js) viable for Vercel |
| Individual article/item pages with details | Each item, mask, NPC, location needs its own URL and structured content | LOW | Clean slug URLs (/items/stone-axe) matter for SEO |
| Mobile-responsive layout | Brazil: 75%+ internet traffic is mobile; a broken mobile experience kills retention | LOW | Mobile-first CSS is table stakes, not a feature |
| Server listing page | The product's core secondary feature; users arriving from "Soulmask server list" searches expect an actual list | MEDIUM | List with name, IP, status, description, banner |
| Server online/offline status indicator | Server list users need to know if a server is alive before trying to join | MEDIUM | Poll server IP every 5–10 min; mark offline if unreachable (modeled on TopG: checks every 10 min) |
| Server detail page | Each server needs its own page with IP, description, player count, tags, banner, and owner contact | LOW | Also enables SEO per-server slug |
| Server registration form | Server owners must be able to submit their server; no form = no list | LOW | Fields: name, IP, port, description, tags, banner image, website/Discord |
| Server owner account / login | Owners need to manage their listing, update info, renew premium; registration requires identity | MEDIUM | Email+password or OAuth (Google); scoped to owners only per PROJECT.md |
| Patch notes / news section | Game is actively updated; players expect current info without leaving the site | LOW | Translated from official sources; date-sorted reverse chronological |
| Interface entirely in Portuguese | The entire site's value proposition is being the Portuguese-language reference; any English UI erodes trust | LOW | i18n not needed; hardcode pt-BR throughout |
| Basic SEO: meta titles, descriptions, canonical URLs | Google ranks wikis on structured content; without this the site is invisible | LOW | Each page needs unique title/meta; schema.org VideoGame and Article types |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive map with filterable layers | No Portuguese Soulmask map exists; this is a sought-after resource for survival games — drives return visits | HIGH | Layers: resources, spawns, dungeons/bosses, NPCs/tribes; custom user pins; coordinate display; heatmap optional. Model: wikily.gg (ARK) with toggleable categories and 100+ filters |
| First Portuguese Soulmask server list | Minecraft-style server lists exist for Minecraft but not for Soulmask in Portuguese — this is a genuine gap | MEDIUM | The product is already positioned around this; execute it well |
| Server vote / ranking system | Server owners are motivated to promote the site to get votes; creates organic traffic loop | MEDIUM | Vote every 6–24h per user (can be anonymous); monthly rank reset modeled on TopG; anti-cheat IP deduplication |
| Premium server listing tiers | Sustainable monetization without paywalling content; server owners pay to stand out | MEDIUM | Tiers: Free (basic listing), Destaque (banner + top of section), Premium (pinned position + badge). Monthly billing via Stripe or PagSeguro/Pix for BR market |
| Content scraped and translated from official wiki | Faster content velocity than manual authorship; the official English wiki is the source of truth | HIGH | Legal/ethical risk to assess (fair use vs. derivative work); needs translation layer + manual review pass |
| Structured data (schema.org) for all content | Rich snippets in Google Brazil search; VideoGame, FAQPage, HowTo, BreadcrumbList schemas | MEDIUM | JSON-LD per page; especially valuable for guide/HowTo pages where Google shows step-by-step results |
| Category pages with thumbnail grids | Fandom-style visual category pages reduce bounce rate vs. plain lists | LOW | Image-heavy categories for masks, items; lazy-load images |
| Server banner with live player count embed | Shareable dynamic image showing server status; owners embed in Discord, forums — referral traffic | MEDIUM | OG image or PNG endpoint with server data baked in at request time; serverless function on Vercel |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Open collaborative wiki editing (anyone can edit) | "It's a wiki, shouldn't users be able to edit?" | Quality control collapse — wrong info goes live instantly; requires moderation pipeline that doesn't exist at v1; PROJECT.md explicitly excludes this | Team-curated content with scraping + manual translation; accept corrections via GitHub issue or contact form |
| User profiles for all visitors | "Every community site has user accounts" | Adds auth surface area, session management, PII storage for zero early-stage value; PROJECT.md out-of-scope | Server owner accounts only; visitor engagement via voting (anonymous) |
| Chat or forum | "The community wants to talk to each other" | High moderation overhead; requires real-time infra; competes with Discord where the community already lives | Prominent Discord invite link; embed Discord widget read-only if desired |
| Content in multiple languages | "Non-Portuguese speakers want this too" | Doubles content maintenance; dilutes the Portuguese-first positioning that creates the SEO niche | English content exists everywhere else; be the best Portuguese source |
| Native mobile app | "I want it on my phone" | Maintenance of two codebases; AppStore approval overhead; web-responsive achieves 95% of the value | Web app with PWA manifest for "Add to Home Screen" — zero store overhead |
| Real-time server chat/RCON integration | "Show me what's happening on the server right now" | Requires persistent WebSocket connections incompatible with serverless; security implications of RCON access | Show player count + uptime stats; link to server's own Discord |
| In-app payment for server hosting | "Let me rent a server from here too" | Different business entirely; regulatory complexity; competing with GPortal, Nitrado | Affiliate partnerships with hosting providers in server listings |
| Automated patch note translation via AI without review | "Just auto-translate everything with GPT" | Legal gray area for published content; AI mistranslations in gaming create trust problems | AI-assist draft + human review pass before publish |

---

## Feature Dependencies

```
[Server Owner Account]
    └──requires──> [Auth System (email/password or OAuth)]
                       └──requires──> [Session/JWT management]

[Premium Server Listing]
    └──requires──> [Server Owner Account]
    └──requires──> [Payment Gateway Integration]
    └──requires──> [Server Listing feature exists]

[Server Vote/Ranking]
    └──requires──> [Server Listing page]
    └──enhances──> [Premium Listing] (votes feed rank, premium pins above rank)

[Server Status Indicator]
    └──requires──> [Background polling job]
                       └──requires──> [Cron/scheduler compatible with Vercel serverless]

[Live Player Count Banner]
    └──requires──> [Server Status polling]
    └──requires──> [Dynamic image generation endpoint]

[Interactive Map]
    └──requires──> [Map data layer (GeoJSON or tile-based)]
    └──requires──> [Filter/layer UI component]
    └──requires──> [Custom pin storage] (if user pins are saved, requires auth or localStorage)

[SEO Structured Data]
    └──enhances──> [Individual Article Pages]
    └──enhances──> [Server Detail Pages]
    └──enhances──> [Category Pages]

[Scraped Content Pipeline]
    └──feeds──> [Article Pages]
    └──feeds──> [Patch Notes section]
    └──requires──> [Translation workflow (manual or AI-assisted)]
```

### Dependency Notes

- **Premium listing requires payment gateway:** For Brazil, Stripe supports BRL and Pix (since 2023); PagSeguro and Mercado Pago are also viable Brazilian alternatives with higher local card acceptance rates. This is a late-phase concern but architecture must not preclude it.
- **Server status polling conflicts with pure static hosting:** Vercel serverless functions can run scheduled jobs via Vercel Cron (available on Hobby/Pro plans) — this needs verification; alternative is external cron calling an API route.
- **Interactive map is independent of server list:** These are parallel features sharing layout only; map can ship after server list without blocking it.
- **Voting enhances but does not require accounts:** Anonymous voting (IP-throttled, cookie-tracked) is the norm on server lists (TopG model); requiring an account to vote destroys participation.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept and attract server owners.

- [ ] Content wiki with at least 3–4 categories (itens, máscaras, guias, patch notes) and 20+ articles — establishes legitimacy and SEO footprint
- [ ] Full-text search over wiki content — without this the wiki is a dead-end maze
- [ ] Server listing page with per-server detail pages — the primary differentiator
- [ ] Server registration form (public submission) — server owners must be able to list themselves
- [ ] Server online/offline status check — core utility of a server list; without it, it's just a directory
- [ ] Server owner account (email auth) — needed for owners to manage listings
- [ ] Basic SEO: unique meta titles, descriptions, canonical URLs, sitemap.xml — indexability from day one
- [ ] Interface 100% Portuguese — non-negotiable for the target audience
- [ ] Patch notes / news section (even if initially thin) — shows the site is maintained

### Add After Validation (v1.x)

Features to add once core traffic and server registrations confirm the value proposition.

- [ ] Server vote/ranking system — add when there are enough servers to make ranking meaningful (>10 servers)
- [ ] Premium listing tiers with payment — add when server owners are actively using free listings and asking for more visibility
- [ ] Category pages with image grids — add when content library justifies visual browsing
- [ ] Structured data (schema.org JSON-LD) — add with first SEO optimization pass after launch
- [ ] Server banner with live player count (embeddable image) — add when server owners ask for promotion tools

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Interactive map — high complexity, high value; should be a major milestone on its own after wiki and server list are proven
- [ ] PWA manifest / "Add to Home Screen" — defer until mobile retention data warrants it
- [ ] Affiliate partnerships with hosting providers — defer until traffic makes it financially meaningful
- [ ] Advanced map features (custom user pins saved server-side) — requires auth expansion beyond owner accounts

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Content wiki with categories | HIGH | LOW | P1 |
| Full-text search | HIGH | LOW-MEDIUM | P1 |
| Server listing page | HIGH | MEDIUM | P1 |
| Server status indicator | HIGH | MEDIUM | P1 |
| Server registration + owner accounts | HIGH | MEDIUM | P1 |
| Patch notes / news | MEDIUM | LOW | P1 |
| Basic SEO (meta, sitemap) | HIGH | LOW | P1 |
| Vote/ranking system | MEDIUM | MEDIUM | P2 |
| Premium listing tiers + payment | HIGH (for monetization) | HIGH | P2 |
| Schema.org structured data | MEDIUM | LOW | P2 |
| Category image grids | MEDIUM | LOW | P2 |
| Embeddable server banner | LOW-MEDIUM | MEDIUM | P2 |
| Interactive map | HIGH | HIGH | P3 |
| PWA manifest | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | TopG.org (Minecraft server list) | wikily.gg (ARK survival wiki) | Fandom/soulmask.fandom.com | Our Approach |
|---------|----------------------------------|-------------------------------|---------------------------|--------------|
| Server listing | Yes — votes, banners, version filters, country sort | N/A | N/A | Yes — simpler initial feature set, Soulmask-specific |
| Server verification | Auto-check every 10 min; offline = penalized rank | N/A | N/A | Poll every 5–10 min via serverless cron |
| Premium tiers | Yes — $30/mo for vote boosts + banner display | N/A | N/A | Tiered: free / destaque / premium; Pix + card via Stripe |
| Vote system | Yes — every 6h, monthly reset, anti-cheat | N/A | N/A | Anonymous vote (IP+cookie), daily reset |
| Interactive map | N/A | Yes — 13 resource types, 116 creature spawns, custom pins, heatmaps | Fandom maps (basic) | Map as v2+ feature; target wikily.gg level of filtering |
| Wiki content | N/A | Full wiki with categories | English-only, community-edited | Portuguese, team-curated, scraped + translated |
| Search | Basic server search | Wiki full-text search | Full-text search | Static index search (pagefind) for wiki; server filter |
| SEO | Schema.org partial | Good structured URLs | Fandom SEO (strong domain authority) | JSON-LD per page; pt-BR specific keyword optimization |
| Mobile | Responsive | Responsive | Responsive | Mobile-first from day one |
| Language | English | English | English | 100% Portuguese — only pt-BR resource in this niche |

---

## SEO Notes for Portuguese Gaming Content

**Confidence: MEDIUM** (based on awisee.com SEO Brazil 2026 guide, schema.org docs, Playwire gaming SEO guide)

- Brazilian users search in informal pt-BR, not European Portuguese. Target phrases like "como craftar [item] no Soulmask", "melhores servidores Soulmask", "guia iniciante Soulmask" — not formal equivalents.
- Schema.org types to implement: `VideoGame` (site-level), `Article` / `HowTo` / `FAQPage` (guide pages), `BreadcrumbList` (all pages), `GameServer` (server detail pages — experimental but relevant).
- Google Brasil penalizes spammy link-building. Community links from Discord/Reddit/Steam forums are more valuable than paid links.
- Mobile page speed is critical: Brazil has variable connectivity. Target Core Web Vitals green on 3G simulation.
- Long-tail guide queries ("como conseguir máscara X no Soulmask") have low competition and high intent — wiki content should target these explicitly with HowTo schema.

---

## Sources

- [TopG FAQ — server verification, voting, premium tiers](https://topg.org/faq)
- [TopG Minecraft Servers — listing format and features](https://topg.org/minecraft-servers/)
- [Minecraft.buzz — server list format 2026](https://minecraft.buzz/)
- [wikily.gg ARK: Survival Ascended — interactive map features](https://wikily.gg/ark-survival-ascended/maps/the-island/)
- [ARK Official Community Wiki — data maps](https://ark.wiki.gg/wiki/Data_maps)
- [Hytale Server Index — verification methodology (every 5 min, marks offline)](https://hytaleserverindex.com/)
- [AWISEE — SEO Brazil 2026 guide](https://awisee.com/blog/seo-brazil/)
- [Playwire — Gaming website SEO and schema markup](https://www.playwire.com/blog/gaming-website-seo-recommendations-how-to-use-schema-markup)
- [schema.org/VideoGame](https://schema.org/VideoGame)
- [wiki.gg support — category best practices](https://support.wiki.gg/wiki/Best_Practices/Categories)
- [Soulmask Fandom wiki](https://soulmask.fandom.com/wiki/Soulmask_Wiki)
- [ServerRanks.com — multi-game server list](https://serverranks.com)

---
*Feature research for: SoulmaskBR — Guia & Server List*
*Researched: 2026-04-08*
