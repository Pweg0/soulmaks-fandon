import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HeroBanner() {
  return (
    <section
      className="relative w-full h-[320px] lg:h-[480px] flex items-center justify-center overflow-hidden"
      role="img"
      aria-label="Arte do Soulmask"
    >
      {/* Background gradient simulating game art */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(25 50% 8%) 0%, hsl(0 0% 4%) 40%, hsl(38 40% 6%) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Radial overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.75) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-4 w-full max-w-[720px]">
        <h1
          className="text-[40px] font-bold leading-tight text-primary"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          SoulmaskBR
        </h1>
        <p className="text-base text-foreground opacity-90">
          O guia completo de Soulmask em portugues
        </p>

        {/* Search */}
        <div className="relative w-full max-w-[560px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar itens, mascaras, guias..."
            className="pl-9 h-11 focus-visible:border-primary focus-visible:ring-primary/30 transition-colors duration-150"
            aria-label="Buscar conteudo"
          />
        </div>

        {/* CTA */}
        <Link
          href="/wiki"
          className="inline-flex items-center justify-center rounded-lg h-11 px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
        >
          Explorar a Wiki
        </Link>
      </div>
    </section>
  )
}
