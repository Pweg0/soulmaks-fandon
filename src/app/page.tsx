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
        </div>
      </div>
    </>
  )
}
