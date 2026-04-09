import Link from 'next/link'
import { getAllContent } from '@/lib/content'
import type { PatchFrontmatter } from '@/types/content'
import type { ContentItem } from '@/types/content'
import PatchEntry from '@/components/wiki/PatchEntry'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export const revalidate = 86400

const PATCHES_PER_PAGE = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function PatchNotesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10))

  const allPatches = await getAllContent('patches', true) as ContentItem<PatchFrontmatter>[]

  // Sort by date descending (most recent first); fallback to title if no date
  const sorted = [...allPatches].sort((a, b) => {
    const aDate = a.frontmatter.date ?? ''
    const bDate = b.frontmatter.date ?? ''
    if (aDate && bDate) return bDate.localeCompare(aDate)
    if (aDate) return -1
    if (bDate) return 1
    return a.frontmatter.title.localeCompare(b.frontmatter.title, 'pt-BR')
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PATCHES_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const offset = (safePage - 1) * PATCHES_PER_PAGE
  const patches = sorted.slice(offset, offset + PATCHES_PER_PAGE)

  return (
    <main
      className="max-w-[960px] mx-auto px-6 py-8"
      data-pagefind-ignore
    >
      {/* Breadcrumb */}
      <nav aria-label="Navegacao de caminho" className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>
                Inicio
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
              <BreadcrumbPage className="text-primary">
                Patch Notes
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Page Title */}
      <h1
        className="text-[40px] font-bold leading-tight text-foreground mb-2"
        style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
      >
        Patch Notes
      </h1>
      <p className="text-base text-muted-foreground mb-8">
        Traducoes das atualizacoes do Soulmask em portugues
      </p>

      {/* Patch list */}
      {patches.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-base text-foreground font-medium">
            Nenhum conteudo publicado ainda
          </p>
          <p className="text-base text-muted-foreground">
            Este conteudo esta sendo traduzido e revisado. Volte em breve.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {patches.map((patch) => (
            <PatchEntry key={patch.slug} patch={patch} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination aria-label="Paginacao">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={safePage > 1 ? `/wiki/patch-notes?page=${safePage - 1}` : '#'}
                  aria-disabled={safePage <= 1}
                  text="Anterior"
                  className={safePage <= 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first, last, current ± 2, and their neighbors
                  return p === 1 || p === totalPages || Math.abs(p - safePage) <= 2
                })
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('ellipsis')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((p, idx) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={`/wiki/patch-notes?page=${p}`}
                        isActive={p === safePage}
                        className={p === safePage ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

              <PaginationItem>
                <PaginationNext
                  href={safePage < totalPages ? `/wiki/patch-notes?page=${safePage + 1}` : '#'}
                  aria-disabled={safePage >= totalPages}
                  text="Proximo"
                  className={safePage >= totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </main>
  )
}
