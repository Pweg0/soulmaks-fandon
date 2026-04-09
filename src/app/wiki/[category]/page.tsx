import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { getAllContent, getContentCategories } from '@/lib/content'
import { CATEGORY_MAP, CATEGORY_LABELS } from '@/types/content'
import { webPageSchema } from '@/lib/jsonld'
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
  mascaras: 'Todas as mascaras, habilidades e builds do Soulmask',
  armas: 'Espadas, arcos, lanças, martelos e mais',
  armaduras: 'Armaduras, capacetes, botas e luvas',
  escudos: 'Escudos para defesa em combate',
  ferramentas: 'Ferramentas de coleta e construcao',
  construcoes: 'Estruturas, paredes e pecas de construcao',
  moveis: 'Moveis, decoracao e itens de base',
  bancadas: 'Bancadas de trabalho e estacoes de crafting',
  criaturas: 'Animais, predadores e criaturas domesticaveis',
  chefes: 'Chefes, elites e inimigos poderosos',
  localizacoes: 'Mapas, regioes e pontos de interesse',
  recursos: 'Recursos naturais e materiais de coleta',
  comidas: 'Comidas, bebidas e alimentos',
  medicamentos: 'Medicamentos e itens de cura',
  cristais: 'Cristais e pedras preciosas',
  minerais: 'Minerais e minerios',
  municoes: 'Municoes para arcos e balistas',
  proficiencias: 'Arvores de habilidades e proficiencias',
  modificacoes: 'Modificacoes e melhorias de equipamento',
  guias: 'Guias completos para iniciantes e jogadores avancados',
  'patch-notes': 'Traducoes das atualizacoes do Soulmask em portugues',
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  if (!CATEGORY_MAP[category]) return {}

  const title = CATEGORY_LABELS[category] ?? category
  const description = CATEGORY_SUBTITLES[category] ?? `Conteúdo de ${title} no Soulmask em português.`

  return {
    title,
    description,
    alternates: {
      canonical: `/wiki/${category}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(
          CATEGORY_LABELS[category] ?? category,
          `${BASE_URL}/wiki/${category}`
        )) }}
      />
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
