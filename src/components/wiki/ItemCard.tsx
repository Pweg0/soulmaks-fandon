'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import type { ContentItem } from '@/types/content'

interface ItemCardProps {
  item: ContentItem
  category: string
}

function TierBadge({ tier }: { tier: string }) {
  const isLegendary =
    tier.toLowerCase() === 's' || tier.toLowerCase() === 'lendario' || tier.toLowerCase() === 'legendary'
  const isA = tier.toLowerCase() === 'a'

  const borderClass = isLegendary
    ? 'border-primary'
    : isA
    ? 'border-[hsl(200_60%_35%)]'
    : 'border-border'

  const bgClass = isLegendary || isA ? 'bg-secondary' : 'bg-muted'

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${bgClass} ${borderClass} text-foreground`}
    >
      {tier}
    </span>
  )
}

export function ItemCard({ item, category }: ItemCardProps) {
  const { frontmatter, slug } = item
  const href = `/wiki/${category}/${slug}`

  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    >
      <div
        className="
          flex flex-col items-center gap-3 p-4 rounded-xl
          bg-card ring-1 ring-foreground/10 min-h-[120px]
          border border-transparent
          transition-all duration-150 ease-in
          group-hover:border-primary group-hover:shadow-[0_0_0_1px_var(--color-primary)]
          cursor-pointer
        "
      >
        {/* Category badge */}
        {frontmatter.subcategory && (
          <div className="self-start">
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {frontmatter.subcategory}
            </span>
          </div>
        )}

        {/* Item image */}
        <div className="flex items-center justify-center w-16 h-16 rounded-md bg-muted overflow-hidden">
          {frontmatter.image ? (
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              width={64}
              height={64}
              className="object-contain w-16 h-16"
            />
          ) : (
            <ImageOff className="size-6 text-muted-foreground" />
          )}
        </div>

        {/* Item name */}
        <p className="text-base font-bold text-foreground text-center leading-snug">
          {frontmatter.title}
        </p>

        {/* Tier badge */}
        {frontmatter.tier && <TierBadge tier={frontmatter.tier} />}
      </div>
    </Link>
  )
}
