import type { MetadataRoute } from 'next'
import { getAllContent } from '@/lib/content'
import { CATEGORY_MAP } from '@/types/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/wiki`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/wiki/patch-notes`, changeFrequency: 'weekly', priority: 0.8 },
    ...Object.keys(CATEGORY_MAP)
      .filter((cat) => cat !== 'patch-notes')
      .map((cat) => ({
        url: `${BASE_URL}/wiki/${cat}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
  ]

  const contentRoutes: MetadataRoute.Sitemap = []

  // Enumerate non-patch categories — filter out 'patch-notes' since patches have different URL pattern
  for (const [urlSegment, fsDir] of Object.entries(CATEGORY_MAP).filter(
    ([seg]) => seg !== 'patch-notes'
  )) {
    const items = await getAllContent(fsDir, true) // published only
    for (const item of items) {
      contentRoutes.push({
        url: `${BASE_URL}/wiki/${urlSegment}/${item.slug}`,
        lastModified: item.frontmatter.lastScrapedAt
          ? new Date(item.frontmatter.lastScrapedAt)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // Patch notes from dedicated directory — URL pattern is /wiki/patch-notes/[slug]
  const patches = await getAllContent('patches', true) // published only
  for (const patch of patches) {
    const patchFm = patch.frontmatter as { date?: string }
    contentRoutes.push({
      url: `${BASE_URL}/wiki/patch-notes/${patch.slug}`,
      lastModified: patchFm.date ? new Date(patchFm.date + 'T00:00:00') : new Date(),
      changeFrequency: 'never',
      priority: 0.6,
    })
  }

  return [...staticRoutes, ...contentRoutes]
}
