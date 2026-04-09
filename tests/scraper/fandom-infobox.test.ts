import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

/**
 * Tests for extractInfobox and expanded scraper functionality (D-07, D-08)
 */

describe('extractInfobox', () => {
  it('Test 1: parses basic infobox with image and weight', async () => {
    const { extractInfobox } = await import('../../scripts/scraper/fandom')
    const wikitext = '{{Infobox item|image=Bloodstone.png|weight=0.5}}'
    const result = extractInfobox(wikitext)
    expect(result.image).toBe('Bloodstone.png')
    expect(result.stats).toBeDefined()
    expect(result.stats!['weight']).toBe('0.5')
  })

  it('Test 2: returns empty object for wikitext with no infobox', async () => {
    const { extractInfobox } = await import('../../scripts/scraper/fandom')
    const wikitext = '== Description ==\nThis is an item in Soulmask.'
    const result = extractInfobox(wikitext)
    expect(result.image).toBeUndefined()
    expect(result.stats).toBeUndefined()
    expect(result.crafting).toBeUndefined()
  })

  it('Test 3: parseItemPage with infobox wikitext produces ScrapedContent with stats and image', async () => {
    const { parseItemPage } = await import('../../scripts/scraper/fandom')
    const wikitext = `{{Infobox item|image=IronOre.png|weight=1.5|damage=50}}
== Description ==
Iron Ore is a basic crafting material.
`
    const result = parseItemPage(
      'Iron Ore',
      wikitext,
      'items',
      'https://soulmask.fandom.com/wiki/Iron_Ore'
    )
    expect(result.image).toBe('IronOre.png')
    expect(result.stats).toBeDefined()
    expect(result.stats!['weight']).toBe('1.5')
    expect(result.stats!['damage']).toBe('50')
  })
})

describe('writeMdx expanded frontmatter', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scraper-infobox-test-'))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('Test 4: writeMdx writes expanded frontmatter fields (tags, tier, stats, crafting, location)', async () => {
    const { writeMdx } = await import('../../scripts/scraper/utils/mdx-writer')
    const item = {
      title: 'Bloodstone',
      slug: 'bloodstone',
      category: 'items' as const,
      body: '# Bloodstone\nA red stone.',
      sourceUrl: 'https://soulmask.fandom.com/wiki/Bloodstone',
      tags: ['recurso', 'mineral'],
      tier: 'comum',
      image: 'Bloodstone.png',
      stats: { peso: '0.5', durability: '100' },
      crafting: [{ item: 'Iron Ore', quantity: 2 }],
      location: ['Holy Ruins', 'Ancient Ruins Dungeon'],
    }
    const filePath = await writeMdx(item, tmpDir)
    const content = await fs.readFile(filePath, 'utf-8')
    const { data } = matter(content)

    expect(data.tags).toEqual(['recurso', 'mineral'])
    expect(data.tier).toBe('comum')
    expect(data.image).toBe('Bloodstone.png')
    expect(data.stats).toEqual({ peso: '0.5', durability: '100' })
    expect(data.crafting).toEqual([{ item: 'Iron Ore', quantity: 2 }])
    expect(data.location).toEqual(['Holy Ruins', 'Ancient Ruins Dungeon'])
  })
})

describe('scraper --skip-existing flag', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scraper-skip-test-'))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('Test 5: writeMdx with skipExisting=true does not overwrite existing file', async () => {
    const { writeMdx } = await import('../../scripts/scraper/utils/mdx-writer')
    const item = {
      title: 'Iron Ore',
      slug: 'iron-ore',
      category: 'items' as const,
      body: '# Iron Ore\nOriginal content.',
      sourceUrl: 'https://soulmask.fandom.com/wiki/Iron_Ore',
    }

    // First write
    const filePath = await writeMdx(item, tmpDir)
    const originalContent = await fs.readFile(filePath, 'utf-8')

    // Second write with skipExisting=true — should NOT overwrite
    const modifiedItem = { ...item, body: '# Iron Ore\nModified content.' }
    await writeMdx(modifiedItem, tmpDir, { skipExisting: true })
    const contentAfter = await fs.readFile(filePath, 'utf-8')

    expect(contentAfter).toBe(originalContent)
  })
})
