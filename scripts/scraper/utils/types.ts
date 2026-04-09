export interface ScrapedContent {
  title: string
  slug: string
  category: 'items' | 'masks' | 'guides' | 'patches'
  subcategory?: string
  body: string
  sourceUrl: string
  gameVersion?: string
  // Phase 2 additions (D-08):
  tags?: string[]
  tier?: string
  difficulty?: string
  image?: string
  stats?: Record<string, string | number>
  crafting?: Array<{ item: string; quantity: number }>
  location?: string[]
}

export interface ScrapedItem extends ScrapedContent {
  category: 'items'
}

export interface ScrapedMask extends ScrapedContent {
  category: 'masks'
}

export interface ScrapedGuide extends ScrapedContent {
  category: 'guides'
}

export interface ScrapedPatch extends ScrapedContent {
  category: 'patches'
}

export interface ScraperOptions {
  dryRun: boolean
  contentDir: string
  delayMs: number
  skipExisting?: boolean
}
