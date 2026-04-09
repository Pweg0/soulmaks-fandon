import { describe, it, expect } from 'vitest'

// SEO-02: sitemap.xml generation
// These tests verify the sitemap function output shape.

describe('SEO-02: sitemap generation', () => {
  it('sitemap default export is a function', async () => {
    const sitemap = await import('@/app/sitemap')
    expect(typeof sitemap.default).toBe('function')
  })

  it('sitemap returns array with homepage entry', async () => {
    const sitemap = await import('@/app/sitemap')
    const entries = await sitemap.default()
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.some((e) => e.url === BASE_URL)).toBe(true)
  })

  it('robots default export is a function', async () => {
    const robots = await import('@/app/robots')
    expect(typeof robots.default).toBe('function')
  })
})
