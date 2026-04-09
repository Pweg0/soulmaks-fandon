# Phase 1: Fundacao - Research

**Researched:** 2026-04-08
**Domain:** Next.js 16 + Supabase infrastructure, Vercel CI/CD, Tailwind v4 dark theme, Cheerio scraping pipeline
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Estilo "dark tribal" — fundo escuro com acentos dourados/laranja e texturas orgânicas remetendo ao mundo tribal de Soulmask
- **D-02:** Paleta de cores: preto/cinza escuro como base com acentos dourados e marrons (tom tribal/premium)
- **D-03:** Homepage com hero/banner grande e imersivo usando arte do Soulmask, nome do site e busca sobreposta
- **D-04:** Conteúdo da wiki armazenado como arquivos MDX no repositório (versionados no git, zero custo, ISR na Vercel) — NÃO no Supabase
- **D-05:** Dados de servidor no Supabase: nome, IP, porta, descrição, banner URL, status online/offline, owner_id, created_at
- **D-06:** Schema de auth simples — todos os usuários são donos de servidor, sem role de admin no v1
- **D-07:** Fonte de dados: múltiplas fontes (Fandom wiki, wiki.gg, e outras) — consolidar o melhor de cada
- **D-08:** Phase 1 deve scrappear o máximo possível de conteúdo, não apenas criar o pipeline
- **D-09:** Fluxo de tradução: IA gera rascunho da tradução, seguido de revisão manual para qualidade e SEO
- **D-10:** Navegação: sidebar lateral com categorias + topbar com busca e logo
- **D-11:** Homepage: hero banner em cima + cards de categorias + últimas notícias e servidores em destaque embaixo
- **D-12:** Footer minimalista — só copyright e link de contato

### Claude's Discretion

- Escolha exata de fonte tipográfica (desde que combine com tema tribal/gaming)
- Espaçamento e grid system
- Animações e transições
- Estrutura interna dos arquivos MDX (frontmatter schema)
- Detalhes do schema de votos e ranking (vem na Phase 4)

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFR-01 | Aplicação deployada na Vercel com CI/CD automático | Vercel + GitHub integration pattern confirmed; push-to-deploy is zero config with Next.js |
| INFR-02 | Banco de dados Supabase com connection pooling (Supavisor) | Supavisor pooler URL pattern confirmed; transaction mode required for serverless |
| INFR-03 | Autenticação via Supabase Auth com RLS policies | Supabase Auth email/password + Next.js middleware pattern confirmed; RLS policy examples available |
| INFR-04 | Pipeline de scraping local (Cheerio) para extração estruturada da wiki oficial | Axios + Cheerio pattern confirmed; Fandom API (`/api.php`) preferred over HTML scraping |
| INFR-05 | Cron job externo (cron-job.org) para verificação periódica de status dos servidores | cron-job.org calling Vercel API route with shared secret is confirmed workaround for Hobby plan once-per-day limit |
| UI-01 | Interface 100% em português brasileiro | Architectural decision only — no i18n library needed since no multilingual requirement |
| UI-02 | Navegação clara com menu de categorias e busca acessível | shadcn/ui Sheet (mobile sidebar), Command (search), and layout components confirmed |
| UI-03 | Tema visual adequado ao universo de Soulmask (survival/tribal) | Tailwind v4 CSS variables for dark tribal palette; Google Fonts for tribal/gaming typography |

</phase_requirements>

---

## Summary

Phase 1 establishes all foundational infrastructure for SoulmaskBR. It covers four independent concerns that must all be complete before subsequent phases begin: (1) the Next.js 16 application deployed on Vercel with automatic CI/CD, (2) the Supabase database with correct connection pooling and RLS-protected auth, (3) a working local scraping pipeline that extracts structured content from multiple wiki sources and stores MDX files, and (4) the base visual theme and layout shell that every subsequent page will inherit.

