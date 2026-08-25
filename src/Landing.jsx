import { useEffect, useRef, useState } from 'react'
import { useSim } from './sim/store'
import Scene from './Scene'

// Aparece suavemente al entrar en viewport
function Reveal({ children, delay = 0 }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    t: 'Extraer',
    d: 'En los cráteres polares hay zonas que nunca vieron el sol en 4.000 millones de años. Ahí, el agua permanece como hielo mezclado con el regolito. Un rover mina ese suelo helado.',
    icon: '⛏️',
    tag: 'Rover minero',
  },
  {
    n: '02',
    t: 'Procesar',
    d: 'El regolito entra a un horno que sublima el hielo. El vapor se condensa en agua pura y una electrólisis la separa en oxígeno para respirar e hidrógeno para combustible.',
    icon: '⚗️',
    tag: 'Planta ISRU',
  },
  {
    n: '03',
    t: 'Sostener',
    d: 'Cada gota cuenta: la base recicla aguas grises, humedad y más del 93% de todo lo que consume, igual que la Estación Espacial Internacional lo hace hoy.',
    icon: '🏠',
    tag: 'Hábitat + ECLSS',
  },
]

const FACTS = [
  {
    v: '1998–2020',
    l: 'Cuatro misiones (Lunar Prospector, LCROSS, Chandrayaan-1, SOFIA) confirmaron hielo de agua en los polos lunares.',
  },
  {
    v: '~600 Mton',
    l: 'Estimaciones del USGS sugieren miles de millones de toneladas de hielo en las Regiones de Sombra Permanente.',
  },
  {
    v: '1 botella = 83.000 U$S',
    l: 'Llevar un litro de agua a la Luna cuesta decenas de miles de dólares. Extraerla allá cambia toda la economía espacial.',
  },
  {
    v: 'Artemis III',
    l: 'NASA planea volver con astronautas al polo sur lunar. El agua local es clave para quedarse.',
  },
]

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  )
}

