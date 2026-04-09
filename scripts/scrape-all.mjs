/**
 * Standalone scraper — runs with plain Node.js (no tsx/esbuild needed).
 * Usage: node scripts/scrape-all.mjs
 */
import https from 'https'
import fs from 'fs'
import path from 'path'

const FANDOM_API = 'https://soulmask.fandom.com/api.php'
const CONTENT_DIR = path.join(process.cwd(), 'content')
const DELAY_MS = 1500

const CATEGORY_MAPPINGS = [
  { fandom: 'Category:Weapons', dir: 'weapons' },
  { fandom: 'Category:Armor', dir: 'armor' },
  { fandom: 'Category:Shields', dir: 'shields' },
  { fandom: 'Category:Tools', dir: 'tools' },
  { fandom: 'Category:Item Mod', dir: 'item-mods' },
  { fandom: 'Category:Crystals', dir: 'crystals' },
  { fandom: 'Category:Minerals', dir: 'minerals' },
  { fandom: 'Category:Food', dir: 'food' },
  { fandom: 'Category:Medicines', dir: 'medicines' },
  { fandom: 'Category:Ammo', dir: 'ammo' },
  { fandom: 'Category:Proficiencies', dir: 'proficiencies' },
  { fandom: 'Category:Buildings', dir: 'buildings' },
  { fandom: 'Category:Furniture', dir: 'furniture' },
  { fandom: 'Category:Workbenches', dir: 'workbenches' },
  { fandom: 'Category:Creatures', dir: 'creatures' },
  { fandom: 'Category:Bosses', dir: 'bosses' },
  { fandom: 'Category:Locations', dir: 'locations' },
]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SoulmaskBR-Wiki-Bot/1.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`JSON parse failed: ${data.slice(0, 200)}`)) }
      })
    }).on('error', reject)
  })
}

async function getAllPages(cmtitle) {
  const pages = []
  let cmcontinue = ''
  do {
    const params = new URLSearchParams({
      action: 'query', list: 'categorymembers', cmtitle,
      cmlimit: '500', format: 'json', origin: '*',
    })
    if (cmcontinue) params.set('cmcontinue', cmcontinue)
    const data = await fetchJSON(`${FANDOM_API}?${params}`)
    const members = data?.query?.categorymembers ?? []
    for (const m of members) pages.push(m.title)
    cmcontinue = data?.continue?.cmcontinue || ''
    if (cmcontinue) await sleep(DELAY_MS)
  } while (cmcontinue)
  return pages
}

async function getPageContent(title) {
  const params = new URLSearchParams({
    action: 'parse', page: title, prop: 'wikitext',
    format: 'json', origin: '*',
  })
  const data = await fetchJSON(`${FANDOM_API}?${params}`)
  return data?.parse?.wikitext?.['*'] ?? ''
}

async function getPageImage(title) {
  const params = new URLSearchParams({
    action: 'query', titles: title, prop: 'pageimages',
    format: 'json', pithumbsize: '300', origin: '*',
  })
  const data = await fetchJSON(`${FANDOM_API}?${params}`)
  const pages = data?.query?.pages ?? {}
  const page = Object.values(pages)[0]
  return page?.thumbnail?.source ?? null
}

function slugify(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function wikitextToMarkdown(wikitext, title) {
  let text = wikitext
  // Remove infobox templates
  text = text.replace(/\{\{[^}]*\}\}/gs, '')
  // Remove categories
  text = text.replace(/\[\[Category:[^\]]*\]\]/gi, '')
  // Convert wiki links
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1')
  // Convert external links
  text = text.replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
  // Convert headers
  text = text.replace(/^====\s*(.*?)\s*====\s*$/gm, '#### $1')
  text = text.replace(/^===\s*(.*?)\s*===\s*$/gm, '### $1')
  text = text.replace(/^==\s*(.*?)\s*==\s*$/gm, '## $1')
  // Convert bold/italic
  text = text.replace(/'''(.*?)'''/g, '**$1**')
  text = text.replace(/''(.*?)''/g, '*$1*')
  // Remove table artifacts
  text = text.replace(/\{\|.*?\|\}/gs, '')
  text = text.replace(/^\|.*$/gm, '')
  text = text.replace(/^!.*$/gm, '')
  // Add title
  const trimmed = text.trim()
  if (!trimmed.startsWith('#')) text = `# ${title}\n\n${trimmed}`
  return text.trim()
}

function writeMdx(slug, category, title, body, sourceUrl, image) {
  const dir = path.join(CONTENT_DIR, category)
  fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${slug}.mdx`)

  // Skip existing files (don't overwrite translated content)
  if (fs.existsSync(filePath)) return false

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `category: "${category}"`,
    `gameVersion: "unknown"`,
    `lastScrapedAt: "${new Date().toISOString().split('T')[0]}"`,
    `sourceUrl: "${sourceUrl}"`,
    `published: false`,
  ]
  if (image) frontmatter.push(`image: "${image}"`)
  frontmatter.push('---', '', body)

  fs.writeFileSync(filePath, frontmatter.join('\n'), 'utf-8')
  return true
}

async function main() {
  console.log('=== SoulmaskBR Massive Scraper ===\n')
  let totalScraped = 0
  let totalSkipped = 0
  let totalFailed = 0

  for (const mapping of CATEGORY_MAPPINGS) {
    console.log(`\n[${mapping.dir}] Enumerating ${mapping.fandom}...`)

    let pages
    try {
      pages = await getAllPages(mapping.fandom)
    } catch (err) {
      console.error(`  FAILED to enumerate: ${err.message}`)
      continue
    }
    console.log(`  Found ${pages.length} pages`)

    let scraped = 0, skipped = 0, failed = 0

    for (const title of pages) {
      // Skip category/meta pages
      if (title.startsWith('Category:')) continue

      const slug = slugify(title)
      const filePath = path.join(CONTENT_DIR, mapping.dir, `${slug}.mdx`)
      if (fs.existsSync(filePath)) {
        skipped++
        continue
      }

      try {
        await sleep(DELAY_MS)
        const wikitext = await getPageContent(title)
        if (!wikitext.trim()) { skipped++; continue }

        const body = wikitextToMarkdown(wikitext, title)
        const sourceUrl = `https://soulmask.fandom.com/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

        // Fetch image
        const image = await getPageImage(title)

        const written = writeMdx(slug, mapping.dir, title, body, sourceUrl, image)
        if (written) {
          scraped++
          console.log(`  ✓ ${title} -> ${slug}.mdx${image ? ' (with image)' : ''}`)
        } else {
          skipped++
        }
      } catch (err) {
        failed++
        console.error(`  ✗ ${title}: ${err.message}`)
      }
    }

    console.log(`  Result: ${scraped} scraped, ${skipped} skipped, ${failed} failed`)
    totalScraped += scraped
    totalSkipped += skipped
    totalFailed += failed
  }

  console.log(`\n=== COMPLETE ===`)
  console.log(`Total: ${totalScraped} scraped, ${totalSkipped} skipped, ${totalFailed} failed`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
