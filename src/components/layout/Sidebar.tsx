"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Sword,
  Package,
  Drama,
  Hammer,
  Globe,
  BookOpen,
  Server,
  ChevronDown,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSidebar } from "./SidebarContext"
import { cn } from "@/lib/utils"
import { SIDEBAR_NAV } from "@/types/content"

const ICON_MAP: Record<string, React.ElementType> = {
  Sword,
  Package,
  Drama,
  Hammer,
  Globe,
  BookOpen,
}

function NavGroup({
  group,
  pathname,
  onLinkClick,
}: {
  group: (typeof SIDEBAR_NAV)[number]
  pathname: string
  onLinkClick?: () => void
}) {
  const isAnyChildActive = group.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  )
  const [isOpen, setIsOpen] = useState(isAnyChildActive)
  const Icon = ICON_MAP[group.icon] || BookOpen

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-md transition-colors duration-100",
          isAnyChildActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} aria-hidden="true" />
          <span className="font-medium">{group.label}</span>
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="ml-7 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
          {group.children.map((child) => {
            const isActive =
              pathname === child.href ||
              pathname.startsWith(child.href + "/")
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onLinkClick}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block px-3 py-1.5 text-sm rounded-md transition-colors duration-100",
                  isActive
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NavList({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {/* Server list — standalone link */}
      <Link
        href="/servidores"
        onClick={onLinkClick}
        aria-current={pathname === "/servidores" ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors duration-100",
          pathname === "/servidores" || pathname.startsWith("/servidores/")
            ? "text-primary bg-muted"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Server size={18} aria-hidden="true" />
        <span className="font-medium">Servidores</span>
      </Link>

      {/* Divider */}
      <div className="h-px bg-border my-2" />

      {/* Expandable category groups */}
      {SIDEBAR_NAV.map((group) => (
        <NavGroup
          key={group.label}
          group={group}
          pathname={pathname}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-card border-r border-border sticky top-0 h-screen overflow-y-auto">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <Link
            href="/"
            className="text-primary font-bold text-base leading-none"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            SoulmaskBR
          </Link>
        </div>
        <NavList />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="bg-card border-r border-border p-0 w-72 overflow-y-auto">
          <SheetHeader className="h-14 flex flex-row items-center px-4 border-b border-border">
            <SheetTitle
              className="text-primary font-bold text-base"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              SoulmaskBR
            </SheetTitle>
          </SheetHeader>
          <NavList onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
