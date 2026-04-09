import type { Metadata } from 'next'
import CountdownTimer from "@/components/home/CountdownTimer"

export const metadata: Metadata = {
  title: 'Soulmask 1.0 — Lancamento Oficial',
  description: 'Contagem regressiva para o lancamento oficial do Soulmask 1.0.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 w-full text-center">
        {/* Title + Countdown centered */}
        <p className="text-xs text-neutral-600 uppercase tracking-[0.4em]">
          Lancamento Oficial
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-amber-500 leading-none"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          Soulmask 1.0
        </h1>

        <div className="border border-white/20 rounded-2xl w-[340px] md:w-[520px] lg:w-[600px] h-[120px] md:h-[160px] lg:h-[180px] flex items-center justify-center">
          <CountdownTimer />
        </div>

        <p className="text-xs text-neutral-600">
          Hoje as <span className="text-amber-500">21:00</span> BRT
        </p>

        {/* Spacer */}
        <div className="w-12 h-px bg-neutral-800 mt-4" />

        {/* Protest — wide and compact */}
        <div className="w-full max-w-5xl border border-green-700/40 bg-green-950/10 rounded px-6 py-4 space-y-3">
          <p
            className="text-sm font-bold text-yellow-400 text-center uppercase tracking-widest"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            #SoulmaskNeedsSA
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* English */}
            <div className="flex-1 space-y-1">
              <p className="text-[9px] text-green-500/50 uppercase tracking-widest">EN</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                The SA community buys your game, fills your servers, creates content — yet plays on NA/EU with <span className="text-yellow-400 font-bold">200+ ms</span>. ARK, Rust, Conan, Palworld all have SA servers. <strong className="text-white">Soulmask doesn&apos;t. Unacceptable.</strong> <span className="text-green-400 font-bold">Give us SA servers.</span>
              </p>
            </div>

            <div className="hidden md:block w-px bg-green-800/30" />

            {/* Portuguese */}
            <div className="flex-1 space-y-1">
              <p className="text-[9px] text-green-500/50 uppercase tracking-widest">PT</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                A comunidade SA compra o jogo, lota os servidores, cria conteudo — e joga em NA/EU com <span className="text-yellow-400 font-bold">200+ ms</span>. ARK, Rust, Conan, Palworld tem servidores SA. <strong className="text-white">Soulmask nao tem. Inaceitavel.</strong> <span className="text-green-400 font-bold">Nos deem servidores SA.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
