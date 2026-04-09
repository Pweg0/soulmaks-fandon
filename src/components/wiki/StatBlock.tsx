'use client'

/**
 * StatBlock — Item stats accordion section
 * UI-SPEC Stats Block contract: 2-col CSS grid, open by default, Cinzel heading
 */

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

interface StatBlockProps {
  stats?: Record<string, string | number>
}

export function StatBlock({ stats }: StatBlockProps) {
  // Do not render if no stats data
  if (!stats || Object.keys(stats).length === 0) return null

  const statEntries = Object.entries(stats)

  // Group entries into chunks of 4 for divider placement
  const chunks: [string, string | number][][] = []
  for (let i = 0; i < statEntries.length; i += 4) {
    chunks.push(statEntries.slice(i, i + 4))
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Accordion defaultValue={['stats']}>
        <AccordionItem value="stats" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
            <span
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Estatisticas
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="pt-2 space-y-2">
              {chunks.map((chunk, chunkIdx) => (
                <div key={chunkIdx}>
                  {chunkIdx > 0 && (
                    <div
                      className="border-b mb-2"
                      style={{ borderColor: 'rgba(237,160,29,0.25)' }}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {chunk.map(([label, value]) => (
                      <>
                        <div key={`${label}-label`} className="text-sm text-muted-foreground leading-snug capitalize">
                          {label.replace(/_/g, ' ')}
                        </div>
                        <div key={`${label}-value`} className="text-base font-bold text-foreground leading-snug">
                          {String(value)}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
