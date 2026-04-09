import Link from "next/link"
import { Sword, Drama, BookOpen, Newspaper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    icon: Sword,
    title: "Itens & Crafting",
    description: "Recursos, armas, armaduras e receitas de crafting",
    href: "/wiki/itens",
  },
  {
    icon: Drama,
    title: "Mascaras & Skills",
    description: "Habilidades, builds e guias de mascaras",
    href: "/wiki/mascaras",
  },
  {
    icon: BookOpen,
    title: "Guias & Tutoriais",
    description: "Guias para iniciantes e estrategias avancadas",
    href: "/guias",
  },
  {
    icon: Newspaper,
    title: "Patch Notes",
    description: "Ultimas atualizacoes e notas de versao",
    href: "/patch-notes",
  },
]

export default function CategoryCards() {
  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
