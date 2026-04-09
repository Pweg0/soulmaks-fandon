---
phase: 01-fundacao
plan: 01
subsystem: infra
tags: [nextjs, supabase, tailwind, shadcn, vitest, typescript, mdx, next-themes]

# Dependency graph
requires: []
provides:
  - Next.js 16 project with App Router, TypeScript, Tailwind v4
  - shadcn/ui component library (button, card, badge, input, sheet, command, separator, navigation-menu)
  - Supabase browser and server clients using @supabase/ssr pattern
  - Auth middleware refreshing sessions on all non-static routes
  - Initial Postgres migration with servers table and 4 RLS policies
  - Vitest test runner configured with jsdom and @testing-library/react
  - Environment variable documentation in .env.example
affects: [02-wiki-conteudo, 03-seo-performance, 04-server-list-consulta, 05-server-list-cadastro, 06-monetizacao-premium]

# Tech tracking
tech-stack:
  added:
    - Next.js 16.2.3 (App Router)
    - React 19.2.4
    - TypeScript 5.x
    - Tailwind CSS v4
    - shadcn/ui 4.2.0
    - @supabase/supabase-js 2.x
    - @supabase/ssr 0.10.x
    - next-themes 0.4.x
    - @next/mdx 16.x
    - gray-matter 4.x
    - axios 1.x
    - cheerio 1.x
    - lucide-react 1.x
    - vitest 4.x
    - @testing-library/react 16.x
    - @testing-library/jest-dom 6.x
    - jsdom 29.x
  patterns:
    - Supabase SSR pattern: createBrowserClient for client, createServerClient with cookie handlers for server
    - Middleware session refresh on all routes excluding static assets
    - ThemeProvider wrapping root layout with dark mode as default, no system override
    - passWithNoTests in vitest config to allow zero-test runs to exit 0

key-files:
  created:
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
    - src/middleware.ts
    - supabase/migrations/001_initial_schema.sql
    - vitest.config.ts
    - tests/setup.ts
    - tests/lib/supabase-client.test.ts
    - .env.example
    - src/components/ui/badge.tsx
    - src/components/ui/card.tsx
    - src/components/ui/command.tsx
    - src/components/ui/dialog.tsx
    - src/components/ui/input.tsx
    - src/components/ui/navigation-menu.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/sheet.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - next.config.ts
    - package.json
    - .gitignore

key-decisions:
  - "Added passWithNoTests to vitest config so empty test suite exits 0 — required by must_haves truth"
  - "Scaffolded to temp dir (/tmp/soulmaskbr) then moved to project root due to npm naming restriction on directory name with spaces and capital letters"
  - "Project name set to soulmaskbr in package.json (URL-safe)"

patterns-established:
  - "Supabase client pattern: use createBrowserClient in client components, createServerClient with cookies() in server components and route handlers"
  - "Auth middleware: all routes except _next/static, _next/image, favicon.ico are processed for session refresh"
  - "Dark-first theme: defaultTheme=dark, enableSystem=false — site is dark-only"

requirements-completed: [INFR-01, INFR-02, INFR-03]

# Metrics
duration: 21min
completed: 2026-04-09
---

# Phase 01 Plan 01: Fundacao — Project Bootstrap Summary

**Next.js 16 skeleton with Supabase SSR clients, auth middleware, servers table RLS migration, shadcn/ui dark theme, and Vitest passing**

## Performance

- **Duration:** 21 min
- **Started:** 2026-04-09T00:14:51Z
- **Completed:** 2026-04-09T00:35:54Z
- **Tasks:** 2
- **Files modified:** 20+

## Accomplishments

