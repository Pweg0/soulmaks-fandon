import Link from "next/link"
import { Sword, Shield, Drama, Hammer, Globe, Package, BookOpen, Newspaper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    icon: Sword,
    title: "Armas & Equipamento",
    description: "Espadas, arcos, armaduras, escudos e modificacoes",
    href: "/wiki/armas",
  },
  {
    icon: Package,
    title: "Itens & Recursos",
    description: "Materiais, cristais, comidas, medicamentos e crafting",
    href: "/wiki/itens",
  },
  {
    icon: Drama,
    title: "Mascaras & Skills",
    description: "Todas as mascaras, habilidades e builds",
    href: "/wiki/mascaras",
  },
  {
    icon: Hammer,
    title: "Construcao",
    description: "Estruturas, moveis, bancadas e decoracao de base",
    href: "/wiki/construcoes",
  },
  {
    icon: Globe,
    title: "Mundo & Criaturas",
    description: "Criaturas, chefes, localizacoes e exploração",
    href: "/wiki/criaturas",
  },
  {
    icon: BookOpen,
    title: "Guias & Tutoriais",
    description: "Guias para iniciantes e estrategias avancadas",
    href: "/wiki/guias",
  },
]

export default function CategoryCards() {
  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(({ icon: Icon, title, description, href }) => (
          <Link key={href} href={href} className="group block">
            <Card
              className="h-full bg-card border-border cursor-pointer transition-all duration-150 ease-in-out group-hover:border-primary"
              style={{
                boxShadow: undefined,
              }}
            >
              <CardContent className="p-6 flex flex-col gap-3">
                <Icon
                  size={32}
                  className="text-primary"
                  aria-hidden="true"
                />
                <h2
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
                >
                  {title}
                </h2>
                <p className="text-base text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
