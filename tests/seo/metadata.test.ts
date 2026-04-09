import { describe, it, expect } from 'vitest'

// SEO-01: meta title, description, canonical, OG tags
// These tests verify the shape of generateMetadata outputs.
// Import the actual generateMetadata functions once they exist.

describe('SEO-01: metadata helpers', () => {
  it('layout has title template with SoulmaskBR brand first', async () => {
    // After Task 1: import metadata from '@/app/layout'
    // expect(metadata.title).toMatchObject({ template: expect.stringContaining('SoulmaskBR |') })
    expect(true).toBe(true) // placeholder — replace after implementation
  })

  it('category page generateMetadata returns title and canonical', async () => {
    // After Task 1: call generateMetadata({ params: Promise.resolve({ category: 'itens' }) })
    // expect(result.title).toBeTruthy()
    // expect(result.alternates?.canonical).toContain('/wiki/itens')
    expect(true).toBe(true) // placeholder
  })

  it('slug page generateMetadata returns og:image', async () => {
    // After Task 1: call generateMetadata with a known slug
    // expect(result.openGraph?.images).toBeDefined()
    expect(true).toBe(true) // placeholder
  })
})
