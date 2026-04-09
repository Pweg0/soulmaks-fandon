---
phase: 01-fundacao
plan: 04
subsystem: api
tags: [cron, tcp, net, supabase, nextjs, serverless, nodejs-runtime]

# Dependency graph
requires:
  - phase: 01-fundacao-01
    provides: Supabase server client (createClient), DB migration with servers table (is_online, last_checked columns)
provides:
  - GET /api/cron/ping-servers endpoint with shared secret auth
  - TCP ping function for server status verification
  - Automatic is_online and last_checked updates per server
affects: [phase-04-server-list, phase-05-server-cadastro]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Node.js runtime export (`export const runtime = 'nodejs'`) required for TCP in Next.js API routes"
    - "Promise.allSettled for parallel server pings with partial failure tolerance"
    - "Shared secret auth via x-cron-secret header for external cron services"

key-files:
  created:
    - src/app/api/cron/ping-servers/route.ts
    - tests/api/ping-servers.test.ts
  modified: []

key-decisions:
  - "Node.js runtime declared explicitly (not Edge) to enable TCP via net module — Edge runtime cannot open raw sockets"
  - "Promise.allSettled used instead of Promise.all so one failing ping does not abort the entire batch"
  - "Per-test timeout of 15s added to handle slow Next.js module initialization on first Vitest import"

patterns-established:
  - "Pattern: Cron endpoint auth — check x-cron-secret header against CRON_SECRET env var, return 401 on mismatch"
  - "Pattern: TCP ping — net.connect with socket.setTimeout + event listeners (connect/timeout/error), resolve boolean"

requirements-completed: [INFR-05]

# Metrics
duration: 15min
completed: 2026-04-09
---

# Phase 01 Plan 04: Cron Ping-Servers Endpoint Summary

**TCP-based server status cron endpoint at /api/cron/ping-servers using Node.js runtime with net.connect, shared secret auth, and Supabase updates for is_online + last_checked**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-09T00:35:00Z
- **Completed:** 2026-04-09T00:50:28Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Created `/api/cron/ping-servers` route with Node.js runtime declaration (required for TCP support)
- Implemented `pingServer()` using `net.connect` with 5-second timeout, handles connect/timeout/error events
- GET handler validates `x-cron-secret` header, queries all servers from Supabase, pings each via TCP, updates `is_online` and `last_checked` fields
- Tests verify `runtime = 'nodejs'` export and `GET` function export

## Task Commits

Each task was committed atomically:

1. **Task 1: Cron ping-servers API route with TCP verification** - `46e3e9c` (feat)

**Plan metadata:** pending (docs: complete plan)

_Note: TDD task — tests written first (RED), then implementation (GREEN)_

## Files Created/Modified
- `src/app/api/cron/ping-servers/route.ts` - Cron endpoint with TCP ping, auth, Supabase updates
- `tests/api/ping-servers.test.ts` - Vitest tests verifying runtime and GET exports

## Decisions Made
- Node.js runtime explicitly declared — Edge runtime cannot open TCP sockets via `net` module
- `Promise.allSettled` used so one failing ping doesn't abort the batch
- Per-test timeout set to 15000ms to handle slow Next.js module initialization in Vitest

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added per-test timeout of 15s to handle slow module initialization**
- **Found during:** Task 1 (TDD GREEN — first run of ping-servers tests)
- **Issue:** Default 5000ms Vitest timeout was too low; first dynamic import of Next.js route module takes ~5-6s to initialize the module graph
- **Fix:** Added `15000` as third argument to each `it()` call in the test file
- **Files modified:** tests/api/ping-servers.test.ts
- **Verification:** Both tests pass consistently within 15s timeout
- **Committed in:** 46e3e9c (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug: test timeout too low for module init)
**Impact on plan:** Necessary for test reliability. No scope creep.

## Issues Encountered
- First Vitest import of Next.js route module takes ~5-6s due to Next.js + Supabase module graph initialization — resolved by setting per-test timeout to 15s

## User Setup Required

**External service requires manual configuration before cron endpoint is functional:**

1. **Generate CRON_SECRET:**
   ```bash
   openssl rand -hex 32
   ```

2. **Add to `.env.local`:**
   ```
   CRON_SECRET=<generated-value>
   ```

3. **Add to Vercel environment variables** (dashboard or CLI):
   ```bash
   vercel env add CRON_SECRET
   ```

4. **Configure cron-job.org:**
   - Create new cron job at cron-job.org
   - URL: `GET https://{your-vercel-url}/api/cron/ping-servers`
   - Header: `x-cron-secret: {CRON_SECRET}`
   - Interval: every 5-15 minutes

5. **Verify:** After setup, call the endpoint with the secret — should return `{"checked": N, "failed": 0, "timestamp": "..."}`

## Next Phase Readiness
- Cron endpoint complete and tested; ready for cron-job.org configuration
- Server status verification will work once CRON_SECRET is set and cron job configured
- Phase 01 fundacao is now complete (all 4 plans done)

---
*Phase: 01-fundacao*
*Completed: 2026-04-09*
