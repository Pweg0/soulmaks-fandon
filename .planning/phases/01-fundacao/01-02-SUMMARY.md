---
phase: 01-fundacao
plan: 02
subsystem: ui
tags: [tailwind, shadcn, next.js, dark-theme, layout, homepage, pt-BR]

requires:
  - phase: 01-01
    provides: "Next.js 16 project with shadcn initialized, ThemeProvider, Supabase clients, auth middleware"

provides:
  - "Dark tribal CSS palette (gold #c9973a on near-black #0f0f0f) applied globally via globals.css HSL variables"
  - "Layout shell: Topbar (56px, logo + search), Sidebar (240px desktop + Sheet mobile), Footer (copyright + contact)"
  - "Homepage: HeroBanner (full-width hero), CategoryCards (4-col grid), FeaturedSection (2-col placeholder)"
  - "SidebarContext + SidebarMobileToggle for shared mobile open state"
  - "All visible text in pt-BR"

affects: [all-future-phases, wiki, servidores, guias, patch-notes]

tech-stack:
  added: []
  patterns:
    - "SidebarContext pattern: shared React context for mobile sidebar open state between Topbar and Sidebar"
    - "HSL CSS variable pattern: bare HSL components in :root, wrapped via hsl(var(--x)) in @theme inline for Tailwind v4"
    - "Full-width hero with no layout breakout hacks: main has no max-width, CategoryCards/FeaturedSection apply their own max-w-[1280px]"

key-files:
  created:
    - src/components/layout/Topbar.tsx
    - src/components/layout/Sidebar.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/SidebarContext.tsx
    - src/components/layout/SidebarMobileToggle.tsx
    - src/components/home/HeroBanner.tsx
    - src/components/home/CategoryCards.tsx
    - src/components/home/FeaturedSection.tsx
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - tsconfig.json

key-decisions:
  - "Used hsl(var(--x)) wrapping in @theme inline instead of bare HSL components — required for valid CSS color output in Tailwind v4"
  - "SidebarProvider context wraps ThemeProvider children to share mobile open state without prop drilling across Topbar and Sidebar"
  - "Button asChild is not supported in base-ui Button — CTA uses a styled Link directly with button-equivalent Tailwind classes"
  - "tsconfig target bumped ES2017→ES2018 to fix dotAll regex flag in existing scraper (pre-existing issue from 01-01, Rule 3 auto-fix)"

patterns-established:
  - "Pattern 1: Layout shell pattern — Sidebar + Topbar + Footer wrap all pages via root layout; main has no max-width constraint"
  - "Pattern 2: Content width pattern — each content section applies its own max-w-[1280px] px-6 wrapper"
  - "Pattern 3: Client component isolation — 'use client' scoped to Topbar, Sidebar, SidebarContext, SidebarMobileToggle; page and footer are Server Components"

requirements-completed: [UI-01, UI-02, UI-03]

duration: 45min
completed: 2026-04-09
---

# Phase 1 Plan 02: Dark Tribal Theme and Homepage Summary

**Dark tribal layout shell with HSL gold palette, responsive sidebar/topbar/footer, and full pt-BR homepage (hero + 4 category cards + 2 featured placeholders) — awaiting human visual verification.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-04-09T00:38:00Z
- **Completed:** 2026-04-09 (stopped at checkpoint Task 3)
- **Tasks:** 2/3 complete (Task 3 is human-verify checkpoint)
- **Files modified:** 12

## Accomplishments