The critical risk in this phase is the connection between scraping and content storage. Decision D-04 locks wiki content to MDX files in the repository rather than Supabase tables. This is the right call for the free tier constraint but it means the scraping pipeline's output is git-committed MDX files, not database rows. The planner must account for this: the scraper writes to `/content/**/*.mdx`, those files are committed, and Next.js reads them at build time or via ISR. D-08 further specifies that Phase 1 must scrape aggressively — this is a data pipeline task, not a skeleton task.

The base UI is a layout shell, not a full page implementation. Phase 1 delivers: the topbar with logo and search input (non-functional search — Phase 2 implements the index), the sidebar with category links (empty categories pointing to routes that Phase 2 fills), the homepage structure with hero + category cards + placeholder sections, and the footer. The dark tribal visual theme with Tailwind v4 CSS variables is established in this phase so all subsequent phases inherit it without re-theming.

**Primary recommendation:** Build in this order — (1) Next.js project + Vercel deploy, (2) Supabase project + schema + RLS, (3) auth middleware, (4) layout shell + theme, (5) scraping pipeline + MDX output, (6) cron endpoint + cron-job.org configuration. Do not mix concerns.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.x | Full-stack React framework | Locked decision; App Router, ISR, Server Actions, Vercel-native |
| React | 19.2.x | UI runtime | Ships with Next.js 16; React Compiler for auto memoization |
| TypeScript | 5.x | Type safety | Required; Supabase generates types from schema |
| Tailwind CSS | v4.x | Utility CSS | Locked decision; CSS-first config, no tailwind.config.ts file |
| shadcn/ui | latest (v4-compatible) | Component library | Locked decision; components copied into repo, zero vendor lock-in |
| next-themes | ^0.3 | Theme persistence | Dark mode default; stores preference in localStorage |
| @supabase/supabase-js | ^2.x | Supabase client | Database, auth, storage SDK |
| @supabase/ssr | ^0.x | SSR auth helpers | Server-side session handling in Next.js App Router |
| axios | ^1.x | HTTP client | Scraping requests; consistent error handling |
| cheerio | ^1.x | HTML parsing | jQuery-like API for scraping static Fandom/wiki.gg HTML |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @next/mdx | latest | MDX processing | Reading `.mdx` files from `/content` at build time |
| gray-matter | ^4.x | Frontmatter parsing | Parsing MDX frontmatter in scraping output and Next.js loader |
| next-mdx-remote | ^4.x | Remote MDX rendering | Alternative if MDX files come from outside `app/` directory |
| lucide-react | latest | Icon set | Ships with shadcn/ui; consistent icon style |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui (copied components) | Chakra UI, MUI | Heavier runtime; vendor version lock; shadcn is owned by project |
| Tailwind v4 CSS variables | tailwind.config.ts with theme | v4 CSS-first is simpler; no migration needed since greenfield |
| MDX files in repo | Supabase wiki_content table | D-04 locks this; MDX = zero DB cost, git history, ISR-native |
| Axios + Cheerio | Puppeteer | Puppeteer is 100MB+; Fandom/wiki.gg are static HTML |

**Installation:**

```bash
# Bootstrap
npx create-next-app@latest soulmaskbr --typescript --tailwind --app --src-dir --import-alias "@/*"

# UI Components
npx shadcn@latest init
npx shadcn@latest add button card badge input sheet command separator navigation-menu

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Theme
npm install next-themes

# MDX pipeline
npm install @next/mdx gray-matter
npm install -D @types/mdx

# Scraping (run locally, never deployed to Vercel)
npm install axios cheerio
npm install -D @types/cheerio

# Icons (comes with shadcn but explicit is better)
npm install lucide-react
```

**Version verification:** The versions above are confirmed against the stack research dated 2026-04-08. Before scaffolding, run `npm view next version` and `npm view @supabase/supabase-js version` to confirm latest stable.

---

## Architecture Patterns

### Recommended Project Structure

