import { describe, it, expect } from 'vitest'

// SEO-01: meta title, description, canonical, OG tags
// These tests verify the shape of generateMetadata outputs.

describe('SEO-01: metadata helpers', () => {
  it('layout has title template with SoulmaskBR brand first', async () => {
    const { metadata } = await import('@/app/layout')
    expect(metadata.title).toMatchObject({ template: expect.stringContaining('SoulmaskBR |') })
  })

  it('category page generateMetadata returns title and canonical', async () => {
    const { generateMetadata } = await import('@/app/wiki/[category]/page')
    const result = await generateMetadata({ params: Promise.resolve({ category: 'itens' }) })
    expect(result.title).toBeTruthy()
    expect(result.alternates?.canonical).toContain('/wiki/itens')
  })

  it('root layout openGraph images is defined', async () => {
    const { metadata } = await import('@/app/layout')
    expect(metadata.openGraph?.images).toBeDefined()
  })
})
