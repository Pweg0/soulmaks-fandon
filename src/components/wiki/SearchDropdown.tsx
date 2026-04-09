'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

// Extend Window to include pagefind
declare global {
  interface Window {
    pagefind?: {
      search: (query: string) => Promise<{ results: PagefindRawResult[] }>
      debouncedSearch: (query: string) => Promise<{ results: PagefindRawResult[] } | null>
    }
  }
}

interface PagefindRawResult {
  id: string
  data: () => Promise<PagefindResultData>
}

interface PagefindResultData {
  url: string
  meta: {
    title?: string
  }
  excerpt: string
}

interface SearchResult {
  id: string
  url: string
  title: string
  excerpt: string
}

interface SearchDropdownProps {
  query: string
  isOpen: boolean
  onClose: () => void
  maxWidth?: string
}

async function loadPagefind(): Promise<void> {
  if (typeof window === 'undefined') return
  if (window.pagefind) return

  try {
    // Dynamic import with webpackIgnore — pagefind is a post-build asset, not a webpack module
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — pagefind.js only exists after `next build && pagefind`; fine in dev (caught below)
    const pf = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')
    window.pagefind = pf
  } catch {
    // Dev mode: pagefind index doesn't exist yet — graceful fallback
    window.pagefind = undefined
  }
}

export default function SearchDropdown({
  query,
  isOpen,
  onClose,
  maxWidth,
}: SearchDropdownProps) {
  const router = useRouter()
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load pagefind on mount
  useEffect(() => {
    loadPagefind()
  }, [])

  // Search when query changes (debounced 300ms)
  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (!window.pagefind) {
        // Dev mode — no index available
        setResults([])
        setIsLoading(false)
        return
      }

      try {
        const search = await window.pagefind.debouncedSearch(query)
        if (!search) {
          setIsLoading(false)
          return
        }

        // Fetch first 8 results
        const topResults = search.results.slice(0, 8)
        const resolved = await Promise.all(
          topResults.map(async (r) => {
            const data = await r.data()
            return {
              id: r.id,
              url: data.url,
              title: data.meta?.title ?? 'Sem título',
              excerpt: data.excerpt,
            } satisfies SearchResult
          })
        )

        setResults(resolved)
        setActiveIndex(-1)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((i) => (i < results.length - 1 ? i + 1 : i))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((i) => (i > 0 ? i - 1 : -1))
          break
        case 'Enter':
          if (activeIndex >= 0 && results[activeIndex]) {
            e.preventDefault()
            router.push(results[activeIndex].url)
            onClose()
          }
          break
        case 'Escape':
          onClose()
          break
      }
    },
    [isOpen, results, activeIndex, router, onClose]
  )

  if (!isOpen || !query.trim()) return null

  const activeId = activeIndex >= 0 ? `search-result-${results[activeIndex]?.id}` : undefined

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Resultados da busca"
      aria-live="polite"
      aria-busy={isLoading}
      aria-activedescendant={activeId}
      onKeyDown={handleKeyDown}
      className="absolute top-full left-0 w-full z-50 mt-1"
      style={maxWidth ? { maxWidth } : undefined}
    >
      <div
        className="rounded-lg border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.5)] max-h-[400px] overflow-y-auto"
      >
        {isLoading ? (
          <div aria-busy="true" className="p-2 space-y-2">
            <Skeleton className="h-11 w-full" aria-hidden="true" />
            <Skeleton className="h-11 w-full" aria-hidden="true" />
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-6 text-center space-y-1">
            <p className="text-base text-muted-foreground">
              Nenhum resultado encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Tente outros termos ou navegue pelas categorias.
            </p>
          </div>
        ) : (
          <ul className="py-1" role="listbox">
            {results.map((result, idx) => (
              <li
                key={result.id}
                id={`search-result-${result.id}`}
                role="option"
                aria-selected={idx === activeIndex}
                className={`px-4 py-2 min-h-[44px] cursor-pointer flex flex-col justify-center gap-0.5 transition-colors duration-150 ${
                  idx === activeIndex ? 'bg-muted' : 'hover:bg-muted'
                }`}
                onClick={() => {
                  router.push(result.url)
                  onClose()
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span
                  className="text-base text-foreground leading-tight font-medium"
                  // Pagefind wraps matched terms in <mark> — dangerouslySetInnerHTML is intentional
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                <span
                  className="text-sm text-muted-foreground leading-tight line-clamp-1"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