```
soulmaskbr/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: ThemeProvider, topbar, sidebar, footer
│   │   ├── page.tsx            # Homepage: hero + category cards + placeholders
│   │   ├── globals.css         # Tailwind v4 CSS variables (dark tribal palette)
│   │   └── api/
│   │       └── cron/
│   │           └── ping-servers/
│   │               └── route.ts  # INFR-05: endpoint called by cron-job.org
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar.tsx      # Logo + search input + auth link
│   │   │   ├── Sidebar.tsx     # Category navigation (Sheet on mobile)
│   │   │   └── Footer.tsx      # Minimal: copyright + contact
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx  # Full-width tribal hero with game art
│   │   │   ├── CategoryCards.tsx
│   │   │   └── FeaturedSection.tsx  # Placeholder for Phase 2/4 content
│   │   └── ui/                 # shadcn/ui copied components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client (createBrowserClient)
│   │   │   ├── server.ts       # Server client (createServerClient + cookies)
│   │   │   └── middleware.ts   # Session refresh logic
│   │   └── utils.ts            # cn() helper from shadcn init
│   └── middleware.ts            # Next.js middleware: session refresh on all routes
├── content/                    # D-04: MDX files output by scraper
│   ├── items/
│   ├── masks/
│   ├── guides/
│   └── patches/
├── scripts/
│   └── scraper/
│       ├── index.ts            # Entry point: orchestrates all scrapers
│       ├── fandom.ts           # Fandom wiki scraper
│       ├── wikigg.ts           # wiki.gg scraper
│       └── utils/
│           ├── http.ts         # Axios instance with rate limiting
│           ├── mdx-writer.ts   # Writes structured content to /content/*.mdx
│           └── types.ts        # ScrapedItem, ScrapedMask, etc.
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
└── .env.local                  # NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET
```

### Pattern 1: Supabase SSR Client Setup (Next.js App Router)

**What:** Two separate Supabase clients — one for server components (reads cookies), one for browser components.
**When to use:** Every Supabase interaction. Server components use `createServerClient`; client components use `createBrowserClient`.

```typescript
// src/lib/supabase/server.ts
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {} // Server Component: cookie mutation is a no-op, handled by middleware
        },
      },
    }
  )
}
```

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  // Refresh session — MUST call getUser() to keep session alive
  await supabase.auth.getUser()
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Pattern 2: Supabase Connection Pooling (Critical)

**What:** Always use the Supavisor pooler URL in serverless, never the direct `postgresql://` string.
**When to use:** Any server-side Supabase client initialization in API routes or Server Components.

The Supabase project dashboard provides two connection strings:
- Direct: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres` — for migrations only
- Pooler (transaction mode): `postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres` — for serverless

In Next.js with `@supabase/ssr`, connection pooling is handled automatically via the Supabase REST API (PostgREST) — you do not connect via `postgresql://` directly. The pooling risk applies if you ever add `pg` or `postgres` npm packages for raw SQL. Do not add direct DB drivers in serverless functions.

### Pattern 3: Tailwind v4 Dark Tribal Theme (CSS Variables)

**What:** Define the tribal color palette as CSS variables in `globals.css`, consumed by Tailwind v4 utilities.
**When to use:** This is the base for all components. Establish it before any UI work.

```css
/* src/app/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    /* Dark tribal palette (D-01, D-02) */
    --background: 0 0% 6%;           /* near-black base */
    --foreground: 40 15% 85%;         /* warm off-white text */
    --card: 0 0% 9%;
    --card-foreground: 40 15% 85%;
    --primary: 38 85% 52%;            /* tribal gold accent */
    --primary-foreground: 0 0% 6%;
    --secondary: 25 50% 22%;          /* dark brown */
    --secondary-foreground: 40 15% 85%;
    --muted: 0 0% 13%;
    --muted-foreground: 40 8% 55%;
    --accent: 38 85% 52%;             /* gold — same as primary */
    --accent-foreground: 0 0% 6%;
    --border: 0 0% 16%;
    --input: 0 0% 13%;
    --ring: 38 85% 52%;
    --radius: 0.375rem;
  }
}
```

