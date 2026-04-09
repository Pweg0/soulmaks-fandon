/**
 * Content type contracts for SoulmaskBR wiki
 * Phase 2 additions: D-02, D-03, D-08
 */

export interface ItemFrontmatter {
  title: string
  slug: string
  category: 'items' | 'masks' | 'guides' | 'patches'
  subcategory?: string
  gameVersion: string
  sourceUrl: string
  published: boolean
  lastScrapedAt?: string
  // Phase 2 additions (D-08):
  tags?: string[]
  tier?: string          // items: comum | incomum | raro | epico | lendario
  difficulty?: string    // masks only: Iniciante | Intermediario | Avancado
  image?: string         // URL or relative path
  stats?: Record<string, string | number>
  crafting?: Array<{ item: string; quantity: number; image?: string }>
  location?: string[]
}

// Alias for masks with same shape but semantic distinction
export type MaskFrontmatter = ItemFrontmatter

export interface PatchFrontmatter {
  title: string
  slug: string
  category: 'patches'
  published: boolean
  version?: string
  date?: string        // ISO date string
  gameVersion?: string
  sourceUrl?: string
}

export interface ContentItem<T = ItemFrontmatter> {
  frontmatter: T
  content: string      // raw MDX body
  slug: string
}

// URL segment -> filesystem directory mapping
export const CATEGORY_MAP: Record<string, string> = {
  itens: 'items',
  mascaras: 'masks',
  guias: 'guides',
  'patch-notes': 'patches',
}

// Reverse map for breadcrumbs
export const CATEGORY_LABELS: Record<string, string> = {
  itens: 'Itens & Crafting',
  mascaras: 'Mascaras & Skills',
  guias: 'Guias & Tutoriais',
  'patch-notes': 'Patch Notes',
}
