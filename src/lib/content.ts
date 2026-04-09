/**
 * MDX file system reading utilities for SoulmaskBR wiki
 * Server-side only — no 'use client'
 * Pattern 1 from 02-RESEARCH.md
 */

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { ItemFrontmatter, ContentItem } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Reads all MDX files from content/{category}/ and returns typed frontmatter objects.
 * Sorted by title A-Z.
 *
 * @param category - Filesystem directory name (e.g., 'items', 'masks', 'guides', 'patches')
 * @param publishedOnly - When true (default), only returns items with published: true
 */
export async function getAllContent(
  category: string,
  publishedOnly = true
): Promise<ContentItem[]> {
  const dir = path.join(CONTENT_DIR, category)
  let files: string[]
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }

  const items = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), 'utf-8')
        const { data, content } = matter(raw)
        const frontmatter = data as ItemFrontmatter
        return {
          frontmatter,
          content,
          slug: frontmatter.slug ?? f.replace(/\.mdx$/, ''),
        } satisfies ContentItem
      })
  )

  const filtered = publishedOnly ? items.filter((i) => i.frontmatter.published) : items

  return filtered.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'pt-BR'))
}

/**
 * Reads a single MDX file from content/{category}/{slug}.mdx
 * Returns frontmatter + raw MDX body, or null if not found.
 *
 * @param category - Filesystem directory name (e.g., 'items', 'masks')
 * @param slug - The slug identifier (filename without .mdx)
 */
export async function getContentBySlug(
  category: string,
  slug: string
): Promise<ContentItem | null> {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const frontmatter = data as ItemFrontmatter
    return {
      frontmatter,
      content,
      slug: frontmatter.slug ?? slug,
    }
  } catch {
    return null
  }
}

/**
 * Returns unique subcategory values from all MDX files in content/{category}/
 * Useful for filter tab generation.
 *
 * @param category - Filesystem directory name (e.g., 'items', 'masks')
 */
export async function getContentCategories(category: string): Promise<string[]> {
  const all = await getAllContent(category, false)
  const subcategories = all
    .map((item) => item.frontmatter.subcategory)
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
  return [...new Set(subcategories)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