**Typography choice (Claude's Discretion):** Use `Cinzel` (Google Fonts) for headings — Roman/tribal carved-stone feel, widely used in fantasy gaming UIs. Use `Inter` for body text — maximum legibility. Both are free, self-hostable via `next/font/google`.

### Pattern 4: MDX Content Pipeline (D-04)

**What:** Scraper writes structured content as MDX files with frontmatter; Next.js reads them at build time via `@next/mdx` or `gray-matter`.
**When to use:** All wiki content. Do NOT store wiki content in Supabase.

```typescript
// MDX frontmatter schema — Claude's discretion area
// File: content/items/iron-ore.mdx

---
title: "Minério de Ferro"
slug: "minerio-de-ferro"
category: "items"
subcategory: "resources"
gameVersion: "0.7.x"
lastScrapedAt: "2026-04-08"
lastVerifiedAt: "2026-04-08"
sourceUrl: "https://soulmask.fandom.com/wiki/Iron_Ore"
published: false   # set true after manual review/translation
---

# Minério de Ferro

[Conteúdo traduzido/reescrito aqui]
```

```typescript
// scripts/scraper/utils/mdx-writer.ts
import fs from 'fs/promises'
import path from 'path'

interface ContentItem {
  slug: string
  category: string
  title: string
  body: string
  sourceUrl: string
  gameVersion?: string
}

export async function writeMdx(item: ContentItem, contentDir: string) {
  const dir = path.join(contentDir, item.category)
  await fs.mkdir(dir, { recursive: true })
  
  const frontmatter = [
    '---',
    `title: "${item.title}"`,
    `slug: "${item.slug}"`,
    `category: "${item.category}"`,
    `gameVersion: "${item.gameVersion ?? 'unknown'}"`,
    `lastScrapedAt: "${new Date().toISOString().split('T')[0]}"`,
    `sourceUrl: "${item.sourceUrl}"`,
    `published: false`,
    '---',
    '',
    item.body,
  ].join('\n')

  await fs.writeFile(path.join(dir, `${item.slug}.mdx`), frontmatter, 'utf-8')
}
```

### Pattern 5: Cron Endpoint for INFR-05

**What:** API route called by cron-job.org with a shared secret header. Updates server status in Supabase.
**When to use:** Server status verification. MUST use Node.js runtime (not Edge — Edge cannot make TCP connections).

```typescript
// src/app/api/cron/ping-servers/route.ts
export const runtime = 'nodejs'  // REQUIRED — Edge cannot do TCP

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import net from 'net'

async function pingServer(ip: string, port: number, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect(port, ip)
    socket.setTimeout(timeoutMs)
    socket.on('connect', () => { socket.destroy(); resolve(true) })
    socket.on('timeout', () => { socket.destroy(); resolve(false) })
    socket.on('error', () => resolve(false))
  })
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data: servers } = await supabase.from('servers').select('id, ip, port')
  
  const results = await Promise.allSettled(
    (servers ?? []).map(async (server) => {
      const online = await pingServer(server.ip, server.port)
      await supabase.from('servers').update({
        is_online: online,
        last_checked: new Date().toISOString(),
      }).eq('id', server.id)
      return { id: server.id, online }
    })
  )

  return NextResponse.json({ checked: results.length })
}
```

### Pattern 6: RLS Policies for Servers Table

**What:** Row Level Security ensures server owners can only modify their own records.
**When to use:** Apply before any server registration feature. This is Phase 1 infrastructure, not Phase 5.

```sql
-- supabase/migrations/001_initial_schema.sql

-- Servers table
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ip TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 8888,
  description TEXT,
  banner_url TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Anyone can read servers (public server list)
CREATE POLICY "servers_select_public"
ON servers FOR SELECT
USING (true);

-- Only the owner can insert their server
CREATE POLICY "servers_insert_owner"
ON servers FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Only the owner can update their server
CREATE POLICY "servers_update_owner"
ON servers FOR UPDATE
USING (auth.uid() = owner_id);

-- Only the owner can delete their server
CREATE POLICY "servers_delete_owner"
ON servers FOR DELETE
USING (auth.uid() = owner_id);
```

### Anti-Patterns to Avoid

- **Direct PostgreSQL connection strings in serverless:** Use Supabase's REST API client, not `pg` or `postgres` npm packages. The REST API goes through Supavisor automatically.
- **Edge runtime on the cron ping endpoint:** Edge Functions have no TCP stack. The ping route MUST declare `export const runtime = 'nodejs'`.
- **Storing wiki content in Supabase during Phase 1:** Decision D-04 is locked. MDX in git only.
- **Publishing scraped content without rewrite:** Even for Phase 1 scaffolding, all MDX files should be committed with `published: false` until manually reviewed.
- **Missing `await supabase.auth.getUser()` in middleware:** Without this call, sessions expire silently and authenticated routes appear broken.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth session management | Custom JWT handling | `@supabase/ssr` with middleware pattern | SSR token refresh is non-trivial; Supabase handles cookie rotation, PKCE, token refresh |
| Dark mode toggle | Manual localStorage + class injection | `next-themes` | Handles flash-of-wrong-theme, hydration mismatches, SSR |
| UI components | Custom button/input/sheet from scratch | shadcn/ui | Accessible, Tailwind-native, no bundle overhead |
| Rate limiting the scraper | Sleep loops | Axios interceptors with `axios-retry` and exponential backoff | Fandom and wiki.gg will soft-block repeated rapid requests |
| Content parsing | Regex on HTML | Cheerio | HTML is not regular; Cheerio handles malformed markup |
| Cron scheduling | Vercel Cron (Hobby = 1x/day) | cron-job.org calling Vercel API route with secret header | Vercel Hobby is locked to once-per-day; external cron is free and flexible |

**Key insight:** Supabase Auth's SSR helpers handle the most complex parts of Next.js App Router authentication. The session refresh timing, cookie rotation on token expiry, and PKCE flow are all handled. Any hand-rolled JWT solution will have subtle hydration bugs.

---

## Common Pitfalls

### Pitfall 1: Wrong Supabase Connection Mode

**What goes wrong:** Developer copies the direct `postgresql://` connection string from the Supabase dashboard and sets it as `DATABASE_URL`. Under concurrent serverless invocations, connection pool is exhausted (Supabase free tier: 60 connections). Site returns 500 errors under any real load.

**Why it happens:** The dashboard shows both the direct and pooler URLs. The direct string is listed first and looks more familiar.

**How to avoid:** Use `@supabase/supabase-js` with `createServerClient` for all server-side work. This routes through Supabase's REST API (PostgREST), which uses Supavisor internally. Only use the direct string with the `supabase` CLI for running migrations (`supabase db push`).

**Warning signs:** `DATABASE_URL` or `postgres://` in `.env.local`; `import { Pool } from 'pg'` in any API route.

---

### Pitfall 2: Missing `export const runtime = 'nodejs'` on Ping Route

**What goes wrong:** The default runtime for Next.js API routes in some configurations is Edge. Edge Functions cannot open TCP sockets. The ping endpoint returns errors or silently fails for all servers.

**Why it happens:** Edge runtime is the default in some Next.js configurations; developers don't notice until they test against a real server IP.

**How to avoid:** Add `export const runtime = 'nodejs'` as the first export in `/api/cron/ping-servers/route.ts`. Add a test immediately after writing the endpoint by calling it locally with `curl -H "x-cron-secret: test" http://localhost:3000/api/cron/ping-servers`.

**Warning signs:** Ping always returns `false` even for known-online servers; no TCP-related error in logs; Edge runtime indicator in Vercel dashboard for this route.

---

### Pitfall 3: Scraping Rate — Soft Blocks from Fandom/wiki.gg

**What goes wrong:** Aggressive scraping (no delay between requests) triggers Cloudflare bot protection on Fandom. Responses return 403 or 503 instead of page content. The scraper produces empty MDX files silently.

**Why it happens:** Decision D-08 says "scrape aggressively" — developers interpret this as no rate limiting.

**How to avoid:** "Aggressive" means "broad and complete", not "fast". Use a 1-2 second delay between requests. Use the Fandom MediaWiki API (`/api.php?action=query&list=allpages`) to enumerate pages first, then fetch each with a delay. For wiki.gg, prefer their public API if available; fall back to HTML with delays.

**How to avoid (code):**

```typescript
// scripts/scraper/utils/http.ts
import axios from 'axios'

export const http = axios.create({
  headers: {
    'User-Agent': 'SoulmaskBR-Wiki-Bot/1.0 (+https://soulmaskbr.com.br)',
  },
  timeout: 15000,
})

// 1.5 second delay between requests
let lastRequest = 0
http.interceptors.request.use(async (config) => {
  const now = Date.now()
  const wait = Math.max(0, 1500 - (now - lastRequest))
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastRequest = Date.now()
  return config
})
```

**Warning signs:** HTTP 403 or 429 responses in scraper output; Cheerio returning empty content from pages that have content when viewed in browser.

---

### Pitfall 4: Supabase Free Tier Project Pause

**What goes wrong:** Supabase free tier projects pause after 1 week of inactivity. If the Vercel deployment is active but no one visits the site for 7 days, the Supabase project pauses. The next visitor sees database errors.

**Why it happens:** Free tier cost-saving measure. Projects resume automatically after being accessed via the dashboard, but the first request after a pause fails.

**How to avoid:** Set up UptimeRobot (free) to ping the site's homepage every 5 minutes. This prevents the inactivity threshold from triggering. Alternatively, the cron-job.org setup for INFR-05 acts as the heartbeat if configured to run frequently.

**Warning signs:** All DB queries fail on Monday morning after a quiet weekend; Supabase dashboard shows project as "paused".

---

### Pitfall 5: next-themes Flash of Wrong Theme (FOWT)

**What goes wrong:** The page briefly flashes in light mode before switching to dark on first load. This is visible to users and looks broken.

**Why it happens:** Theme is stored in localStorage (client-side). The server renders without knowing the user's preference. React hydration applies the theme after the initial paint.

**How to avoid:** Wrap the `<html>` tag with `<ThemeProvider>` from `next-themes` and set `defaultTheme="dark"` with `enableSystem={false}`. Since this site is always dark, the default should be dark — there is no light mode to flash to.

```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Warning signs:** Visible white flash on page load; `class` attribute on `<html>` changes from empty to `dark` in DevTools after hydration.

---

## Code Examples

### Fandom MediaWiki API — Enumerate All Pages

```typescript
// Source: https://soulmask.fandom.com/api.php (MediaWiki standard)
// Preferred over HTML scraping; structured JSON response

async function getAllFandomPages(category: string): Promise<string[]> {
  const pages: string[] = []
  let continueToken: string | undefined

  do {
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: '50',
      format: 'json',
      ...(continueToken ? { cmcontinue: continueToken } : {}),
    })

    const url = `https://soulmask.fandom.com/api.php?${params}`
    const { data } = await http.get(url)

    pages.push(...data.query.categorymembers.map((m: { title: string }) => m.title))
    continueToken = data.continue?.cmcontinue
  } while (continueToken)

  return pages
}
```

### Supabase Auth — Server Component Protected Route

```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Dashboard for {user.email}</div>
}
```

### Vercel Environment Variables Required

```bash
# .env.local (never committed)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key from Supabase dashboard]
SUPABASE_SERVICE_ROLE_KEY=[service role key — server only, NEVER expose]
CRON_SECRET=[random string — same value configured in cron-job.org header]
```

```bash
# Set in Vercel dashboard: Settings > Environment Variables
# All four above must be set for production to work
# SUPABASE_SERVICE_ROLE_KEY must NOT have NEXT_PUBLIC_ prefix
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `pages/` directory + `getServerSideProps` | App Router + Server Components | Next.js 13 → stable in 15/16 | Server data fetching is now `async/await` in components, no special functions |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Old package is deprecated; `@supabase/ssr` is the current standard |
| Tailwind config in `tailwind.config.ts` | CSS-first config in `globals.css` with `@import "tailwindcss"` | Tailwind v4 (2025) | No config file needed; theme in CSS variables |
| `pages/api/*.ts` route handlers | `app/api/*/route.ts` with `GET/POST` exports | Next.js 13+ | App Router API routes use Web API Request/Response |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Replaced by `@supabase/ssr`. Do not install the old package.
- `next/mdx` with the `pages/` directory: Use `@next/mdx` with App Router config in `next.config.ts`.
- `getStaticProps` / `getServerSideProps`: These are Pages Router APIs. App Router uses `async` Server Components.

