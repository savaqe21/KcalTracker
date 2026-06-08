import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tydzien } from '../types/diet'

interface WeekSelectorProps {
  weeks: Tydzien[]
  selectedWeekIndex: number
  onChange: (index: number) => void
}

export default function WeekSelector({ weeks, selectedWeekIndex, onChange }: WeekSelectorProps) {
  const current = weeks[selectedWeekIndex]

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onChange(Math.max(0, selectedWeekIndex - 1))}
        disabled={selectedWeekIndex === 0}
        className="p-2 rounded-xl bg-[#141416] border border-[#232326] text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Poprzedni tydzień"
      >
        <ChevronLeft size={16} />
      </motion.button>

      <div className="flex gap-2">
        {weeks.map((week, idx) => (
          <motion.button
            key={week.tydzien_numer}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(idx)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              idx === selectedWeekIndex
                ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                : 'bg-[#141416] border-[#232326] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
            }`}
          >
            Tydzień {week.tydzien_numer}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onChange(Math.min(weeks.length - 1, selectedWeekIndex + 1))}
        disabled={selectedWeekIndex === weeks.length - 1}
        className="p-2 rounded-xl bg-[#141416] border border-[#232326] text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Następny tydzień"
      >
        <ChevronRight size={16} />
      </motion.button>

      {current && (
        <span className="ml-2 text-xs text-zinc-500 hidden sm:block">
          {current.zakres_dat}
        </span>
      )}
    </div>
  )
}
