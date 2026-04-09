"use client"

import { Search } from "lucide-react"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import SidebarMobileToggle from "./SidebarMobileToggle"
import SearchDropdown from "@/components/wiki/SearchDropdown"

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleClickOutside(e: React.MouseEvent) {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsSearchOpen(false)
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={handleClickOutside}>
      <header className="h-14 flex items-center px-4 bg-card border-b border-border gap-4 sticky top-0 z-40">
        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <SidebarMobileToggle />
        </div>

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <span
            className="text-primary font-bold text-xl leading-none"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            SoulmaskBR
          </span>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 flex justify-center">
          <div ref={containerRef} className="relative w-full max-w-[480px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar itens, mascaras, guias..."
              className="pl-9 focus-visible:border-primary focus-visible:ring-primary/30 transition-colors duration-150 h-9"
              aria-label="Buscar conteudo"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.trim()) setIsSearchOpen(true)
                else setIsSearchOpen(false)
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchOpen(true)
              }}
            />
            <SearchDropdown
              query={searchQuery}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        </div>

        {/* Right: auth placeholder (Phase 5) */}
        <div className="shrink-0 w-20" aria-hidden="true" />
      </header>
    </div>
  )
}
