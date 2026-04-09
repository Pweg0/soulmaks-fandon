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
 * Known stat param names to extract from infobox into stats object.
 * All other params besides image/type/name go into stats if unrecognized.
 */
const INFOBOX_STAT_PARAMS = new Set([
  'weight', 'damage', 'durability', 'defense', 'speed', 'range',
  'armor', 'hp', 'stamina', 'attack', 'magic', 'fire_damage',
  'water_damage', 'earth_damage', 'wind_damage', 'critical',
])

/**
 * Extracts structured data from Fandom wikitext infobox templates.
 * Supports {{Infobox item|...}}, {{Infobox mask|...}}, {{Item|...}}, etc.
 * Must be called before wikitextToMarkdown strips the templates.
 *
 * Returns a partial ScrapedContent with only the fields that were found.
 */
export function extractInfobox(wikitext: string): Partial<Pick<ScrapedContent, 'image' | 'stats' | 'crafting' | 'location' | 'tier' | 'tags'>> {
  const result: Partial<Pick<ScrapedContent, 'image' | 'stats' | 'crafting' | 'location' | 'tier' | 'tags'>> = {}

  // Match infobox template — handles {{Infobox item|...}} and similar patterns
  // Uses a regex that captures everything up to the closing }}
  const infoboxMatch = wikitext.match(/\{\{(?:Infobox\s+\w+|Item|Mask|Tool|Weapon|Armor|Resource)\s*\|([^}]+)\}\}/i)

  if (!infoboxMatch) {
    return result
  }

  const paramString = infoboxMatch[1]

  // Parse |key=value pairs
  const params: Record<string, string> = {}
  const paramParts = paramString.split('|')
  for (const part of paramParts) {
    const eqIdx = part.indexOf('=')
    if (eqIdx === -1) continue
    const key = part.slice(0, eqIdx).trim().toLowerCase()
    const value = part.slice(eqIdx + 1).trim()
    if (key && value) {
      params[key] = value
    }
  }

  // Extract image
  if (params['image']) {
    result.image = params['image']
  }

  // Extract tier/rarity
  if (params['tier'] || params['rarity']) {
    result.tier = params['tier'] ?? params['rarity']
  }

  // Extract stats from known param names and any numeric values
  const stats: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(params)) {
    if (key === 'image' || key === 'name' || key === 'type' || key === 'tier' || key === 'rarity') {
      continue
    }
    if (INFOBOX_STAT_PARAMS.has(key) || /^\d+(\.\d+)?$/.test(value)) {
      stats[key] = value
    }
  }
  if (Object.keys(stats).length > 0) {
    result.stats = stats
  }

  // Extract location from == Location == or == Found in == sections
  const locationMatch = wikitext.match(/==\s*(?:Location|Found in|Locations)\s*==\s*\n([\s\S]*?)(?:\n==|$)/i)
  if (locationMatch) {
    const locationText = locationMatch[1]
    const locations = locationText
      .split('\n')
      .map((line) => line.replace(/^[*#\s-]+/, '').trim())
      .filter((line) => line.length > 0 && !line.startsWith('{{') && !line.startsWith('[['))
    if (locations.length > 0) {
      result.location = locations
    }
  }

  return result
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
 * Extracts structured data from infobox BEFORE stripping templates.
 */
export function parseItemPage(
  title: string,
  wikitext: string,
  category: ScrapedContent['category'],
  sourceUrl: string
): ScrapedContent {
  // Extract infobox data first, before templates are stripped
  const infoboxData = extractInfobox(wikitext)
  const body = wikitextToMarkdown(wikitext, title)
  return {
    title,
    slug: slugify(title),
    category,
    body,
    sourceUrl,
    gameVersion: 'unknown',
    ...infoboxData,
  }
}

interface CategoryMap {
  fandomCategory: string
  category: ScrapedContent['category']
}

const CATEGORY_MAPPINGS: CategoryMap[] = [
  // Equipamento
  { fandomCategory: 'Category:Weapons', category: 'weapons' },
  { fandomCategory: 'Category:Armor', category: 'armor' },
  { fandomCategory: 'Category:Shields', category: 'shields' },
  { fandomCategory: 'Category:Tools', category: 'tools' },
  { fandomCategory: 'Category:Item Mod', category: 'item-mods' },
  // Itens & Recursos
  { fandomCategory: 'Category:Items', category: 'items' },
  { fandomCategory: 'Category:Crystals', category: 'crystals' },
  { fandomCategory: 'Category:Minerals', category: 'minerals' },
  { fandomCategory: 'Category:Food', category: 'food' },
  { fandomCategory: 'Category:Medicines', category: 'medicines' },
  { fandomCategory: 'Category:Ammo', category: 'ammo' },
  // Máscaras
  { fandomCategory: 'Category:Masks', category: 'masks' },
  { fandomCategory: 'Category:Proficiencies', category: 'proficiencies' },
  // Construção
  { fandomCategory: 'Category:Buildings', category: 'buildings' },
  { fandomCategory: 'Category:Furniture', category: 'furniture' },
  { fandomCategory: 'Category:Workbenches', category: 'workbenches' },
  // Mundo
  { fandomCategory: 'Category:Creatures', category: 'creatures' },
  { fandomCategory: 'Category:Bosses', category: 'bosses' },
  { fandomCategory: 'Category:Locations', category: 'locations' },
  // Guias
  { fandomCategory: 'Category:Guides', category: 'guides' },
]

/**
 * Fetches the main image URL for a wiki page via the MediaWiki pageimages API.
 * Returns null if no image is found.
 */
async function getPageImage(title: string): Promise<string | null> {
  try {
    const response = await http.get(FANDOM_API, {
      params: {
        action: 'query',
        titles: title,
        prop: 'pageimages',
        format: 'json',
        pithumbsize: 300,
        origin: '*',
      },
    })
    const data = response.data as {
      query: { pages: Record<string, { thumbnail?: { source: string } }> }
    }
    const pages = data.query?.pages ?? {}
    const page = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

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

        // Fetch image via pageimages API if not already found from infobox
        if (!item.image) {
          const imageUrl = await getPageImage(title)
          if (imageUrl) {
            item.image = imageUrl
          }
        }
        await writeMdx(item, options.contentDir, { skipExisting: options.skipExisting })
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
