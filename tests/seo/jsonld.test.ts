import { describe, it, expect } from 'vitest'
import {
  videoGameSchema,
  breadcrumbSchema,
  articleSchema,
  webPageSchema,
} from '@/lib/jsonld'

// SEO-03: JSON-LD structured data helpers
// These tests verify the shape of jsonld.ts helper outputs.

describe('SEO-03: JSON-LD helpers', () => {
  it('videoGameSchema returns valid @type VideoGame object', () => {
    const schema = videoGameSchema()
    expect(schema['@type']).toBe('VideoGame')
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema.name).toBe('Soulmask')
  })

  it('breadcrumbSchema returns itemListElement with correct positions', () => {
    const schema = breadcrumbSchema([{ name: 'Home', url: 'https://soulmaskbr.com' }])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[0].name).toBe('Home')
  })

  it('articleSchema returns @type Article with headline', () => {
    const schema = articleSchema('Guia', 'desc', 'https://soulmaskbr.com/wiki/guias/guia')
    expect(schema['@type']).toBe('Article')
    expect(schema.headline).toBe('Guia')
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('webPageSchema returns @type WebPage with name and url', () => {
    const schema = webPageSchema('Itens & Crafting', 'https://soulmaskbr.com/wiki/itens')
    expect(schema['@type']).toBe('WebPage')
    expect(schema.name).toBe('Itens & Crafting')
    expect(schema.url).toBe('https://soulmaskbr.com/wiki/itens')
  })
})
