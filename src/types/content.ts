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
  armas: 'weapons',
  armaduras: 'armor',
  escudos: 'shields',
  ferramentas: 'tools',
  construcoes: 'buildings',
  moveis: 'furniture',
  bancadas: 'workbenches',
  criaturas: 'creatures',
  chefes: 'bosses',
  localizacoes: 'locations',
  recursos: 'resources',
  comidas: 'food',
  medicamentos: 'medicines',
  cristais: 'crystals',
  minerais: 'minerals',
  municoes: 'ammo',
  proficiencias: 'proficiencies',
  modificacoes: 'item-mods',
  guias: 'guides',
  'patch-notes': 'patches',
}

// Reverse map for breadcrumbs
export const CATEGORY_LABELS: Record<string, string> = {
  itens: 'Itens & Crafting',
  mascaras: 'Mascaras & Skills',
  armas: 'Armas',
  armaduras: 'Armaduras',
  escudos: 'Escudos',
  ferramentas: 'Ferramentas',
  construcoes: 'Construcoes',
  moveis: 'Moveis & Decoracao',
  bancadas: 'Bancadas de Trabalho',
  criaturas: 'Criaturas',
  chefes: 'Chefes & Elites',
  localizacoes: 'Localizacoes',
  recursos: 'Recursos',
  comidas: 'Comida & Bebida',
  medicamentos: 'Medicamentos',
  cristais: 'Cristais',
  minerais: 'Minerais',
  municoes: 'Municoes',
  proficiencias: 'Proficiencias',
  modificacoes: 'Modificacoes de Item',
  guias: 'Guias & Tutoriais',
  'patch-notes': 'Patch Notes',
}

// Sidebar navigation structure with expandable groups
export interface NavGroup {
  label: string
  icon: string
  children: { href: string; label: string }[]
}

export const SIDEBAR_NAV: NavGroup[] = [
  {
    label: 'Equipamento',
    icon: 'Sword',
    children: [
      { href: '/wiki/armas', label: 'Armas' },
      { href: '/wiki/armaduras', label: 'Armaduras' },
      { href: '/wiki/escudos', label: 'Escudos' },
      { href: '/wiki/ferramentas', label: 'Ferramentas' },
      { href: '/wiki/modificacoes', label: 'Modificacoes' },
    ],
  },
  {
    label: 'Itens & Recursos',
    icon: 'Package',
    children: [
      { href: '/wiki/itens', label: 'Todos os Itens' },
      { href: '/wiki/recursos', label: 'Recursos' },
      { href: '/wiki/cristais', label: 'Cristais' },
      { href: '/wiki/minerais', label: 'Minerais' },
      { href: '/wiki/municoes', label: 'Municoes' },
      { href: '/wiki/comidas', label: 'Comida & Bebida' },
      { href: '/wiki/medicamentos', label: 'Medicamentos' },
    ],
  },
  {
    label: 'Mascaras',
    icon: 'Drama',
    children: [
      { href: '/wiki/mascaras', label: 'Todas as Mascaras' },
      { href: '/wiki/proficiencias', label: 'Proficiencias' },
    ],
  },
  {
    label: 'Construcao',
    icon: 'Hammer',
    children: [
      { href: '/wiki/construcoes', label: 'Construcoes' },
      { href: '/wiki/moveis', label: 'Moveis & Decoracao' },
      { href: '/wiki/bancadas', label: 'Bancadas' },
    ],
  },
  {
    label: 'Mundo',
    icon: 'Globe',
    children: [
      { href: '/wiki/criaturas', label: 'Criaturas' },
      { href: '/wiki/chefes', label: 'Chefes & Elites' },
      { href: '/wiki/localizacoes', label: 'Localizacoes' },
    ],
  },
  {
    label: 'Guias',
    icon: 'BookOpen',
    children: [
      { href: '/wiki/guias', label: 'Guias & Tutoriais' },
      { href: '/wiki/patch-notes', label: 'Patch Notes' },
    ],
  },
]