---

## Open Questions

1. **wiki.gg Soulmask API availability**
   - What we know: wiki.gg hosts a Soulmask wiki; Fandom also has one; decision D-07 says scrape both
   - What's unclear: wiki.gg does not have a public MediaWiki-compatible API like Fandom; HTML scraping may be required
   - Recommendation: Start scraper with Fandom API (well-documented), add wiki.gg HTML scraping as second pass; check wiki.gg robots.txt before implementing

2. **Vercel free tier cron jobs — current limit**
   - What we know: Historical documentation says Hobby = 1 cron job per day; D-05 already specifies cron-job.org as the solution
   - What's unclear: Vercel updated free tier terms in 2025; the cron limit may have changed
   - Recommendation: The decision to use cron-job.org is already locked. Do not use Vercel Cron for INFR-05 regardless of current limit — cron-job.org is more flexible and has no restrictions.

3. **Supabase project auto-pause timing**
   - What we know: Free tier pauses after 1 week of inactivity (verified in stack research)
   - What's unclear: Whether the cron-job.org pings count as "activity" to prevent pausing
   - Recommendation: Add UptimeRobot ping to homepage as a separate heartbeat. The cron pings Supabase via the API; this should count as activity, but verify in Supabase dashboard after first week.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scripts + Next.js | Yes | 24.14.0 | — |
