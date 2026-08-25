import { useSim } from './sim/store'

const STEPS = [
  {
    n: '01',
    t: 'Extraer',
    d: 'Un rover mina regolito helado en un cráter polar (PSR), donde la NASA confirmó hielo de agua.',
    icon: '⛏️',
  },
  {
    n: '02',
    t: 'Procesar',
    d: 'Un horno sublima el hielo, lo condensa y lo separa en agua potable, oxígeno e hidrógeno.',
    icon: '⚗️',
  },
  {
    n: '03',
    t: 'Sostener',
    d: 'La base recicla más del 93% del agua, como la Estación Espacial Internacional.',
    icon: '🏠',
  },
]

const STATS = [
  { v: '~5%', l: 'hielo en el regolito polar' },
  { v: '6.000+ M$', l: 'costaría llevar 1 tonelada de agua desde la Tierra' },
  { v: '>93%', l: 'del agua se recupera con reciclaje tipo ISS' },
]

export default function Landing({ onStart }) {
  const setMode = useSim((s) => s.setMode)
  return (
    <div className="min-h-screen bg-[#05060c] text-slate-100 font-sans overflow-y-auto">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 120%, #3b5a8f55, transparent), radial-gradient(circle at 80% 15%, #1c274055, transparent 50%)' }}
        />
        {/* luna CSS */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-slate-200 to-slate-500 shadow-[0_0_80px_20px_rgba(200,215,255,0.25)] mb-8">
          <div className="absolute w-4 h-4 rounded-full bg-slate-400/70 top-7 left-8" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-400/60 top-14 left-14" />
          <div className="absolute w-3 h-3 rounded-full bg-slate-400/50 top-9 left-20" />
        </div>
        <h1 className="relative text-5xl md:text-7xl font-black tracking-[0.15em] text-white mb-4">MOONWATER</h1>
        <p className="relative text-lg md:text-2xl text-sky-300 font-light max-w-2xl mb-3">
          Agua en la Luna.
        </p>
        <p className="relative text-sm md:text-base text-slate-400 max-w-xl mb-10 leading-relaxed">
          La NASA confirmó hielo de agua en los polos lunares. Construimos un simulador 3D
          interactivo que muestra cómo extraerla, procesarla y sostener una base con ella.
        </p>
        <div className="relative flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setMode('free') || onStart()}
            className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-8 py-4 font-semibold transition shadow-[0_0_30px_rgba(56,150,220,0.4)]"
          >
            Explorar el simulador
          </button>
          <button
            onClick={() => setMode('compete') || onStart()}
            className="border border-amber-400/60 text-amber-300 hover:bg-amber-400/10 rounded-xl px-8 py-4 font-semibold transition"
          >
            ⚔️ Modo competitivo
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-slate-800/60">
        <h2 className="text-center text-3xl font-bold mb-3">¿Cómo se obtiene agua en la Luna?</h2>
        <p className="text-center text-slate-400 text-sm mb-14 max-w-xl mx-auto">
          Tres etapas, todas basadas en tecnología real que NASA ya está desarrollando para Artemis.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 hover:border-sky-700/60 transition">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-slate-600 font-mono text-sm">{s.n}</span>
              </div>
              <h3 className="text-xl font-bold text-sky-300 mb-2">{s.t}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Datos */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.v} className="py-8">
              <div className="text-4xl font-mono font-bold text-sky-300 mb-2">{s.v}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ajustá los parámetros.<br />Hacé funcionar la base.
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Tripulación, concentración de hielo, potencia solar: cada decisión afecta si la base sobrevive.
        </p>
        <button
          onClick={onStart}
          className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-10 py-4 font-semibold transition shadow-[0_0_30px_rgba(56,150,220,0.4)]"
        >
          Empezar ahora
        </button>
      </section>

      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-600">
        MoonWater · NASA Space Apps Challenge 2026 · Datos: NASA LCROSS · LRO · ISS ECLSS
      </footer>
    </div>
  )
}
