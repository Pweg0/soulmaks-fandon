'use client'

import { LayoutGrid, Table2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ViewToggleProps {
  view: 'grid' | 'table'
  onChange: (view: 'grid' | 'table') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <TooltipProvider delay={500}>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            aria-label="Visualização em grade"
            aria-pressed={view === 'grid'}
            onClick={() => onChange('grid')}
            className={[
              'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100',
              view === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <LayoutGrid className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Visualização em grade</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            aria-label="Visualização em tabela"
            aria-pressed={view === 'table'}
            onClick={() => onChange('table')}
            className={[
              'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100',
              view === 'table'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <Table2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Visualização em tabela</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
