import { useEffect } from 'react'
import Scene from './Scene'
import { useSim } from './sim/store'

const PARAMS = [
  { k: 'crew', label: 'Tripulación (astronautas)', min: 1, max: 12, step: 1 },
  { k: 'iceContent', label: 'Hielo en regolito (%)', min: 0.5, max: 15, step: 0.5 },
  { k: 'roverRate', label: 'Minería regolito (kg/h)', min: 20, max: 500, step: 10 },
  { k: 'extractionEff', label: 'Eficiencia extracción', min: 0.3, max: 0.95, step: 0.05 },
  { k: 'recycleEff', label: 'Eficiencia reciclaje ECLSS', min: 0.5, max: 0.99, step: 0.01 },
  { k: 'solarPower', label: 'Potencia solar (kW)', min: 10, max: 200, step: 5 },
]

function Slider({ p }) {
  const v = useSim((s) => s.params[p.k])
  const set = useSim((s) => s.setParam)
  return (
    <label className="block mb-3 text-xs">
      <span className="text-slate-300">
        {p.label}: <b className="text-sky-300 font-mono">{v}</b>
      </span>
      <input
        type="range" min={p.min} max={p.max} step={p.step} value={v}
        onChange={(e) => set(p.k, parseFloat(e.target.value))}
        className="w-full accent-sky-400 mt-1"
      />
    </label>
  )
}

function Metrics() {
  const m = useSim((s) => s.metrics)
  const bank = useSim((s) => s.bank)
  const t = useSim((s) => s.time)
  const row = (label, value, cls = '') => (
    <div key={label} className="flex justify-between gap-2">
      <span className="text-slate-400">{label}</span>
      <b className={`font-mono tabular-nums ${cls || 'text-slate-100'}`}>{value}</b>
    </div>
  )
  return (
    <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1">
      {row('Días simulados', (t / 24).toFixed(1))}
      {row('Demanda hábitat', `${m.dailyUse.toFixed(0)} kg/día`)}
      {row('Reciclado', `${m.recycled.toFixed(0)} kg/día`)}
      {row('Extraído ISRU', `${m.produced.toFixed(0)} kg/día`)}
      {row('Cierre del loop', `${(m.closure * 100).toFixed(0)}%`, m.closure >= 1 ? 'text-emerald-400' : 'text-amber-400')}
      {row('Banco de agua', `${bank.toFixed(0)} kg`)}
      {row('Energía requerida', `${m.powerNeededKw.toFixed(1)} kW`)}
      {row('Margen solar', `${m.powerMarginKw.toFixed(1)} kW`, m.powerMarginKw >= 0 ? 'text-emerald-400' : 'text-red-400')}
    </div>
  )
}

export default function App() {
  const running = useSim((s) => s.running)
  const toggle = useSim((s) => s.toggleRun)
  const reset = useSim((s) => s.reset)
  const tick = useSim((s) => s.tick)
  const mode = useSim((s) => s.mode)
  const setMode = useSim((s) => s.setMode)
  const bank = useSim((s) => s.bank)
  const m = useSim((s) => s.metrics)
  const result = useSim((s) => s.result)
  const simTime = useSim((s) => s.time)

  useEffect(() => {
    if (!running) return
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [running, tick])

  const day = Math.min(30, Math.floor(simTime / 24))
  const bestScore = Number(localStorage.getItem('moonwater-best') || 0)
  if (result?.win && result.score > bestScore) localStorage.setItem('moonwater-best', String(result.score))

  return (
    <div className="h-screen flex flex-col bg-[#0b0d14] text-slate-100 font-sans">
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`rounded-2xl border p-8 text-center max-w-sm ${result.win ? 'border-emerald-500 bg-emerald-950/80' : 'border-red-500 bg-red-950/80'}`}>
            <div className="text-5xl mb-3">{result.win ? '🏆' : '💥'}</div>
            <h2 className="text-xl font-bold mb-1">{result.win ? '¡Misión cumplida!' : 'Misión fallida'}</h2>
            <p className="text-sm text-slate-300 mb-4">{result.reason}</p>
            <p className="text-4xl font-mono font-bold text-sky-300 mb-4">{result.score} pts</p>
            <p className="text-xs text-slate-400">Mejor puntaje: {Math.max(bestScore, result.score)}</p>
            <button
              onClick={() => setMode(mode)}
              className="mt-5 bg-sky-700 hover:bg-sky-600 border border-sky-400 rounded-md px-6 py-2 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
      <header className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold tracking-widest text-sky-300">MOONWATER · El loop que empieza en la Tierra</h1>
          <p className="text-xs text-slate-500">
            Ciclo cerrado de agua lunar — simulador paramétrico con datos NASA · espejo del sistema hídrico de Delfín Gallo, Tucumán
          </p>
        </div>
        <div className="flex gap-2">
          {['free', 'compete'].map((mo) => (
            <button
              key={mo}
              onClick={() => setMode(mo)}
              className={`rounded-md px-4 py-2 text-sm border transition ${
                mode === mo
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mo === 'free' ? 'Modo libre' : '⚔️ Competitivo'}
            </button>
          ))}
        </div>
      </header>
      <main className="flex flex-1 min-h-0">
        <aside className="w-84 shrink-0 overflow-y-auto p-4 border-r border-slate-800">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Parámetros</h2>
          {PARAMS.map((p) => <Slider key={p.k} p={p} />)}
          <div className="flex gap-2 my-4">
            <button
              onClick={toggle}
              className="bg-sky-900 hover:bg-sky-700 border border-sky-600 rounded-md px-4 py-2 text-sm text-sky-100 transition"
            >
              {running ? 'Pausar' : 'Simular'}
            </button>
            <button
              onClick={reset}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-sm transition"
            >
              Reiniciar
            </button>
          </div>
          <Metrics />
          {mode === 'compete' && (
            <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-amber-300 font-bold">Sol {day}/30</span>
                <span className="text-amber-200/70">Récord: {bestScore}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${day >= 24 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${(day / 30) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-amber-100/70 leading-relaxed">
                Sobreviví 30 días lunares: banco de agua &gt; 0 y margen de energía ≥ 0.
                Puntaje = cierre del loop + agua acumulada + eficiencia energética.
              </p>
            </div>
          )}
          <div className="mt-5 pt-3 border-t border-slate-800 text-xs leading-relaxed text-slate-400 space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-slate-400">El espejo terrestre</h2>
            <p>
              En Delfín Gallo el problema no fue la fuente (los pozos) sino la red:
              sin interconexiones, cada barrio depende de pocas conducciones.
              Un loop abierto y fragmentado.
            </p>
            <p>
              En la Luna no hay ríos ni lluvia: cada gota debe cerrar su ciclo.
              La ingeniería que hace posible vivir allí — reciclar &gt;93%,
              balancear masa y energía, priorizar inversiones — es la misma
              que necesita la Tierra para cerrar sus propios loops hídricos.
            </p>
            <p className="italic text-amber-300">
              No vamos a la Luna a escapar del problema. Vamos porque nos obliga a resolverlo en su forma más pura.
            </p>
          </div>
        </aside>
        <section className="flex-1 min-w-0"><Scene /></section>
      </main>
    </div>
  )
}
