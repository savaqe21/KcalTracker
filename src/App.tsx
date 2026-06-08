import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, TrendingDown, Scale, Activity } from 'lucide-react'
import type { DietData, Tydzien } from './types/diet'
import WeekSelector from './components/WeekSelector'
import KPICard from './components/KPICard'
import MainChart from './components/MainChart'
import DaySelector from './components/DaySelector'
import MacroRings from './components/MacroRings'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#141416] border border-[#232326] animate-pulse ${className ?? ''}`} />
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-48 border-0" />
          <SkeletonBlock className="h-4 w-32 border-0" />
        </div>
        <SkeletonBlock className="h-10 w-64 border-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => <SkeletonBlock key={i} className="h-28" />)}
      </div>
      <SkeletonBlock className="h-72" />
      <SkeletonBlock className="h-36" />
      <SkeletonBlock className="h-52" />
    </div>
  )
}

export default function App() {
  const [data, setData] = useState<DietData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)

    fetch('./danekcal.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: nie można pobrać danych`)
        return res.json() as Promise<DietData>
      })
      .then((json) => {
        setData(json)
        const latestIndex = json.length - 1
        setSelectedWeekIndex(latestIndex)
        const latestWeek: Tydzien = json[latestIndex]
        const latestDayIndex = latestWeek.dni.length - 1
        setSelectedDayIndex(latestDayIndex)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Nieznany błąd')
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const handleWeekChange = (index: number) => {
    setSelectedWeekIndex(index)
    setSelectedDayIndex(0)
  }

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
        <div className="rounded-2xl bg-[#141416] border border-[#f43f5e]/30 p-8 max-w-md text-center space-y-3">
          <Activity size={32} className="text-[#f43f5e] mx-auto" />
          <h2 className="text-lg font-semibold text-zinc-100">Błąd ładowania danych</h2>
          <p className="text-sm text-zinc-400">{error}</p>
          <p className="text-xs text-zinc-600">Sprawdź, czy plik <code className="text-zinc-400">public/danekcal.json</code> istnieje.</p>
        </div>
      </div>
    )
  }

  if (!data?.length) return null

  const currentWeek = data[selectedWeekIndex]
  const currentDay = currentWeek.dni[selectedDayIndex]
  const summary = currentWeek.podsumowanie_tygodnia

  const weeklyBalance = summary.lacznie_spozyte_kcal - summary.laczny_limit_kcal
  const isWeekDeficit = weeklyBalance < 0
  const isWeekNeutral = weeklyBalance === 0

  const balanceLabel = isWeekNeutral
    ? 'Idealny bilans'
    : isWeekDeficit
    ? 'Wypracowany deficyt'
    : 'Tygodniowa nadwyżka'

  const balanceDescription = isWeekNeutral
    ? 'Dokładnie na limicie — zero na zero!'
    : isWeekDeficit
    ? 'Jesteś na deficycie'
    : 'Przekroczono limit tygodniowy'

  const balanceAccent = isWeekNeutral ? '#6366f1' : isWeekDeficit ? '#10b981' : '#f43f5e'

  const kpiCards = [
    {
      label: 'Łączne kalorie',
      value: summary.lacznie_spozyte_kcal,
      unit: 'kcal',
      icon: Flame,
      accentColor: '#f59e0b',
      bgColor: '#f59e0b18',
      description: `Limit tygodniowy: ${summary.laczny_limit_kcal.toLocaleString('pl-PL')} kcal`,
    },
    {
      label: balanceLabel,
      value: Math.abs(summary.wypracowany_deficyt_kcal),
      unit: 'kcal',
      icon: TrendingDown,
      accentColor: balanceAccent,
      bgColor: `${balanceAccent}18`,
      description: balanceDescription,
    },
    {
      label: 'Szacowany spalony tłuszcz',
      value: summary.szacowany_spalony_tluszcz_kg.toFixed(2),
      unit: 'kg',
      icon: Scale,
      accentColor: '#6366f1',
      bgColor: '#6366f118',
      description: 'Na podstawie deficytu kalorycznego',
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b]">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-[#232326]"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Dashboard Kalorii
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Twój osobisty tracker diety
            </p>
          </div>
          <WeekSelector
            weeks={data}
            selectedWeekIndex={selectedWeekIndex}
            onChange={handleWeekChange}
          />
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWeekIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {kpiCards.map((card, i) => (
                <KPICard key={card.label} {...card} index={i} />
              ))}
            </div>

            <MainChart
              week={currentWeek}
              selectedDayIndex={selectedDayIndex}
              onDayClick={setSelectedDayIndex}
            />

            <DaySelector
              days={currentWeek.dni}
              selectedIndex={selectedDayIndex}
              onChange={setSelectedDayIndex}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedWeekIndex}-${selectedDayIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MacroRings day={currentDay} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-zinc-700 pt-4 pb-2"
        >
          Dane pobierane dynamicznie z{' '}
          <code className="text-zinc-600">danekcal.json</code>
        </motion.footer>
      </div>
    </div>
  )
}
