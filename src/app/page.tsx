import type { Metadata } from 'next'
import CountdownTimer from "@/components/home/CountdownTimer"

export const metadata: Metadata = {
  title: 'Soulmask 1.0 — Lancamento Oficial',
  description: 'Contagem regressiva para o lancamento oficial do Soulmask 1.0.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 max-w-3xl w-full text-center">
        {/* Title */}
        <div className="space-y-4">
          <p className="text-sm md:text-base text-neutral-500 uppercase tracking-[0.4em]">
            Lancamento Oficial
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-amber-500 leading-none"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Soulmask 1.0
          </h1>
        </div>

        {/* Line */}
        <div className="w-24 h-px bg-amber-500/30" />

        {/* Countdown */}
        <CountdownTimer />

        {/* Launch time */}
        <p className="text-sm text-neutral-500">
          Hoje as <span className="text-amber-500 font-semibold">21:00</span> — Horario de Brasilia
        </p>

        {/* Spacer */}
        <div className="w-16 h-px bg-neutral-800 mt-6" />

        {/* Protest */}
        <div className="max-w-2xl w-full border border-red-900/40 bg-red-950/10 rounded-lg p-6 md:p-8 space-y-5 text-left">
          <h2
            className="text-lg md:text-xl font-bold text-red-500 text-center uppercase tracking-widest"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            #SoulmaskNeedsSA
          </h2>

          {/* English */}
          <div className="space-y-3">
            <p className="text-[10px] text-red-400/50 uppercase tracking-widest">English</p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              <strong className="text-white">Dear Qooland Games / CampFire Studio,</strong>
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              The South American community has been loyal to Soulmask since day one. We buy your game, we fill your servers, we build communities, we create content. Yet we are forced to play on NA/EU servers with{" "}
              <span className="text-red-400 font-bold">200+ ms ping</span>, making PvP unplayable and PvE frustrating.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every major survival game — ARK, Rust, Conan Exiles, Palworld — provides South American servers.{" "}
              <strong className="text-white">Soulmask is the exception, and that is unacceptable.</strong>{" "}
              We are paying customers demanding the bare minimum:{" "}
              <span className="text-amber-500 font-bold">official SA servers</span>.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              <strong className="text-red-400">Give us SA servers. We will not stop asking.</strong>
            </p>
          </div>

          <div className="w-full h-px bg-red-900/20" />

          {/* Portuguese */}
          <div className="space-y-3">
            <p className="text-[10px] text-red-400/50 uppercase tracking-widest">Portugues</p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              <strong className="text-white">Prezados Qooland Games / CampFire Studio,</strong>
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              A comunidade sul-americana tem sido leal ao Soulmask desde o primeiro dia. Compramos o jogo, lotamos seus servidores, construimos comunidades e criamos conteudo. Mesmo assim, somos obrigados a jogar em servidores NA/EU com{" "}
              <span className="text-red-400 font-bold">200+ ms de ping</span>, tornando o PvP injogavel e o PvE frustrante.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Todo grande jogo de sobrevivencia — ARK, Rust, Conan Exiles, Palworld — oferece servidores sul-americanos.{" "}
              <strong className="text-white">Soulmask e a excecao, e isso e inaceitavel.</strong>{" "}
              Somos clientes pagantes exigindo o minimo:{" "}
              <span className="text-amber-500 font-bold">servidores oficiais na America do Sul</span>.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              <strong className="text-red-400">Nos deem servidores SA. Nao vamos parar de pedir.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
