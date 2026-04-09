"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import SidebarMobileToggle from "./SidebarMobileToggle"

export default function Topbar() {
  return (
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
        <div className="relative w-full max-w-[480px]">
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
          />
        </div>
      </div>

      {/* Right: auth placeholder (Phase 5) */}
      <div className="shrink-0 w-20" aria-hidden="true" />
    </header>
  )
}