- Dark tribal HSL color palette applied globally: `--primary: 38 85% 52%` (gold #c9973a), `--background: 0 0% 6%` (near-black), all in globals.css
- Responsive layout shell: Topbar (56px, logo + centered search + hamburger), Sidebar (desktop 240px sticky + mobile Sheet with 4 nav links), Footer (copyright + contact), all text in pt-BR
- Homepage renders: HeroBanner (full-width 320/480px with gradient, title in Cinzel/gold, tagline, search, CTA to /wiki), CategoryCards (4-col grid, max-w-1280px), FeaturedSection (2-col placeholder, pt-BR empty states)
- Build passes (TypeScript + Turbopack) with zero errors

## Task Commits

1. **Task 1: Dark tribal theme CSS variables and layout components** - `3808dc0` (feat)
2. **Task 2: Homepage content — Hero banner, category cards, featured sections** - `69569e3` (feat)
3. **Task 3: Visual verification** - PENDING CHECKPOINT (human-verify)

## Files Created/Modified

- `src/app/globals.css` — Dark tribal HSL palette replacing shadcn defaults; @theme inline uses hsl(var(--x)) pattern
- `src/app/layout.tsx` — Added Topbar/Sidebar/Footer imports, SidebarProvider wrapper, flex layout shell
- `src/app/page.tsx` — Wires HeroBanner + CategoryCards + FeaturedSection
- `src/components/layout/Topbar.tsx` — 56px header with SoulmaskBR logo (Cinzel/gold), centered search, hamburger toggle
- `src/components/layout/Sidebar.tsx` — Desktop 240px sidebar + mobile Sheet, 4 nav links with usePathname active state
- `src/components/layout/Footer.tsx` — Footer with copyright and Contato link in pt-BR
- `src/components/layout/SidebarContext.tsx` — React context for mobile sidebar open state
- `src/components/layout/SidebarMobileToggle.tsx` — Hamburger button that sets sidebar open via context
- `src/components/home/HeroBanner.tsx` — Full-width hero with gradient bg, SoulmaskBR title, tagline, search, CTA link
- `src/components/home/CategoryCards.tsx` — 4 category cards (Itens/Mascaras/Guias/Patch Notes) with lucide icons
- `src/components/home/FeaturedSection.tsx` — 2-col placeholder sections with pt-BR empty state copy
- `tsconfig.json` — Bumped target ES2017→ES2018 (Rule 3 auto-fix for scraper dotAll regex)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript target blocking build**
- **Found during:** Task 1 build verification
- **Issue:** `tsconfig.json` had `"target": "ES2017"` which disallows the `s` (dotAll) regex flag used in `scripts/scraper/fandom.ts` from Plan 01-01
- **Fix:** Bumped target to `"ES2018"` (minimal change; lib was already `esnext`)
- **Files modified:** `tsconfig.json`
- **Commit:** `3808dc0`

**2. [Rule 1 - Bug] Button asChild not supported in base-ui**
- **Found during:** Task 2 build verification
- **Issue:** Plan specified `<Button asChild>` pattern but the installed shadcn Button uses `@base-ui/react/button` which does not have an `asChild` prop
- **Fix:** Replaced with a styled `<Link>` using equivalent Tailwind button classes
- **Files modified:** `src/components/home/HeroBanner.tsx`
- **Commit:** `69569e3`

**3. [Architecture - Pattern] SidebarContext for mobile toggle**
- **Found during:** Task 1 implementation
- **Issue:** Plan required hamburger in Topbar to open Sheet in Sidebar — both are separate client components with no shared state mechanism
- **Fix:** Created `SidebarContext.tsx` + `SidebarMobileToggle.tsx` to share open state via React context, wrapped by `SidebarProvider` in layout.tsx
- **Files modified:** New files, layout.tsx updated

## Known Stubs

The following sections use placeholder content (intentional per plan spec — Phase 2 and Phase 4 will fill these):

- `src/components/home/FeaturedSection.tsx` — "Nenhuma noticia ainda" (news empty state, Phase 2 fills)
- `src/components/home/FeaturedSection.tsx` — "Nenhum servidor cadastrado ainda" (servers empty state, Phase 4 fills)
- Category card hrefs (`/wiki/itens`, `/wiki/mascaras`, `/guias`, `/patch-notes`) point to unimplemented routes

These stubs are intentional and documented. The plan goal (visual shell + homepage) is fully achieved.

## Self-Check: PENDING CHECKPOINT

Awaiting human visual verification (Task 3). Self-check will be completed after checkpoint approval.
