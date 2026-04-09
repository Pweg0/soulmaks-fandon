/**
 * ItemHeroCard — "card expansivo" for item detail pages
 * UI-SPEC D-01: full-width hero card with image + name + badges + description
 */

import Image from 'next/image'

import type { ItemFrontmatter } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ItemHeroCardProps {
  item: ItemFrontmatter
}

/**
 * Returns tier badge style class names based on tier string.
 * S/Legendary = primary gold border + secondary bg
 * A = tier-a (steel blue) border + secondary bg
 * B and below = border (gray) + muted bg
 */
function getTierBadgeStyle(tier?: string): string {
  if (!tier) return 'bg-muted border border-border text-foreground'

  const upper = tier.toUpperCase()
  if (upper === 'S' || upper === 'LENDARIO' || upper === 'LEGENDARY' || upper === 'EPICO') {
    return 'bg-secondary border border-primary text-primary'
  }
  if (upper === 'A') {
    return 'bg-secondary border text-foreground'
  }
  return 'bg-muted border border-border text-muted-foreground'
}

export function ItemHeroCard({ item }: ItemHeroCardProps) {
  const tierStyle = getTierBadgeStyle(item.tier)

  return (
    <Card
      className="w-full mb-6 border border-border shadow-[0_0_0_1px_rgba(237,160,29,0.15)]"
    >
      <CardContent className="p-4">
        {/* Desktop: flex row | Mobile: flex col */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Left zone — item image */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            {item.image ? (
              <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-md overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, 160px"
                />
              </div>
            ) : (
              /* Fallback placeholder */
              <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-md bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs text-center px-2">Sem imagem</span>
              </div>
            )}
          </div>

          {/* Right zone — title, badges, description */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title */}
            <h1
              className="text-2xl font-bold text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              {item.title}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category badge */}
              <Badge variant="outline" className="text-xs capitalize">
                {item.subcategory ?? item.category}
              </Badge>

              {/* Tier badge */}
              {item.tier && (
                <span
                  className={`inline-flex items-center h-5 px-2 text-xs font-medium rounded-full ${tierStyle}`}
                >
                  {item.tier}
                </span>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="ghost" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
