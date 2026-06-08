import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import type { Dzien } from '../types/diet'

interface MacroRingsProps {
  day: Dzien
}

const MACROS = [
  { key: 'bialko_g', label: 'Białko', color: '#10b981', target: 180, unit: 'g' },
  { key: 'weglowodany_g', label: 'Węglowodany', color: '#6366f1', target: 160, unit: 'g' },
  { key: 'tluszcze_g', label: 'Tłuszcze', color: '#f59e0b', target: 70, unit: 'g' },
] as const

export default function MacroRings({ day }: MacroRingsProps) {
  const macroData = MACROS.map((macro) => {
    const value = day.makroskladniki[macro.key]
    const pct = Math.min(100, Math.round((value / macro.target) * 100))
    return { ...macro, value, pct }
  })

  const ringData = macroData.map((m) => ({
    name: m.label,
    value: m.pct,
    fill: m.color,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-[#141416] border border-[#232326] p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-zinc-100">Makroskładniki</h2>
        <span className="text-xs text-zinc-500">{day.dzien_tygodnia}, {day.data}</span>
      </div>
      <p className="text-xs text-zinc-600 mb-4">% celu dziennego</p>

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={75}
              barSize={10}
              data={ringData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: '#232326' }}
                dataKey="value"
                cornerRadius={5}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-zinc-100">{day.kalorie_spozyte.toLocaleString('pl-PL')}</span>
            <span className="text-[10px] text-zinc-500">kcal</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {macroData.map((macro) => (
            <motion.div
              key={macro.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-xs font-medium text-zinc-400">{macro.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold" style={{ color: macro.color }}>
                    {macro.value}
                  </span>
                  <span className="text-[10px] text-zinc-600">{macro.unit}</span>
                  <span className="text-[10px] text-zinc-600 ml-1">/ {macro.target}{macro.unit}</span>
                </div>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden bg-[#232326]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${macro.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
