import fs from 'fs/promises'
import path from 'path'
import type { ScrapedContent } from './types'

export interface WriteMdxOptions {
  /** When true, skip writing if the MDX file already exists on disk */
  skipExisting?: boolean
}

export async function writeMdx(
  item: ScrapedContent,
  contentDir: string,
  options: WriteMdxOptions = {}
): Promise<string> {
  const dir = path.join(contentDir, item.category)
  await fs.mkdir(dir, { recursive: true })

  const filePath = path.join(dir, `${item.slug}.mdx`)

  // Respect --skip-existing flag: protect manually edited content
  if (options.skipExisting) {
    try {
      await fs.access(filePath)
      // File exists — skip without overwriting
      return filePath
    } catch {
      // File doesn't exist — proceed with write
    }
  }

  const lines: string[] = [
    '---',
    `title: "${item.title}"`,
    `slug: "${item.slug}"`,
    `category: "${item.category}"`,
    ...(item.subcategory ? [`subcategory: "${item.subcategory}"`] : []),
    `gameVersion: "${item.gameVersion ?? 'unknown'}"`,
    `lastScrapedAt: "${new Date().toISOString().split('T')[0]}"`,
    `sourceUrl: "${item.sourceUrl}"`,
    `published: false`,
  ]

  // Phase 2 expanded fields (only write if defined and non-empty)
  if (item.tags && item.tags.length > 0) {
    lines.push(`tags: [${item.tags.map((t) => `"${t}"`).join(', ')}]`)
  }

  if (item.tier) {
    lines.push(`tier: "${item.tier}"`)
  }

  if (item.difficulty) {
    lines.push(`difficulty: "${item.difficulty}"`)
  }

  if (item.image) {
    lines.push(`image: "${item.image}"`)
  }

  if (item.stats && Object.keys(item.stats).length > 0) {
    lines.push('stats:')
    for (const [key, value] of Object.entries(item.stats)) {
      lines.push(`  ${key}: "${value}"`)
    }
  }

  if (item.crafting && item.crafting.length > 0) {
    lines.push('crafting:')
    for (const recipe of item.crafting) {
      lines.push(`  - item: "${recipe.item}"`)
      lines.push(`    quantity: ${recipe.quantity}`)
    }
  }

  if (item.location && item.location.length > 0) {
    lines.push('location:')
    for (const loc of item.location) {
      lines.push(`  - "${loc}"`)
    }
  }

  lines.push('---', '', item.body)

  const frontmatter = lines.join('\n')
  await fs.writeFile(filePath, frontmatter, 'utf-8')
  return filePath
}
