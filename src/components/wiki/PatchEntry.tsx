import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ContentItem } from '@/types/content'
import type { PatchFrontmatter } from '@/types/content'

interface PatchEntryProps {
  patch: ContentItem<PatchFrontmatter>
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

export default function PatchEntry({ patch }: PatchEntryProps) {
  const { frontmatter, content, slug } = patch
  // Derive a short excerpt from raw MDX content (strip markdown symbols)
  const excerpt = content
    .replace(/^---[\s\S]*?---\n?/, '')  // strip frontmatter if present
    .replace(/#{1,6}\s/g, '')           // strip headings
    .replace(/\*\*|__|~~|`/g, '')       // strip bold/italic/code markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links
    .replace(/\n+/g, ' ')              // collapse newlines
    .trim()
    .slice(0, 200)

  return (
    <Card
      className="border-l-[3px] border-l-primary rounded-l-none ring-0 border border-border hover:border-primary transition-colors duration-150"
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
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

        <h2
          className="text-2xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          {frontmatter.title}
        </h2>

        {excerpt && (
          <p className="text-base text-muted-foreground line-clamp-3 mb-3">
            {excerpt}
          </p>
        )}

        <Link
          href={`/wiki/patch-notes/${slug}`}
          className="text-sm text-primary no-underline hover:underline transition-colors duration-150"
        >
          Ler mais
        </Link>
      </CardContent>
    </Card>
  )
}
