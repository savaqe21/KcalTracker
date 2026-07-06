import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tydzien } from '../types/diet'

interface WeekSelectorProps {
  weeks: Tydzien[]
  selectedWeekIndex: number
  onChange: (index: number) => void
}

const VISIBLE = 3

function getWindowStart(selected: number, total: number): number {
  const ideal = selected - Math.floor(VISIBLE / 2)
  return Math.max(0, Math.min(ideal, total - VISIBLE))
}

export default function WeekSelector({ weeks, selectedWeekIndex, onChange }: WeekSelectorProps) {
  const total = weeks.length
  const [windowStart, setWindowStart] = useState(() => getWindowStart(selectedWeekIndex, total))
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const next = getWindowStart(selectedWeekIndex, total)
    setDirection(next > windowStart ? 1 : -1)
    setWindowStart(next)
  }, [selectedWeekIndex, total])

  const visibleWeeks = weeks.slice(windowStart, windowStart + VISIBLE)
  const canPrev = selectedWeekIndex > 0
  const canNext = selectedWeekIndex < total - 1

  const handlePrev = () => { if (canPrev) onChange(selectedWeekIndex - 1) }
  const handleNext = () => { if (canNext) onChange(selectedWeekIndex + 1) }

  const current = weeks[selectedWeekIndex]

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handlePrev}
        disabled={!canPrev}
        className="p-2 rounded-xl bg-[#141416] border border-[#232326] text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        aria-label="Poprzedni tydzień"
      >
        <ChevronLeft size={15} />
      </motion.button>

      <div className="relative overflow-hidden" style={{ width: `${VISIBLE * 88 + (VISIBLE - 1) * 6}px` }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={windowStart}
            initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-1.5"
          >
            {visibleWeeks.map((week, i) => {
              const idx = windowStart + i
              const isSelected = idx === selectedWeekIndex
              return (
                <motion.button
                  key={week.tydzien_numer}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onChange(idx)}
                  style={{ width: 88 }}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                      : 'bg-[#141416] border-[#232326] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                  }`}
                >
                  <span className="block text-center">Tyg.</span>
                  <span className="block text-center font-bold text-sm">{week.tydzien_numer}</span>
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handleNext}
        disabled={!canNext}
        className="p-2 rounded-xl bg-[#141416] border border-[#232326] text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        aria-label="Następny tydzień"
      >
        <ChevronRight size={15} />
      </motion.button>

      {current && (
        <span className="ml-1 text-xs text-zinc-500 hidden lg:block whitespace-nowrap">
          {current.zakres_dat}
        </span>
      )}
    </div>
  )
}
