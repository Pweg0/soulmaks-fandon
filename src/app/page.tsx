import type { Metadata } from 'next'
import CountdownTimer from "@/components/home/CountdownTimer"
import { videoGameSchema, websiteSchema } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Em Breve — SoulmaskBR',
  description: 'O guia completo de Soulmask em português está chegando. Wiki, server list, mapa interativo e muito mais.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
      />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,151,58,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-10 max-w-4xl text-center">
          {/* Logo */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-none"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            SoulmaskBR
          </h1>

          {/* Subtitle */}
          <div className="space-y-3">
            <p
              className="text-2xl md:text-4xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              LANCAMENTO DA VERSAO 1.0
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              O guia completo de Soulmask em portugues esta quase pronto.
              Wiki, server list, mapa interativo e muito mais.
            </p>
          </div>

          {/* Divider */}
          <div className="w-32 h-px bg-primary/40" />

          {/* Countdown */}
          <CountdownTimer />

          {/* Divider */}
          <div className="w-32 h-px bg-primary/40" />

          {/* Bottom info */}
          <p className="text-sm text-muted-foreground">
            Lancamento hoje as <span className="text-primary font-bold">21:00</span> (horario de Brasilia)
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-border my-4" />

          {/* Protest section */}
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6 space-y-4">
              <h2
                className="text-xl md:text-2xl font-bold text-red-500 text-center uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                #SoulmaskNeedsSA
              </h2>

              {/* English */}
              <div className="space-y-2">
                <p className="text-xs text-red-400/70 uppercase tracking-wider font-medium">English</p>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                  <strong>Dear Qooland Games / CampFire Studio,</strong>
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  The South American community has been loyal to Soulmask since day one. We buy your game, we fill your servers, we build communities, we create content. Yet we are forced to play on North American or European servers with <span className="text-red-400 font-bold">200+ ms ping</span>, making PvP unplayable and PvE frustrating.
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  Every major survival game — ARK, Rust, Conan Exiles, Palworld — provides South American servers. <strong className="text-foreground">Soulmask is the exception, and that is unacceptable.</strong> We are not asking for a favor. We are paying customers demanding the bare minimum: <span className="text-primary font-bold">official South American servers</span>.
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  The Brazilian and LATAM community is massive. We deserve to play the game we paid for without the handicap of distance. <strong className="text-red-400">Give us SA servers. We will not stop asking.</strong>
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-red-900/30" />

              {/* Portuguese */}
              <div className="space-y-2">
                <p className="text-xs text-red-400/70 uppercase tracking-wider font-medium">Portugues</p>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                  <strong>Prezados Qooland Games / CampFire Studio,</strong>
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  A comunidade sul-americana tem sido leal ao Soulmask desde o primeiro dia. Compramos o jogo de voces, lotamos seus servidores, construimos comunidades e criamos conteudo. Mesmo assim, somos obrigados a jogar em servidores norte-americanos ou europeus com <span className="text-red-400 font-bold">200+ ms de ping</span>, tornando o PvP injogavel e o PvE frustrante.
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  Todo grande jogo de sobrevivencia — ARK, Rust, Conan Exiles, Palworld — oferece servidores sul-americanos. <strong className="text-foreground">Soulmask e a excecao, e isso e inaceitavel.</strong> Nao estamos pedindo um favor. Somos clientes pagantes exigindo o minimo: <span className="text-primary font-bold">servidores oficiais na America do Sul</span>.
                </p>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  A comunidade brasileira e latino-americana e enorme. Merecemos jogar o jogo que pagamos sem a desvantagem da distancia. <strong className="text-red-400">Nos deem servidores SA. Nao vamos parar de pedir.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
