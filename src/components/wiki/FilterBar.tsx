'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ViewToggle } from './ViewToggle'

interface FilterBarProps {
  subcategories: string[]
  activeSubcategory: string
  sort: string
  view: 'grid' | 'table'
  onSubcategoryChange: (sub: string) => void
  onSortChange: (sort: string) => void
  onViewChange: (view: 'grid' | 'table') => void
}

const SORT_OPTIONS = [
  { value: 'nome-az', label: 'Nome (A-Z)' },
  { value: 'nome-za', label: 'Nome (Z-A)' },
  { value: 'categoria', label: 'Categoria' },
  { value: 'tier', label: 'Tier' },
]

export function FilterBar({
  subcategories,
  activeSubcategory,
  sort,
  view,
  onSubcategoryChange,
  onSortChange,
  onViewChange,
}: FilterBarProps) {
  const allTabs = ['Todos', ...subcategories]

  return (
    <div className="sticky top-14 z-10 bg-card border-b border-border h-14 flex items-center px-4 gap-3">
      {/* Subcategory tabs */}
      <div
        className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none flex-1"
        role="tablist"
        aria-label="Subcategorias"
      >
        {allTabs.map((tab) => {
          const isActive = tab === activeSubcategory
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSubcategoryChange(tab)}
              className={[
                'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors duration-150 shrink-0',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Sort select */}
      <div className="shrink-0">
        <Select
          value={sort}
          onValueChange={(value) => value && onSortChange(value)}
          name="sort"
        >
          <SelectTrigger
            className="w-40 max-sm:w-full"
            aria-label="Ordenar por"
          >
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View toggle */}
      <ViewToggle view={view} onChange={onViewChange} />
    </div>
  )
}
