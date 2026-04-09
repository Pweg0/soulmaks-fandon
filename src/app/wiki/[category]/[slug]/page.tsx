/**
 * Wiki detail page route — /wiki/[category]/[slug]
 *
 * MDX rendering strategy: next-mdx-remote/rsc (v6+)
 * - Chosen because next-mdx-remote v6 supports React Server Components via /rsc export
 * - next-mdx-remote@6 has peerDep react>=16 only, compatible with Next.js 16
 * - Renders raw MDX string from gray-matter at build time with custom components
 */

import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { getAllContent, getContentBySlug } from '@/lib/content'
import { CATEGORY_MAP, CATEGORY_LABELS, type ItemFrontmatter } from '@/types/content'
import { useMDXComponents } from '@/mdx-components'

import { ItemHeroCard } from '@/components/wiki/ItemHeroCard'
import { MaskHeroCard } from '@/components/wiki/MaskHeroCard'
import { StatBlock } from '@/components/wiki/StatBlock'
import { CraftingRecipe } from '@/components/wiki/CraftingRecipe'
import { SkillList } from '@/components/wiki/SkillList'
import { BuildTabs } from '@/components/wiki/BuildTabs'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Static generation config
export const dynamicParams = false
export const revalidate = 86400

type PageParams = {
  category: string
  slug: string
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = []

  for (const [urlSegment, fsDir] of Object.entries(CATEGORY_MAP)) {
    const items = await getAllContent(fsDir, true)
    for (const item of items) {
      params.push({ category: urlSegment, slug: item.slug })
    }
  }

  return params
}

export default async function WikiDetailPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { category, slug } = await params

  // Validate category
  if (!CATEGORY_MAP[category]) {
    notFound()
  }

  const fsDir = CATEGORY_MAP[category]
  const data = await getContentBySlug(fsDir, slug)

  if (!data || !data.frontmatter.published) {
    notFound()
  }

  const { frontmatter, content } = data
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const mdxComponents = useMDXComponents({})

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/wiki">Wiki</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/wiki/${category}`}>{categoryLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary">{frontmatter.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Card — category-specific */}
      {category === 'itens' && <ItemHeroCard item={frontmatter} />}
      {category === 'mascaras' && <MaskHeroCard mask={frontmatter} />}
      {category === 'guias' && (
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
          >
            {frontmatter.title}
          </h1>
        </div>
      )}
      {category === 'patch-notes' && (
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
          >
            {frontmatter.title}
          </h1>
        </div>
      )}

      {/* Content Sections — item-specific accordion sections */}
      {category === 'itens' && (
        <div className="space-y-2 mb-8">
          <StatBlock stats={(frontmatter as ItemFrontmatter).stats} />
          <CraftingRecipe crafting={(frontmatter as ItemFrontmatter).crafting} />
          <LocationSection location={(frontmatter as ItemFrontmatter).location} />
          <RelatedItemsSection />
        </div>
      )}

      {/* Content Sections — mask-specific accordion sections */}
      {category === 'mascaras' && (
        <div className="space-y-2 mb-8">
          <SkillList />
          <BuildTabs />
          <MimetismoSection />
          <NosSection />
        </div>
      )}

      {/* MDX Body — styled prose rendered below accordions */}
      {content && (
        <div
          data-pagefind-body
          className="prose-dark max-w-none"
        >
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      )}
    </div>
  )
}

/**
 * Inline location accordion section (item pages only)
 */
function LocationSection({ location }: { location?: string[] }) {
  if (!location || location.length === 0) return null

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <details open className="group">
        <summary
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          <span className="text-xl font-bold text-foreground">Onde Encontrar</span>
          <span className="text-muted-foreground text-sm group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="px-4 pb-4 pt-2">
          <ul className="list-disc pl-6 space-y-1">
            {location.map((loc) => (
              <li key={loc} className="text-base text-foreground leading-relaxed">
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}

/**
 * Related items section (collapsed by default, v1 placeholder)
 */
function RelatedItemsSection() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <details className="group">
        <summary
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          <span className="text-xl font-bold text-foreground">Itens Relacionados</span>
          <span className="text-muted-foreground text-sm">▼</span>
        </summary>
        <div className="px-4 pb-4 pt-2">
          <p className="text-muted-foreground text-sm">Nenhum item relacionado encontrado.</p>
        </div>
      </details>
    </div>
  )
}

/**
 * Modo Mimetismo section (mask pages, v1 — MDX body has the detail)
 */
function MimetismoSection() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <details open className="group">
        <summary
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          <span className="text-xl font-bold text-foreground">Modo Mimetismo</span>
          <span className="text-muted-foreground text-sm group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="px-4 pb-4 pt-2 space-y-4">
          <div>
            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-1">Efeito Passivo</h4>
            <p className="text-muted-foreground text-sm">Consulte o corpo do artigo abaixo para detalhes do efeito passivo do Modo Mimetismo.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-1">Efeito Ativo</h4>
            <p className="text-muted-foreground text-sm">Consulte o corpo do artigo abaixo para detalhes do efeito ativo do Modo Mimetismo.</p>
          </div>
        </div>
      </details>
    </div>
  )
}

/**
 * Nos da Mascara section (collapsed by default, v1 placeholder)
 */
function NosSection() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <details className="group">
        <summary
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          <span className="text-xl font-bold text-foreground">Nos da Mascara</span>
          <span className="text-muted-foreground text-sm">▼</span>
        </summary>
        <div className="px-4 pb-4 pt-2">
          <p className="text-muted-foreground text-sm">Nos da Mascara serao adicionados em breve.</p>
        </div>
      </details>
    </div>
  )
}
