import { describe, it, expect } from 'vitest'

describe('ping-servers route', () => {
  it('exports runtime as nodejs', async () => {
    const mod = await import('@/app/api/cron/ping-servers/route')
    expect(mod.runtime).toBe('nodejs')
  }, 15000)

  it('exports GET function', async () => {
    const mod = await import('@/app/api/cron/ping-servers/route')
    expect(typeof mod.GET).toBe('function')
  }, 15000)
})