- Next.js 16.2.3 project builds cleanly with `npm run build` (Turbopack)
- All Phase 1 dependencies installed: Supabase, shadcn/ui, next-themes, @next/mdx, gray-matter, axios, cheerio, lucide-react, vitest + testing-library
- Supabase SSR pattern implemented correctly for both browser (createBrowserClient) and server (createServerClient with cookie handlers)
- Auth middleware refreshes sessions on every non-static route
- Database migration ready: servers table with uuid PK, owner_id FK to auth.users, and 4 RLS policies (public SELECT, owner-only INSERT/UPDATE/DELETE)
- Vitest configured with jsdom, @testing-library/jest-dom, and passWithNoTests — all tests pass (exit 0)
- ThemeProvider configured with defaultTheme="dark", pt-BR lang, Cinzel+Inter fonts

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 16 project with all dependencies** - `456ec1a` (feat)
2. **Task 2: Create Supabase clients, auth middleware, and database migration** - `336c1cf` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/lib/supabase/client.ts` - Browser Supabase client using createBrowserClient
- `src/lib/supabase/server.ts` - Server Supabase client with Next.js cookies() integration
- `src/middleware.ts` - Session refresh middleware on all routes, exports middleware + config
- `supabase/migrations/001_initial_schema.sql` - servers table + 4 RLS policies
- `vitest.config.ts` - Vitest config with jsdom environment and passWithNoTests
- `tests/setup.ts` - @testing-library/jest-dom vitest setup
- `tests/lib/supabase-client.test.ts` - Verifies createClient export from browser client
- `.env.example` - Documents 4 env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET
- `src/app/layout.tsx` - Updated with pt-BR, ThemeProvider (dark), Cinzel+Inter fonts
- `src/app/page.tsx` - Replaced with minimal placeholder
- `next.config.ts` - MDX support via pageExtensions and createMDX

## Decisions Made

- Added `passWithNoTests: true` to vitest config — required for empty test suite to exit 0 as per plan's must_haves truth
- Scaffolded to `/tmp/soulmaskbr` then moved to project root (deviation from plan's suggested working directory due to npm naming restriction on "Nova pasta")
- Project name in package.json is "soulmaskbr" (URL-safe, meets npm requirements)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added passWithNoTests to vitest config**
- **Found during:** Task 1 (Verify step — `npx vitest run`)
- **Issue:** vitest exits with code 1 when no test files found; plan requires "exit 0"
- **Fix:** Added `passWithNoTests: true` to test config in vitest.config.ts
- **Files modified:** vitest.config.ts
- **Verification:** `npx vitest run` exits 0
- **Committed in:** 456ec1a (Task 1 commit)

**2. [Rule 3 - Blocking] Scaffolded to temp directory due to npm project name restriction**
- **Found during:** Task 1 (create-next-app execution)
- **Issue:** Directory "Nova pasta" contains capital letters and spaces; npm package names must be lowercase URL-safe
- **Fix:** Created project in `/tmp/soulmaskbr`, then moved all files to project root
- **Files modified:** All scaffolded files
- **Verification:** `npm run build` passes, package.json has name "soulmaskbr"
- **Committed in:** 456ec1a (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 blocking issue)
**Impact on plan:** Both fixes were necessary for correctness and functionality. No scope creep.

## Issues Encountered

- npm `create-next-app` rejected the project directory name ("Nova pasta") due to npm naming rules — resolved by scaffolding to /tmp first

## User Setup Required

External services require manual configuration before the app can connect to Supabase:

**Environment variables to add to `.env.local`:**
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Dashboard > Project Settings > API > URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Dashboard > Project Settings > API > anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Dashboard > Project Settings > API > service_role key
- `CRON_SECRET` — any random secret string for cron endpoint protection

**Dashboard configuration:**
1. Create a new Supabase project at supabase.com
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor
3. Create Vercel account and link GitHub repository at vercel.com

## Next Phase Readiness

- Next.js 16 + Supabase foundation is complete — all subsequent plans can import from `@/lib/supabase/client` and `@/lib/supabase/server`
- Middleware is in place — auth-protected routes will work once Supabase env vars are set
- Test infrastructure is ready — add tests to `tests/` or `src/**/*.test.ts`
- No blockers for Phase 1 Plan 2 (layout + homepage UI)

---

*Phase: 01-fundacao*
*Completed: 2026-04-09*
