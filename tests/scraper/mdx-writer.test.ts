import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeMdx } from '../../scripts/scraper/utils/mdx-writer'
import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

describe('writeMdx', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scraper-test-'))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('creates MDX file with correct frontmatter', async () => {
    const item = { title: 'Iron Ore', slug: 'iron-ore', category: 'items' as const, body: '# Iron Ore\nContent here', sourceUrl: 'https://soulmask.fandom.com/wiki/Iron_Ore' }
    const filePath = await writeMdx(item, tmpDir)
    const content = await fs.readFile(filePath, 'utf-8')
    const { data } = matter(content)
    expect(data.title).toBe('Iron Ore')
    expect(data.slug).toBe('iron-ore')
    expect(data.category).toBe('items')
    expect(data.published).toBe(false)
    expect(data.sourceUrl).toBe('https://soulmask.fandom.com/wiki/Iron_Ore')
  })

  it('creates parent directory if missing', async () => {
    const item = { title: 'Test', slug: 'test', category: 'masks' as const, body: 'body', sourceUrl: 'https://example.com' }
    await writeMdx(item, tmpDir)
    const stat = await fs.stat(path.join(tmpDir, 'masks'))
    expect(stat.isDirectory()).toBe(true)
  })

  it('frontmatter is parseable by gray-matter', async () => {
    const item = { title: 'Test Item', slug: 'test-item', category: 'items' as const, body: '# Test', sourceUrl: 'https://example.com', gameVersion: '0.7.x' }
    const filePath = await writeMdx(item, tmpDir)
    const content = await fs.readFile(filePath, 'utf-8')
    const { data, content: mdxBody } = matter(content)
    expect(data.gameVersion).toBe('0.7.x')
    expect(mdxBody.trim()).toBe('# Test')
  })

  it('always sets published to false', async () => {
    const item = { title: 'Mask', slug: 'mask', category: 'masks' as const, body: 'body', sourceUrl: 'https://example.com' }
    const filePath = await writeMdx(item, tmpDir)
    const { data } = matter(await fs.readFile(filePath, 'utf-8'))
    expect(data.published).toBe(false)
  })
})
