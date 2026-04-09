"use client"

import { Menu } from "lucide-react"
import { useSidebar } from "./SidebarContext"

export default function SidebarMobileToggle() {
  const { setIsOpen } = useSidebar()

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      aria-label="Abrir menu"
      className="flex items-center justify-center w-11 h-11 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100"
    >
      <Menu size={20} aria-hidden="true" />
    </button>
  )
}
