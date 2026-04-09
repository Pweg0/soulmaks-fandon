import { http } from './utils/http'
import { writeMdx } from './utils/mdx-writer'
import type { ScraperOptions } from './utils/types'
import * as cheerio from 'cheerio'

const WIKIGG_BASE = 'https://soulmask.wiki.gg'
const ROBOTS_URL = `${WIKIGG_BASE}/robots.txt`

// Known key pages to scrape from wiki.gg as primary seed list
const KNOWN_PAGES = [
  `${WIKIGG_BASE}/wiki/Soulmask_Wiki`,
  `${WIKIGG_BASE}/wiki/Getting_Started`,
  `${WIKIGG_BASE}/wiki/Masks`,
  `${WIKIGG_BASE}/wiki/Items`,
  `${WIKIGG_BASE}/wiki/Combat`,
  `${WIKIGG_BASE}/wiki/Crafting`,
  `${WIKIGG_BASE}/wiki/Tribes`,
  `${WIKIGG_BASE}/wiki/Bosses`,
  `${WIKIGG_BASE}/wiki/Resources`,
  `${WIKIGG_BASE}/wiki/Exploration`,
]

/**
 * Checks robots.txt to determine if scraping is permitted.
 * Returns true if scraping is allowed for our User-Agent.
 */
async function checkRobotsAllowed(): Promise<boolean> {
  try {
    console.log('wiki.gg scraper: checking robots.txt...')
    const response = await http.get(ROBOTS_URL, { timeout: 10000 })
    const robotsTxt = response.data as string

    // Look for Disallow rules that would block our bot or all bots
    const lines = robotsTxt.split('\n')
    let currentAgent = ''
    let disallowAll = false

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('User-agent:')) {
        currentAgent = trimmed.replace('User-agent:', '').trim()
      } else if (trimmed.startsWith('Disallow:')) {
        const path = trimmed.replace('Disallow:', '').trim()
        if ((currentAgent === '*' || currentAgent.toLowerCase().includes('bot')) && path === '/') {
          disallowAll = true
        }
      }
    }

    if (disallowAll) {
      console.warn('wiki.gg scraper: robots.txt disallows scraping. Skipping wiki.gg.')
      return false
    }

    console.log('wiki.gg scraper: robots.txt allows scraping. Proceeding...')
    return true
  } catch (err) {
    console.warn('wiki.gg scraper: could not fetch robots.txt, proceeding with caution:', err instanceof Error ? err.message : err)
    return true
  }
}

/**
 * Extracts text content from a wiki.gg HTML page using Cheerio.
 */
function extractPageContent(html: string, url: string): { title: string; body: string } | null {
  const $ = cheerio.load(html)

  // wiki.gg uses MediaWiki-style HTML structure
  const title = $('h1.page-header__title, h1#firstHeading, h1').first().text().trim()
  if (!title) return null

  // Get main content area
  const contentEl = $('#mw-content-text, .mw-parser-output, .page-content').first()
  if (!contentEl.length) return null

  // Remove navigation, infoboxes, and metadata elements
  contentEl.find('.navbox, .toc, .infobox, .ambox, .catlinks, .printfooter, script, style').remove()

  // Convert to simple text/markdown
  let body = `# ${title}\n\n`
  body += contentEl.text().replace(/\n{3,}/g, '\n\n').trim()

  return { title, body }
}

/**
 * wiki.gg scraper entry point.
 * Checks robots.txt first, then scrapes known key pages using Cheerio.
 * This is intentionally minimal — Fandom is the primary source.
 */
export async function scrapeWikiGG(options: ScraperOptions): Promise<void> {
  console.log('wiki.gg scraper: starting...')

  const allowed = await checkRobotsAllowed()
  if (!allowed) {
    console.log('wiki.gg scraper: skipped due to robots.txt restriction.')
    return
  }

  if (options.dryRun) {
    console.log(`wiki.gg scraper: [dry-run] would scrape ${KNOWN_PAGES.length} known pages`)
    for (const url of KNOWN_PAGES) {
      console.log(`  [dry-run] Would scrape: ${url}`)
    }
    return
  }

  let scraped = 0
  let failed = 0

  for (const url of KNOWN_PAGES) {
    try {
      console.log(`wiki.gg scraper: fetching ${url}`)
      const response = await http.get(url, { timeout: 15000 })
      const result = extractPageContent(response.data as string, url)

      if (!result) {
        console.warn(`  Could not extract content from: ${url}`)
        failed++
        continue
      }

      const slug = result.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      await writeMdx(
        {
          title: result.title,
          slug,
          category: 'guides',
          body: result.body,
          sourceUrl: url,
          gameVersion: 'unknown',
        },
        options.contentDir
      )
      scraped++
      console.log(`  Scraped: ${result.title} -> ${slug}.mdx`)
    } catch (err) {
      failed++
      console.error(`  Error scraping ${url}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`wiki.gg scraper: ${scraped} scraped, ${failed} failed.`)
}
