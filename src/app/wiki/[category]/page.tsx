import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { getAllContent, getContentCategories } from '@/lib/content'
import { CATEGORY_MAP, CATEGORY_LABELS } from '@/types/content'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CategoryListing } from '@/components/wiki/CategoryListing'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamicParams = false
export const revalidate = 86400

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({ category }))
}

const CATEGORY_SUBTITLES: Record<string, string> = {
  itens: 'Todos os itens, materiais e receitas do Soulmask',
  mascaras: 'Todas as máscaras, habilidades e builds do Soulmask',
  guias: 'Guias completos para iniciantes e jogadores avançados',
  'patch-notes': 'Traduções das atualizações do Soulmask em português',
}

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params

  if (!CATEGORY_MAP[category]) {
    notFound()
  }

  const fsCategory = CATEGORY_MAP[category]

  const [allItems, subcategories] = await Promise.all([
    getAllContent(fsCategory, false),
    getContentCategories(fsCategory),
  ])

  const label = CATEGORY_LABELS[category]
  const subtitle = CATEGORY_SUBTITLES[category] ?? ''

  return (
    <div data-pagefind-ignore className="max-w-[1280px] mx-auto px-6 pb-12">
      {/* Breadcrumb */}
      <Breadcrumb className="mt-6 mb-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/wiki" />}>
              Wiki
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary">{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category hero */}
      <div className="mt-6 mb-6">
        <h1
          className="font-heading font-bold text-[40px] leading-[1.1] text-foreground"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {label}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Category listing with filter/sort/pagination */}
      {/* Suspense required: CategoryListing uses useSearchParams() — a CSR bailout hook */}
      <Suspense
        fallback={
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" aria-hidden="true" />
            ))}
          </div>
        }
      >
        <CategoryListing
          items={allItems}
          subcategories={subcategories}
          category={category}
        />
      </Suspense>
    </div>
  )
}
