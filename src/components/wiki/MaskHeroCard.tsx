/**
 * MaskHeroCard — "card expansivo" for mask detail pages
 * UI-SPEC D-03: same as ItemHeroCard + Dificuldade badge
 */

import Image from 'next/image'

import type { MaskFrontmatter } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MaskHeroCardProps {
  mask: MaskFrontmatter
}

/**
 * Tier badge style — same semantics as ItemHeroCard
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

/**
 * Dificuldade badge style — maps to same tier semantics
 * Iniciante -> muted (easy), Intermediario -> tier-a (medium), Avancado -> primary (hard)
 */
function getDificuldadeBadgeStyle(difficulty?: string): string {
  if (!difficulty) return 'bg-muted border border-border text-muted-foreground'

  const lower = difficulty.toLowerCase()
  if (lower === 'avancado' || lower === 'avançado') {
    return 'bg-secondary border border-primary text-primary'
  }
  if (lower === 'intermediario' || lower === 'intermediário') {
    return 'bg-secondary border text-foreground'
  }
  // Iniciante — easy
  return 'bg-muted border border-border text-muted-foreground'
}

export function MaskHeroCard({ mask }: MaskHeroCardProps) {
  const tierStyle = getTierBadgeStyle(mask.tier)
  const dificuldadeStyle = getDificuldadeBadgeStyle(mask.difficulty)

  return (
    <Card
      className="w-full mb-6 border border-border shadow-[0_0_0_1px_rgba(237,160,29,0.15)]"
    >
      <CardContent className="p-4">
        {/* Desktop: flex row | Mobile: flex col */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Left zone — mask image */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            {mask.image ? (
              <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-md overflow-hidden bg-muted">
                <Image
                  src={mask.image}
                  alt={mask.title}
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
              {mask.title}
            </h1>

            {/* Badges row — includes Dificuldade badge alongside Tier badge */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category badge */}
              <Badge variant="outline" className="text-xs capitalize">
                {mask.subcategory ?? mask.category}
              </Badge>

              {/* Tier badge */}
              {mask.tier && (
                <span
                  className={`inline-flex items-center h-5 px-2 text-xs font-medium rounded-full ${tierStyle}`}
                >
                  {mask.tier}
                </span>
              )}

              {/* Dificuldade badge — mask-specific addition */}
              {mask.difficulty && (
                <span
                  className={`inline-flex items-center h-5 px-2 text-xs font-medium rounded-full ${dificuldadeStyle}`}
                >
                  {mask.difficulty}
                </span>
              )}
            </div>

            {/* Tags */}
            {mask.tags && mask.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {mask.tags.map((tag) => (
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
