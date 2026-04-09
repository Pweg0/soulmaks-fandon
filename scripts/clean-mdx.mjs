/**
 * Cleans MDX files of invalid HTML that breaks the MDX compiler.
 * Converts or strips HTML tags to valid Markdown/MDX.
 *
 * Usage: node scripts/clean-mdx.mjs
 */
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function cleanHtml(text) {
  // Replace <br>, <br/>, <br /> with newlines
  text = text.replace(/<br\s*\/?>/gi, '\n')

  // Remove self-closing HTML tags that MDX doesn't like
  text = text.replace(/<hr\s*\/?>/gi, '\n---\n')

  // Remove inline HTML tags (div, span, p, etc.)
  text = text.replace(/<\/?(div|span|p|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|caption|colgroup|col|section|article|aside|header|footer|nav|main|figure|figcaption|details|summary|mark|small|big|sub|sup|abbr|cite|code|pre|blockquote|dl|dt|dd|em|strong|b|i|u|s|del|ins)[^>]*>/gi, '')

  // Remove img tags (convert to text if alt exists)
  text = text.replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '[$1]')
  text = text.replace(/<img[^>]*>/gi, '')

  // Remove script/style tags and their content
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '')

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // Remove heading HTML tags (use markdown instead)
  text = text.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, level, content) => {
    return '#'.repeat(parseInt(level)) + ' ' + content.trim()
  })

  // Remove anchor tags, keep text
  text = text.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')

  // Remove any remaining < > that aren't markdown/JSX-safe
  // Only remove standalone < that aren't part of JSX components (uppercase)
  // and aren't markdown escape sequences
  text = text.replace(/<([a-z][a-z0-9]*)[^>]*>/gi, (match, tag) => {
    // Keep valid self-closing JSX tags
    if (match.endsWith('/>')) return match
    // Remove unknown HTML tags
    const validTags = ['br']
    if (validTags.includes(tag.toLowerCase())) return ''
    return ''
  })

  // Clean up closing tags for removed elements
  text = text.replace(/<\/[a-z][a-z0-9]*>/gi, '')

  // Fix double curly braces that might break MDX (template expressions)
  text = text.replace(/\{\{[^}]*\}\}/g, '')

  // Clean up excessive blank lines (more than 2 in a row)
  text = text.replace(/\n{4,}/g, '\n\n\n')

  // Clean up lines that are just whitespace
  text = text.replace(/^\s+$/gm, '')

  return text
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')

  // Split frontmatter and body
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return false

  const frontmatter = match[1]
  let body = match[2]

  const cleaned = cleanHtml(body)
  if (cleaned === body) return false // no changes

  fs.writeFileSync(filePath, `---\n${frontmatter}\n---\n${cleaned}`, 'utf-8')
  return true
}

function main() {
  console.log('=== SoulmaskBR MDX Cleaner ===\n')

  let cleaned = 0
  let skipped = 0

  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat)
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))
    let catCleaned = 0

    for (const file of files) {
      try {
        const result = processFile(path.join(catDir, file))
        if (result) {
          catCleaned++
          cleaned++
        } else {
          skipped++
        }
      } catch (err) {
        console.error(`  ✗ ${cat}/${file}: ${err.message}`)
      }
    }

    if (catCleaned > 0) {
      console.log(`  [${cat}] ${catCleaned} cleaned`)
    }
  }

  console.log(`\n=== COMPLETE ===`)
  console.log(`Cleaned: ${cleaned}`)
  console.log(`Unchanged: ${skipped}`)
}

main()
