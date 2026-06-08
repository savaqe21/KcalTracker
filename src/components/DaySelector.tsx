import { motion } from 'framer-motion'
import type { Dzien } from '../types/diet'

interface DaySelectorProps {
  days: Dzien[]
  selectedIndex: number
  onChange: (index: number) => void
}

export default function DaySelector({ days, selectedIndex, onChange }: DaySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-[#141416] border border-[#232326] p-5"
    >
      <h2 className="text-base font-semibold text-zinc-100 mb-4">Wybierz dzień</h2>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isDeficit = day.bilans <= 0
          const isSelected = index === selectedIndex
          const accentColor = isDeficit ? '#10b981' : '#f43f5e'
          const pct = Math.min(100, Math.abs((day.bilans / day.limit_bazowy) * 100))

          return (
            <motion.button
              key={day.data}
              whileTap={{ scale: 0.94 }}
              whileHover={{ y: -2 }}
              onClick={() => onChange(index)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#1a1a1d] border-[#3f3f46]'
                  : 'bg-[#0f0f11] border-[#1a1a1d] hover:border-[#232326]'
              }`}
            >
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                {day.dzien_tygodnia.slice(0, 3)}
              </span>

              <div className="relative w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                  <circle
                    cx="16" cy="16" r="12"
                    fill="none"
                    stroke="#232326"
                    strokeWidth="3"
                  />
                  <circle
                    cx="16" cy="16" r="12"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 75.4} 75.4`}
                    strokeOpacity={isSelected ? 1 : 0.6}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[8px] font-bold"
                  style={{ color: accentColor }}
                >
                  {isDeficit ? '−' : '+'}
                </span>
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-zinc-200 leading-none">
                  {(day.kalorie_spozyte / 1000).toFixed(1)}
                  <span className="text-[9px] text-zinc-500">k</span>
                </p>
              </div>

              <div
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}18`,
                }}
              >
                {isDeficit ? day.bilans : `+${day.bilans}`}
              </div>

              {isSelected && (
                <motion.div
                  layoutId="day-indicator"
                  className="absolute -bottom-px left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
