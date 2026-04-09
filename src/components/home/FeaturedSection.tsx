import { Card, CardContent } from "@/components/ui/card"

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-bold text-foreground mb-4"
      style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
    >
      {children}
    </h2>
  )
}

function EmptyCard({
  heading,
  body,
}: {
  heading: string
  body: string
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <p className="text-base font-bold text-foreground mb-1">{heading}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  )
}

export default function FeaturedSection() {
  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ultimas Noticias */}
        <div>
          <SectionHeading>Ultimas Noticias</SectionHeading>
          <EmptyCard
            heading="Nenhuma noticia ainda"
            body="O conteudo estara disponivel em breve. Volte mais tarde."
          />
        </div>

        {/* Servidores em Destaque */}
        <div>
          <SectionHeading>Servidores em Destaque</SectionHeading>
          <EmptyCard
            heading="Nenhum servidor cadastrado ainda"
            body="Seja o primeiro a cadastrar seu servidor."
          />
        </div>
      </div>
    </div>
  )
}
