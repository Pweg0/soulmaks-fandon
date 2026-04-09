#!/usr/bin/env npx tsx
import { scrapeFandom } from './fandom'
import { scrapeWikiGG } from './wikigg'
import type { ScraperOptions } from './utils/types'
import path from 'path'
import { fileURLToPath } from 'url'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const fandomOnly = args.includes('--fandom-only')
const skipExisting = args.includes('--skip-existing')

// Support both CommonJS (__dirname) and ESM (import.meta.url) environments
const scriptDir = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url))

const contentDir = path.resolve(scriptDir, '../../content')

const options: ScraperOptions = {
  dryRun,
  contentDir,
  delayMs: 1500,
  skipExisting,
}

async function main() {
  console.log(`Scraper starting... (dry-run: ${dryRun})`)
  console.log(`Content directory: ${contentDir}`)

  console.log('\n--- Fandom Wiki ---')
  await scrapeFandom(options)

  if (!fandomOnly) {
    console.log('\n--- wiki.gg ---')
    await scrapeWikiGG(options)
  }

  console.log('\nScraping complete.')
}

main().catch((err) => {
  console.error('Scraper failed:', err)
  process.exit(1)
})