| npm | Package installation | Yes | 11.9.0 | — |
| git | CI/CD trigger + MDX version control | Yes | 2.43.0 | — |
| Vercel account | INFR-01 | Unknown — requires human setup | — | None (locked decision) |
| Supabase project | INFR-02, INFR-03 | Unknown — requires human setup | — | None (locked decision) |
| cron-job.org account | INFR-05 | Unknown — requires human setup | — | None (locked decision) |
| npx / create-next-app | Project bootstrap | Yes (via npm 11.9.0) | — | — |

**Missing dependencies with no fallback:**
- Vercel account: Must be created and linked to GitHub before INFR-01 can be verified. Human action required before deploy wave.
- Supabase project: Must be created and connection strings extracted before any DB work. Human action required.
- cron-job.org account: Must be configured with the Vercel API route URL and `CRON_SECRET` header before INFR-05 is testable.

**Missing dependencies with fallback:**
- None applicable for Phase 1.

**Note:** All three external service accounts are free-tier and take under 5 minutes each to create. The plan should include explicit "setup Vercel/Supabase/cron-job.org account" tasks in Wave 0.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None pre-existing — greenfield project |
| Config file | Wave 0 gap: `jest.config.ts` or `vitest.config.ts` to be created |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

**Recommended:** Vitest over Jest for this stack. Vitest is the current standard for Next.js + TypeScript projects (2025-2026). It uses native ESM, is faster than Jest, and the config is minimal.

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-01 | Vercel deploy succeeds on push to main | Smoke (E2E — manual) | Manual: push to git, verify Vercel dashboard | No |
| INFR-02 | Supabase accepts connections via pooler | Integration (manual) | Manual: query Supabase via client, check no connection errors | No |
| INFR-03 | RLS blocks unauthenticated writes to servers table | Integration | `npx vitest run tests/rls.test.ts` | No — Wave 0 gap |
| INFR-04 | Scraper extracts structured content from Fandom and produces valid MDX | Unit | `npx vitest run scripts/scraper/__tests__/fandom.test.ts` | No — Wave 0 gap |
| INFR-05 | Cron endpoint returns 200 with valid secret, 401 without | Unit | `npx vitest run src/app/api/cron/__tests__/ping-servers.test.ts` | No — Wave 0 gap |
| UI-01 | All rendered text is Portuguese (no English strings in UI components) | Manual review | Manual: visual review of each component | No |
| UI-02 | Navigation renders sidebar categories + topbar search | Unit | `npx vitest run src/components/layout/__tests__/Sidebar.test.tsx` | No — Wave 0 gap |
| UI-03 | Dark tribal palette applied: background is near-black, accents are gold | Visual (manual) | Manual: load page, verify CSS variables | No |

