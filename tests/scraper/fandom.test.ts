import { describe, it, expect } from 'vitest'

describe('Fandom scraper module', () => {
  it('exports scrapeFandom function', async () => {
    const mod = await import('../../scripts/scraper/fandom')
    expect(typeof mod.scrapeFandom).toBe('function')
  })
})
