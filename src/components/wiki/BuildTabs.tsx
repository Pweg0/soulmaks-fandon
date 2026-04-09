'use client'

/**
 * BuildTabs — Mask builds tabs component
 * UI-SPEC Builds Recomendados contract: accordion wrapping shadcn tabs
 *
 * v1 Note: Builds are not yet in structured frontmatter.
 * Shows placeholder. Future plans will wire structured build data.
 */

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Build {
  name: string
  description: string
  nodes: string[]
}

interface BuildTabsProps {
  builds?: Build[]
}

export function BuildTabs({ builds }: BuildTabsProps) {
  const hasBuilds = builds && builds.length > 0

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Accordion defaultValue={['builds']}>
        <AccordionItem value="builds" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
            <span
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Builds Recomendados
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {hasBuilds ? (
              <Tabs defaultValue={builds[0].name} className="pt-2">
                <TabsList className="mb-3">
                  {builds.map((build) => (
                    <TabsTrigger key={build.name} value={build.name}>
                      {build.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {builds.map((build) => (
                  <TabsContent key={build.name} value={build.name}>
                    <p className="text-base text-foreground leading-relaxed mb-3">
                      {build.description}
                    </p>
                    {build.nodes.length > 0 && (
                      <ul className="list-disc pl-6 space-y-1">
                        {build.nodes.map((node, idx) => (
                          <li key={idx} className="text-base text-muted-foreground">
                            {node}
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted-foreground text-sm pt-2">
                Builds recomendados serao adicionados em breve.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