### Sampling Rate

- **Per task commit:** `npx vitest run` (all unit tests, fast)
- **Per wave merge:** Full suite + manual smoke check of deployed URL
- **Phase gate:** All unit tests green + INFR-01/02/03 manually verified against real Supabase and Vercel before Phase 2 begins

### Wave 0 Gaps

- [ ] `vitest.config.ts` — test framework config
- [ ] `tests/rls.test.ts` — RLS policy integration tests (using Supabase test client with anon and authenticated sessions)
- [ ] `scripts/scraper/__tests__/fandom.test.ts` — unit tests for MDX extraction logic with fixture HTML
- [ ] `src/app/api/cron/__tests__/ping-servers.test.ts` — unit tests for ping endpoint (mock TCP connections)
- [ ] `src/components/layout/__tests__/Sidebar.test.tsx` — render test for sidebar navigation
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom`

---

## Sources

### Primary (HIGH confidence)

- Supabase SSR + Next.js App Router official guide: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase free tier limits (2026): https://supabase.com/pricing
- Next.js 16 release blog: https://nextjs.org/blog/next-16
- Tailwind v4 + shadcn + Next.js 15: https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl
- Fandom MediaWiki API: https://soulmask.fandom.com/api.php
- Vercel function limitations (runtime, timeout): https://vercel.com/docs/functions/limitations
- Edge vs Node runtime TCP limits: https://byteiota.com/edge-functions-vs-serverless-the-2025-performance-battle/

### Secondary (MEDIUM confidence)

- Supabase connection pooling in Next.js: https://needthisdone.com/blog/supabase-connection-pooling-production-nextjs
- Supavisor FAQ: https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI
- Cheerio vs Puppeteer 2026 — confirmed Fandom pages are static HTML: https://proxyway.com/guides/cheerio-vs-puppeteer-for-web-scraping
- Vercel cron jobs usage and pricing: https://vercel.com/docs/cron-jobs/usage-and-pricing
- cron-job.org as Vercel Hobby workaround: https://dev.to/hexshift/how-to-run-cron-jobs-in-a-vercel-serverless-environment-without-paying-extra-502h
- next-themes integration with shadcn: shadcn/ui official dark mode docs

### Tertiary (LOW confidence)

- wiki.gg API availability for Soulmask: unverified — check robots.txt and wiki.gg docs at implementation time
- Supabase inactivity pause behavior with cron pings: unverified — monitor during first week of deployment

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed via project research dated 2026-04-08, verified against npm registry
- Architecture: HIGH — patterns derived from official Supabase + Next.js documentation and locked decisions in CONTEXT.md
- Pitfalls: HIGH — drawn from pre-researched PITFALLS.md with multiple source verification
- Scraping pipeline: MEDIUM — Fandom API is confirmed; wiki.gg scraping approach is unverified until implementation

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (30 days — stable libraries; Supabase/Vercel free tier terms may change, re-verify at implementation)
