'use client'

/**
 * CraftingRecipe — Horizontal scrollable ingredient list accordion
 * UI-SPEC Crafting Recipe contract: horizontal scroll, ingredient mini-cards, open by default
 */

import Image from 'next/image'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

interface CraftingRecipeProps {
  crafting?: Array<{ item: string; quantity: number; image?: string }>
}

export function CraftingRecipe({ crafting }: CraftingRecipeProps) {
  if (!crafting || crafting.length === 0) return null

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Accordion defaultValue={['crafting']}>
        <AccordionItem value="crafting" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
            <span
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Receita de Crafting
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {/* Horizontal scrollable container */}
            <div className="flex overflow-x-auto gap-3 pb-2 pt-2">
              {crafting.map((ingredient, index) => (
                <div
                  key={`${ingredient.item}-${index}`}
                  className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-md border border-border bg-muted/30 hover:border-primary transition-colors duration-150 cursor-default flex-shrink-0"
                >
                  {/* Ingredient image */}
                  {ingredient.image ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                      <Image
                        src={ingredient.image}
                        alt={ingredient.item}
                        fill
                        className="object-contain"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted" />
                  )}
                  {/* Ingredient name */}
                  <span className="text-xs text-foreground text-center leading-tight line-clamp-2">
                    {ingredient.item}
                  </span>
                  {/* Quantity */}
                  <span className="text-xs font-bold text-muted-foreground">
                    x{ingredient.quantity}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
