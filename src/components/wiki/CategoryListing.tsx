'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { ContentItem } from '@/types/content'
import { FilterBar } from './FilterBar'
import { ItemCard } from './ItemCard'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpDown } from 'lucide-react'

interface CategoryListingProps {
  items: ContentItem[]
  subcategories: string[]
  category: string
}

const GRID_PAGE_SIZE = 24
const TABLE_PAGE_SIZE = 50

type SortKey = 'nome-az' | 'nome-za' | 'categoria' | 'tier'

function sortItems(items: ContentItem[], sort: SortKey): ContentItem[] {
  const copy = [...items]
  switch (sort) {
    case 'nome-az':
      return copy.sort((a, b) =>
        a.frontmatter.title.localeCompare(b.frontmatter.title, 'pt-BR')
      )
    case 'nome-za':
      return copy.sort((a, b) =>
        b.frontmatter.title.localeCompare(a.frontmatter.title, 'pt-BR')
      )
    case 'categoria':
      return copy.sort((a, b) =>
        (a.frontmatter.subcategory ?? '').localeCompare(
          b.frontmatter.subcategory ?? '',
          'pt-BR'
        )
      )
    case 'tier':
      return copy.sort((a, b) =>
        (a.frontmatter.tier ?? '').localeCompare(
          b.frontmatter.tier ?? '',
          'pt-BR'
        )
      )
    default:
      return copy
  }
}

function buildUrl(
  pathname: string,
  params: URLSearchParams,
  updates: Record<string, string>
): string {
  const next = new URLSearchParams(params.toString())
  for (const [k, v] of Object.entries(updates)) {
    if (v === '' || v === null) {
      next.delete(k)
    } else {
      next.set(k, v)
    }
  }
  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export function CategoryListing({
  items,
  subcategories,
  category,
}: CategoryListingProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = (searchParams.get('view') ?? 'grid') as 'grid' | 'table'
  const subcategory = searchParams.get('sub') ?? 'Todos'
  const sort = (searchParams.get('sort') ?? 'nome-az') as SortKey
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  const pageSize = view === 'table' ? TABLE_PAGE_SIZE : GRID_PAGE_SIZE

  const handleViewChange = useCallback(
    (v: 'grid' | 'table') => {
      router.push(buildUrl(pathname, searchParams, { view: v, page: '1' }))
    },
    [router, pathname, searchParams]
  )

  const handleSubcategoryChange = useCallback(
    (sub: string) => {
      router.push(
        buildUrl(pathname, searchParams, {
          sub: sub === 'Todos' ? '' : sub,
          page: '1',
        })
      )
    },
    [router, pathname, searchParams]
  )

  const handleSortChange = useCallback(
    (s: string) => {
      router.push(buildUrl(pathname, searchParams, { sort: s, page: '1' }))
    },
    [router, pathname, searchParams]
  )

  const handlePageChange = useCallback(
    (p: number) => {
      router.push(buildUrl(pathname, searchParams, { page: String(p) }))
    },
    [router, pathname, searchParams]
  )

  const filtered = useMemo(() => {
    let result = items.filter((i) => i.frontmatter.published)
    if (subcategory !== 'Todos') {
      result = result.filter((i) => i.frontmatter.subcategory === subcategory)
    }
    return sortItems(result, sort)
  }, [items, subcategory, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Pagination page numbers with ellipsis (show up to 7)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | 'ellipsis')[] = []
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      pages.push(
        1,
        'ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis',
        totalPages
      )
    }
    return pages
  }, [totalPages, currentPage])

  const isEmpty = filtered.length === 0
  const isMaskCategory = category === 'mascaras'

  return (
    <div>
      <FilterBar
        subcategories={subcategories}
        activeSubcategory={subcategory}
        sort={sort}
        view={view}
        onSubcategoryChange={handleSubcategoryChange}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
      />

      <p className="text-sm text-muted-foreground mt-2 mb-4">
        {filtered.length} resultados encontrados
      </p>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-3">
            Nenhum conteudo publicado ainda
          </h2>
          <p className="text-base text-muted-foreground max-w-md">
            Este conteudo esta sendo traduzido e revisado. Volte em breve.
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item) => (
            <ItemCard key={item.slug} item={item} category={category} />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table>
            <TableCaption>
              {isMaskCategory ? 'Máscaras' : 'Itens'} — {subcategory} — ordenado
              por {sort}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="w-10" />
                <TableHead scope="col">Nome</TableHead>
                <TableHead scope="col">
                  {isMaskCategory ? 'Skills principais' : 'Categoria'}
                </TableHead>
                <TableHead scope="col">
                  Tier{' '}
                  <ArrowUpDown className="inline size-3.5 cursor-pointer" />
                </TableHead>
                <TableHead
                  scope="col"
                  className={isMaskCategory ? 'hidden md:table-cell' : 'hidden md:table-cell'}
                >
                  {isMaskCategory ? 'Dificuldade' : 'Versão'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((item) => (
                <TableRow
                  key={item.slug}
                  className="hover:bg-muted cursor-pointer"
                >
                  <TableCell className="py-3">
                    {item.frontmatter.image ? (
                      <Image
                        src={item.frontmatter.image}
                        alt={item.frontmatter.title}
                        width={40}
                        height={40}
                        className="object-contain rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="py-3 font-medium">
                    <Link
                      href={`/wiki/${category}/${item.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {item.frontmatter.title}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {isMaskCategory
                      ? (item.frontmatter.subcategory ?? '—')
                      : (item.frontmatter.subcategory ?? '—')}
                  </TableCell>
                  <TableCell className="py-3">
                    {item.frontmatter.tier ? (
                      <span className="text-xs px-2 py-0.5 rounded border bg-secondary text-foreground border-border">
                        {item.frontmatter.tier}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground hidden md:table-cell">
                    {isMaskCategory
                      ? (item.frontmatter.difficulty ?? '—')
                      : (item.frontmatter.gameVersion ?? '—')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <nav aria-label="Paginacao">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="Anterior"
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                    }
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>

                {pageNumbers.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === currentPage}
                        onClick={() => handlePageChange(p as number)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        className={
                          p === currentPage
                            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                            : ''
                        }
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    text="Próxima"
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : ''
                    }
                    aria-disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </nav>
        </div>
      )}
    </div>
  )
}
