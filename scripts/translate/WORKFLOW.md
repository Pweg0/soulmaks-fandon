# Translation Workflow — SoulmaskBR

## Overview

Per D-09: All wiki content follows an AI draft + manual review pipeline before publication.
Content scraped from Fandom/wiki.gg is in English. This workflow transforms it into high-quality
Brazilian Portuguese content for the SoulmaskBR portal.

## Steps

### 1. Scrape (Automated)

- Run `npm run scrape` to fetch English content from Fandom/wiki.gg
- Output: MDX files in `content/{category}/` with `published: false`
- All files default to `published: false` — nothing goes live until reviewed

### 2. AI Draft Translation (Semi-automated)

- Feed scraped MDX content to AI (Claude, GPT, etc.) for pt-BR translation
- AI translates body content while preserving MDX frontmatter structure
- AI output replaces the English body in the MDX file
- The `published` field remains `false`

**Prompt template for AI translation:**

```
Translate the following Soulmask wiki content from English to Brazilian Portuguese (pt-BR).
Preserve all MDX formatting (headers, bold, italic, lists).
Use natural Brazilian Portuguese gaming terminology.
Keep proper nouns (item names, skill names) in English unless a well-known pt-BR term exists.
Do not translate the YAML frontmatter fields (title, slug, category, etc.).

[paste MDX content here]
```

### 3. Manual Review (Human)

- Reviewer opens the translated MDX file in any text editor
- Checks for:
  - Translation accuracy and naturalness in pt-BR
  - Gaming terminology consistency (use Brazilian gaming community terms)
  - SEO-friendly title and description
  - Correct frontmatter fields (title, slug, category, sourceUrl)
  - Factual accuracy against the source wiki page (sourceUrl field)
- Makes corrections as needed directly in the MDX file

### 4. Publish (Human)

- Reviewer sets `published: true` in frontmatter
- Commits and pushes to git — Vercel rebuilds with ISR
- Content becomes visible on the site

## Frontmatter Schema

```yaml
title: "Nome do Item"          # Portuguese title (translated)
slug: "nome-do-item"           # URL-safe identifier (keep original slug)
category: "items"              # items | masks | guides | patches
subcategory: "resources"       # optional subcategory
gameVersion: "0.7.x"           # game version when scraped
lastScrapedAt: "2026-04-08"    # date of last scrape
sourceUrl: "https://soulmask.fandom.com/wiki/..."  # original source
published: false               # Set to true only after manual review
```

## Status Tracking

- `published: false` = Not yet reviewed — won't appear on site
- `published: true` = Reviewed and approved for display

## File Locations

```
content/
├── items/      # Game items (resources, weapons, armor, food, etc.)
├── masks/      # Masks/skills system
├── guides/     # How-to guides and tutorials
└── patches/    # Patch notes and game updates
```

## Running the Scraper

```bash
# Dry run — lists pages without writing files
npm run scrape:dry

# Full scrape — fetches and writes MDX files
npm run scrape

# Fandom only (skip wiki.gg)
npx tsx scripts/scraper/index.ts --fandom-only
```

## Future Improvements (Phase 2+)

- Batch translation script using Claude/OpenAI API
- Translation memory for consistent terminology (e.g., always translate "Mask" as "Máscara")
- Dashboard showing review status per category (published vs. pending)
- Automated re-scrape detection when Fandom wiki is updated
- Quality scoring for translated content before publishing