export default function Landing({ onStart }) {
  const setMode = useSim((s) => s.setMode)
  const startFree = () => { setMode('free'); onStart() }
  const startComp = () => { setMode('compete'); onStart() }

  return (
    <div className="min-h-screen bg-[#05060c] text-slate-100 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-[#05060c]/70 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <span className="font-black tracking-[0.2em] text-sky-300">MOONWATER</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Stars />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 115%, #3b5a8f44, transparent), radial-gradient(circle at 82% 12%, #22305533, transparent 45%)' }}
        />
        {/* Luna */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_0_120px_30px_rgba(190,210,255,0.28)] mb-10 animate-[float_7s_ease-in-out_infinite]">
          <div className="absolute w-5 h-5 rounded-full bg-slate-400/70 top-9 left-11" />
          <div className="absolute w-3 h-3 rounded-full bg-slate-400/60 top-20 left-20" />
          <div className="absolute w-4 h-4 rounded-full bg-slate-400/50 top-12 left-27" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-400/70 top-26 left-8" />
        </div>
        <p className="relative text-sky-400 tracking-[0.35em] text-xs md:text-sm mb-4 uppercase">Hay agua en la Luna. Nosotros vamos a buscarla.</p>
        <h1 className="relative text-6xl md:text-8xl font-black tracking-[0.12em] text-white mb-6 drop-shadow-[0_0_40px_rgba(120,180,255,0.35)]">
          MOONWATER
        </h1>
        <p className="relative text-base md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light">
          El primer simulador 3D interactivo de una base lunar autosustentable:
          extraé hielo del regolito, convertilo en agua potable, oxígeno y combustible,
          y mantené viva a tu tripulación.
        </p>
        <div className="relative flex flex-col sm:flex-row gap-4">
          <button onClick={startFree} className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-9 py-4 font-semibold transition shadow-[0_0_40px_rgba(56,150,220,0.45)]">
            Explorar el simulador
          </button>
          <a href="#como" className="border border-slate-600 hover:border-slate-400 text-slate-300 rounded-xl px-9 py-4 font-semibold transition">
            ¿Cómo funciona?
          </a>
        </div>
        <div className="absolute bottom-6 text-slate-600 animate-bounce text-xl">↓</div>
      </section>

      {/* CIENCIA */}
      <Section id="ciencia" className="py-24 border-t border-slate-800/60">
        <p className="text-sky-400 text-xs tracking-[0.3em] uppercase mb-3">La ciencia es real</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl">
          El agua está ahí. La tecnología para alcanzarla ya existe.
        </h2>
        <p className="text-slate-400 max-w-3xl mb-12 leading-relaxed">
          Desde 1998, múltiples misiones detectaron y confirmaron hielo de agua dentro de cráteres
          polares que nunca reciben luz solar. Es uno de los recursos más valiosos del sistema solar:
          <span className="text-slate-200"> el agua es bebida, oxígeno y combustible.</span>{' '}
          Extraerla en el lugar lo cambia todo — y nosotros lo hacemos visible.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FACTS.map((f, i) => (
            <Reveal key={f.v} delay={i * 120}>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-transparent p-6">
                <div className="text-2xl font-mono font-bold text-sky-300 mb-3">{f.v}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{f.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section id="como" className="py-24">
        <p className="text-sky-400 text-xs tracking-[0.3em] uppercase mb-3">Cómo funciona</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-14">Del hielo enterrado al vaso de agua</h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-sky-800 via-sky-600 to-emerald-700" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 150}>
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-7 hover:border-sky-700/60 hover:-translate-y-1 transition duration-300">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl mb-5 ring-4 ring-[#05060c]">{s.icon}</div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-sky-300">{s.t}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 rounded-full px-2 py-0.5">{s.tag}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* SIMULADOR EN VIVO */}
      <Section id="simulador" className="py-24">
        <p className="text-sky-400 text-xs tracking-[0.3em] uppercase mb-3">Probalo ahora</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">La base, funcionando en vivo</h2>
        <p className="text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Esto no es un video: es la simulación corriendo en tu navegador en este momento.
          Pozo de hielo, planta ISRU, hábitat y cada gota viajando entre estaciones.
        </p>
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(40,90,160,0.25)] relative">
          <div
            className="h-[420px] md:h-[560px]"
            style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 110%, #2a4a7f55, #0b1020 60%, #05060c)' }}
          ><Scene /></div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
            <button onClick={startFree} className="bg-sky-600/95 hover:bg-sky-500 rounded-xl px-6 py-3 text-sm font-semibold backdrop-blur transition">
              Tomar el control →
            </button>
            <button onClick={startComp} className="bg-black/60 hover:bg-amber-600/90 border border-amber-500/50 text-amber-300 rounded-xl px-6 py-3 text-sm font-semibold backdrop-blur transition">
              ⚔️ Modo competitivo
            </button>
          </div>
        </div>
      </Section>

      {/* MODO COMPETITIVO */}
      <Section className="py-24">
        <Reveal>
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-slate-900/20 p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">Desafío</p>
            <h2 className="text-3xl font-bold mb-5">¿Podés mantener viva la base 30 días?</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Ajustá tripulación, minería, reciclaje y energía. Si el banco de agua llega a cero
              o la energía colapsa, la misión falla. Si sobrevivís, tu puntaje refleja qué tan
              eficiente fue tu diseño. <span className="text-amber-300">Compite con tu equipo, tu clase o el mundo.</span>
            </p>
            <button onClick={startComp} className="bg-amber-500 hover:bg-amber-400 text-black rounded-xl px-8 py-3.5 font-bold transition">
              ⚔️ Aceptar el desafío
            </button>
          </div>
          <div className="space-y-4">
            {[
              ['💧', 'Banco de agua > 0', 'Si se agota, la tripulación no sobrevive'],
              ['⚡', 'Energía balanceada', 'Los paneles solares deben cubrir minería y electrólisis'],
              ['📈', 'Puntaje por eficiencia', 'Cobertura de demanda + agua acumulada + margen energético'],
            ].map(([i, t, d]) => (
              <div key={t} className="flex gap-4 items-start bg-black/30 rounded-xl p-4 border border-slate-800">
                <span className="text-2xl">{i}</span>
                <div>
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </Section>

      {/* EQUIPO */}
      <Section id="equipo" className="py-24 border-t border-slate-800/60">
        <p className="text-sky-400 text-xs tracking-[0.3em] uppercase mb-3">Equipo</p>
        <div className="text-center pb-24">
          <h3 className="text-2xl font-bold mb-8">El futuro se construye con agua lunar.</h3>
          <button onClick={startFree} className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-10 py-4 font-semibold transition shadow-[0_0_40px_rgba(56,150,220,0.4)]">
            Empezar ahora
          </button>
        </div>
      </Section>

      <footer className="border-t border-slate-800/60 py-10 text-center text-xs text-slate-600">
        MOONWATER · NASA Space Apps Challenge 2026<br />
        Datos: NASA LCROSS · Lunar Reconnaissance Orbiter · ISS ECLSS · Artemis Program
      </footer>

      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }
      `}</style>
    </div>
  )
}

function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(70)].map((_, i) => {
        const x = (i * 137.5) % 100
        const y = (i * 61.8) % 100
        const s = i % 3 === 0 ? 2 : 1
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, opacity: 0.15 + ((i * 37) % 60) / 100 }}
          />
        )
      })}
    </div>
  )
}
