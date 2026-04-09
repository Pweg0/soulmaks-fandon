import { http } from './utils/http'
import { writeMdx } from './utils/mdx-writer'
import type { ScrapedContent, ScraperOptions } from './utils/types'

const FANDOM_API = 'https://soulmask.fandom.com/api.php'

/**
 * Enumerates all pages in a Fandom wiki category using the MediaWiki API.
 * Handles pagination via cmcontinue token.
 */
export async function getAllPages(cmtitle: string): Promise<string[]> {
  const pages: string[] = []
  let cmcontinue: string | undefined

  do {
    const params: Record<string, string> = {
      action: 'query',
      list: 'categorymembers',
      cmtitle,
      cmlimit: '500',
      format: 'json',
      origin: '*',
    }
    if (cmcontinue) {
      params['cmcontinue'] = cmcontinue
    }

    const response = await http.get(FANDOM_API, { params })
    const data = response.data as {
      query: { categorymembers: Array<{ title: string }> }
      continue?: { cmcontinue: string }
    }

    const members = data.query?.categorymembers ?? []
    for (const member of members) {
      pages.push(member.title)
    }

    cmcontinue = data.continue?.cmcontinue
  } while (cmcontinue)

  return pages
}

/**
 * Fetches wikitext for a given page title using the MediaWiki parse API.
 */
export async function getPageContent(title: string): Promise<string> {
  const response = await http.get(FANDOM_API, {
    params: {
      action: 'parse',
      page: title,
      prop: 'wikitext',
      format: 'json',
      origin: '*',
    },
  })
  const data = response.data as {
    parse?: { wikitext?: { '*': string } }
    error?: { info: string }
  }
  if (data.error) {
    throw new Error(`MediaWiki API error: ${data.error.info}`)
  }
  return data.parse?.wikitext?.['*'] ?? ''
}

/**
 * Generates a URL-safe slug from a wiki page title.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Converts wikitext to a simplified Markdown-compatible format.
 * Strips wiki templates, converts links, removes complex markup.
 */
function wikitextToMarkdown(wikitext: string, title: string): string {
  let text = wikitext

  // Remove infobox and complex templates (multi-line)
  text = text.replace(/\{\{[^}]*\}\}/gs, '')

  // Remove categories
  text = text.replace(/\[\[Category:[^\]]*\]\]/gi, '')

  // Convert wiki links: [[Link|Display]] -> Display, [[Link]] -> Link
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1')

  // Convert external links: [url display] -> display
  text = text.replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')

  // Convert headers: == Heading == -> ## Heading
  text = text.replace(/^====\s*(.*?)\s*====\s*$/gm, '#### $1')
  text = text.replace(/^===\s*(.*?)\s*===\s*$/gm, '### $1')
  text = text.replace(/^==\s*(.*?)\s*==\s*$/gm, '## $1')

  // Convert bold/italic
  text = text.replace(/'''(.*?)'''/g, '**$1**')
  text = text.replace(/''(.*?)''/g, '*$1*')

  // Remove remaining template artifacts
  text = text.replace(/\{\|.*?\|\}/gs, '')
  text = text.replace(/^\|.*$/gm, '')
  text = text.replace(/^!.*$/gm, '')

  // Add title as H1 if not present
  const trimmed = text.trim()
  if (!trimmed.startsWith('#')) {
    text = `# ${title}\n\n${trimmed}`
  }

  return text.trim()
}

/**
 * Transforms a page title and its wikitext into a ScrapedContent object.
 */
export function parseItemPage(
  title: string,
  wikitext: string,
  category: ScrapedContent['category'],
  sourceUrl: string
): ScrapedContent {
  const body = wikitextToMarkdown(wikitext, title)
  return {
    title,
    slug: slugify(title),
    category,
    body,
    sourceUrl,
    gameVersion: 'unknown',
  }
}

interface CategoryMap {
  fandomCategory: string
  category: ScrapedContent['category']
}

const CATEGORY_MAPPINGS: CategoryMap[] = [
  { fandomCategory: 'Category:Items', category: 'items' },
  { fandomCategory: 'Category:Masks', category: 'masks' },
  { fandomCategory: 'Category:Guides', category: 'guides' },
]

/**
 * Main Fandom scraper entry point.
 * Enumerates pages in each category, fetches content, transforms to MDX, writes to disk.
 * In dry-run mode, only enumerates and logs page titles without fetching or writing.
 */
export async function scrapeFandom(options: ScraperOptions): Promise<void> {
  console.log('Fandom scraper: starting...')
  console.log(`  Base URL: ${FANDOM_API}`)
  console.log(`  Dry run: ${options.dryRun}`)

  for (const mapping of CATEGORY_MAPPINGS) {
    console.log(`\nFandom scraper: enumerating ${mapping.fandomCategory}...`)

    let pages: string[]
    try {
      pages = await getAllPages(mapping.fandomCategory)
    } catch (err) {
      console.error(`  Failed to enumerate ${mapping.fandomCategory}:`, err)
      continue
    }

    console.log(`  Found ${pages.length} pages in ${mapping.fandomCategory}`)

    if (options.dryRun) {
      for (const title of pages.slice(0, 10)) {
        console.log(`  [dry-run] Would scrape: ${title}`)
      }
      if (pages.length > 10) {
        console.log(`  [dry-run] ... and ${pages.length - 10} more`)
      }
      continue
    }

    let scraped = 0
    let failed = 0

    for (const title of pages) {
      try {
        const wikitext = await getPageContent(title)
        if (!wikitext.trim()) {
          console.warn(`  Skipping empty page: ${title}`)
          continue
        }

        const sourceUrl = `https://soulmask.fandom.com/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
        const item = parseItemPage(title, wikitext, mapping.category, sourceUrl)
        await writeMdx(item, options.contentDir)
        scraped++
        console.log(`  Scraped: ${title} -> ${item.slug}.mdx`)
      } catch (err) {
        failed++
        console.error(`  Error scraping page "${title}":`, err instanceof Error ? err.message : err)
      }
    }

    console.log(`  ${mapping.fandomCategory}: ${scraped} scraped, ${failed} failed`)
  }

  console.log('\nFandom scraper: complete.')
}
