"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Server, GraduationCap, FileText } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSidebar } from "./SidebarContext"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/wiki/itens", label: "Wiki", icon: BookOpen },
  { href: "/servidores", label: "Servidores", icon: Server },
  { href: "/wiki/guias", label: "Guias", icon: GraduationCap },
  { href: "/wiki/patch-notes", label: "Patch Notes", icon: FileText },
]

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors duration-100",
        "border-l-2",
        isActive
          ? "text-primary border-primary bg-muted"
          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}

function NavList({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navLinks.map(({ href, label, icon }) => (
        <NavLink
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || pathname.startsWith(href + "/")}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-card border-r border-border sticky top-0 h-screen">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <span
            className="text-primary font-bold text-base leading-none"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Menu
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavList />
        </div>
      </aside>

      {/* Mobile sidebar — Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="bg-card border-r border-border p-0 w-64">
          <SheetHeader className="h-14 flex flex-row items-center px-4 border-b border-border">
            <SheetTitle
              className="text-primary font-bold text-base"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Menu
            </SheetTitle>
          </SheetHeader>
          <NavList onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
