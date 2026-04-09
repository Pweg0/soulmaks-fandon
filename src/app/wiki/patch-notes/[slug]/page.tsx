/**
 * Individual patch note page — /wiki/patch-notes/[slug]
 * MDX rendered via next-mdx-remote/rsc with custom components.
 * Includes prev/next navigation sorted by date descending.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { getAllContent, getContentBySlug } from '@/lib/content'
import type { ContentItem, PatchFrontmatter } from '@/types/content'
import { useMDXComponents } from '@/mdx-components'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const dynamicParams = false
export const revalidate = 86400

type PageParams = { slug: string }

/**
 * Sort patches by date descending (most recent first).
 */
function sortPatches(patches: ContentItem<PatchFrontmatter>[]) {
  return [...patches].sort((a, b) => {
    const aDate = a.frontmatter.date ?? ''
    const bDate = b.frontmatter.date ?? ''
    if (aDate && bDate) return bDate.localeCompare(aDate)
    if (aDate) return -1
    if (bDate) return 1
    return a.frontmatter.title.localeCompare(b.frontmatter.title, 'pt-BR')
  })
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const patches = await getAllContent('patches', true)
  return patches.map((p) => ({ slug: p.slug }))
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr + 'T00:00:00'))
  } catch {
    return dateStr
  }
}

export default async function PatchDetailPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { slug } = await params

  const data = await getContentBySlug('patches', slug)
  if (!data || !data.frontmatter.published) {
    notFound()
  }

  const { frontmatter, content } = data as ContentItem<PatchFrontmatter>

  // Get all patches for prev/next navigation
  const allPatches = (await getAllContent('patches', true)) as ContentItem<PatchFrontmatter>[]
  const sorted = sortPatches(allPatches)
  const currentIndex = sorted.findIndex((p) => p.slug === slug)

  // In descending order: prev = newer (lower index), next = older (higher index)
  const prevPatch = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const nextPatch = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  const mdxComponents = useMDXComponents({})

  return (
    <main className="max-w-[720px] mx-auto px-6 py-8">
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
              <BreadcrumbLink render={<Link href="/wiki/patch-notes" />}>
                Patch Notes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">
                {frontmatter.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {frontmatter.version && (
            <Badge
              className="bg-muted border border-primary text-primary text-sm h-auto py-0.5 px-2"
              variant="outline"
            >
              v{frontmatter.version}
            </Badge>
          )}
          {frontmatter.date && (
            <span className="text-sm text-muted-foreground">
              {formatDate(frontmatter.date)}
            </span>
          )}
        </div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          {frontmatter.title}
        </h1>
      </header>

      {/* MDX Content */}
      {content && (
        <div
          data-pagefind-body
          className="prose-dark max-w-none mb-12"
        >
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      )}

      {/* Prev / Next Navigation */}
      <nav
        aria-label="Navegacao entre patches"
        className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-border"
      >
        <div className="flex-1">
          {prevPatch && (
            <Link
              href={`/wiki/patch-notes/${prevPatch.slug}`}
              className="group flex flex-col gap-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <span className="text-xs uppercase tracking-wide">Patch anterior</span>
              <span className="text-primary group-hover:underline">{prevPatch.frontmatter.title}</span>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {nextPatch && (
            <Link
              href={`/wiki/patch-notes/${nextPatch.slug}`}
              className="group flex flex-col gap-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 items-end"
            >
              <span className="text-xs uppercase tracking-wide">Proximo patch</span>
              <span className="text-primary group-hover:underline">{nextPatch.frontmatter.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </main>
  )
}
