import { create } from 'zustand'

const DT_HOURS = 1

// Parámetros basados en datos NASA reales
export const DEFAULTS = {
  crew: 4,                 // astronautas
  iceContent: 5.5,         // % en peso del regolito (LCROSS/Mini-SAR PSR)
  roverRate: 120,          // kg regolito/hora procesados por el LADI
  extractionEff: 0.75,     // fracción de hielo recuperado en cold trap
  recycleEff: 0.93,        // eficiencia loop ECLSS tipo ISS
  electrolysisEff: 0.7,    // eficiencia energética electrólisis PEM
  solarPower: 50,          // kW instalados (ridge iluminado)
}

// Consumos por astronauta (kg/día) — NASA ECLSS
const USE_PER_CREW = { drinking: 2.0, food: 0.6, hygiene: 3.0, washing: 4.4 }

function computeStep(s) {
  const usePerCrew = Object.values(USE_PER_CREW).reduce((a, b) => a + b, 0)
  const dailyUse = s.crew * usePerCrew                       // kg/día demanda hábitat
  const recycled = dailyUse * s.recycleEff                   // kg/día recuperado del loop
  const deficit = Math.max(0, dailyUse - recycled)           // kg/día a cubrir con ISRU

  const regolithHourly = s.roverRate * s.iceContent / 100 * s.extractionEff // kg agua/h
  const produced = regolithHourly * 24                       // kg/día extraído

  const surplus = produced - deficit                         // kg/día para reserva/propulsión
  const closure = dailyUse > 0 ? Math.min(1, (recycled + Math.min(produced, deficit)) / dailyUse) : 1

  const eExtraction = 0.02 * (s.roverRate / 100)             // kW aprox minería+termal
  const eElectro = surplus > 0 ? surplus / 24 * 5.5 / s.electrolysisEff : 0 // kWh/kg H2O ~5.5
  const powerUse = eExtraction + eElectro / 1000             // MW simplificado -> kW base
  const powerNeededKw = eExtraction + (surplus > 0 ? surplus * 5.5 / s.electrolysisEff / 24 : 0)

  return {
    dailyUse,
    recycled,
    deficit,
    produced,
    surplus,
    closure,
    powerNeededKw,
    powerMarginKw: s.solarPower - powerNeededKw,
    waterBank: 0,
  }
}

export const useSim = create((set, get) => ({
  params: DEFAULTS,
  time: 0,               // horas simuladas
  running: false,
  bank: 500,             // banco inicial de agua kg
  history: [],
  metrics: computeStep(DEFAULTS),
  mode: 'free',          // 'free' | 'compete'
  closureSum: 0,
  closureSamples: 0,
  result: null,          // { win, score }

  setParam: (k, v) => {
    const p = { ...get().params, [k]: v }
    set({ params: p, metrics: computeStep(p) })
  },
  toggleRun: () => set((s) => ({ running: !s.running })),
  reset: () => set({ time: 0, bank: 500, history: [], running: false, closureSum: 0, closureSamples: 0, result: null }),

  setMode: (m) => set((s) => ({
    mode: m,
    time: 0, bank: 500, history: [], running: false,
    closureSum: 0, closureSamples: 0, result: null,
  })),

  tick: () => {
    const s = get()
    if (!s.running) return
    const m = s.metrics
    const net = m.produced - m.deficit
    let bank = Math.max(0, s.bank + net * DT_HOURS)
    const t = s.time + DT_HOURS
    const closureSum = s.closureSum + m.closure
    const closureSamples = s.closureSamples + 1

    let result = null
    if (s.mode === 'compete') {
      const dead = bank <= 0.5 || (t > 2 && m.powerMarginKw < 0)
      if (dead) {
        result = {
          win: false,
          score: Math.round(closureSum / closureSamples * 500 + t / 24 * 10),
          reason: bank <= 0.5 ? 'Sin agua en el banco' : 'Colapso energético',
        }
      } else if (t >= 30 * 24) {
        const avgClosure = closureSum / closureSamples
        result = {
          win: true,
          score: Math.round(avgClosure * 1000 + bank * 2 + Math.max(0, m.powerMarginKw) * 5),
          reason: 'Misión completada',
        }
      }
    }
    set({
      bank, time: t,
      history: [...s.history.slice(-287), { t, bank, closure: m.closure }],
      closureSum, closureSamples,
      result,
      ...(result ? { running: false } : {}),
    })
  },
}))
