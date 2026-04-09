'use client'

/**
 * SkillList — Mask skills list with passive/active badges
 * UI-SPEC Habilidades contract: skill rows with icon + name + description + badge
 *
 * v1 Note: Skills are embedded in MDX body text (not structured frontmatter).
 * This component accepts optional structured skills or shows a placeholder.
 * The MDX body below this section handles detailed skill descriptions.
 */

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface Skill {
  name: string
  description: string
  type: 'passive' | 'active'
}

interface SkillListProps {
  skills?: Skill[]
}

export function SkillList({ skills }: SkillListProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Accordion defaultValue={['skills']}>
        <AccordionItem value="skills" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
            <span
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Habilidades
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {skills && skills.length > 0 ? (
              <ul className="space-y-3 pt-2">
                {skills.map((skill, index) => (
                  <li
                    key={`${skill.name}-${index}`}
                    className="flex items-start gap-3"
                  >
                    {/* Skill icon placeholder */}
                    <div className="w-8 h-8 rounded bg-muted flex-shrink-0 mt-0.5" />

                    {/* Skill info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-base font-bold text-foreground">{skill.name}</span>
                        {/* Passivo or Ativo badge */}
                        <Badge
                          variant="outline"
                          className="text-xs bg-muted border-border text-muted-foreground h-auto py-0"
                        >
                          {skill.type === 'passive' ? 'Passivo' : 'Ativo'}
                        </Badge>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm pt-2">
                Habilidades detalhadas disponíveis no corpo do artigo abaixo.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
