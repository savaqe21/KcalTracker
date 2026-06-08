import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts'
import type { Tydzien } from '../types/diet'

interface MainChartProps {
  week: Tydzien
  selectedDayIndex: number
  onDayClick: (index: number) => void
}

interface TooltipPayloadItem {
  color: string
  name: string
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const spozyte = payload.find((p) => p.name === 'Spożyte')?.value ?? 0
  const limit = payload.find((p) => p.name === 'Limit')?.value ?? 0
  const diff = spozyte - limit

  return (
    <div className="bg-[#1a1a1d] border border-[#232326] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-zinc-400 mb-2 font-medium">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-sm mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
          <span className="text-zinc-400">{item.name}:</span>
          <span className="font-semibold text-zinc-100">{item.value.toLocaleString('pl-PL')} kcal</span>
        </div>
      ))}
      <div className={`mt-2 pt-2 border-t border-[#232326] text-xs font-medium ${diff > 0 ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
        {diff > 0 ? `+${diff.toLocaleString('pl-PL')} nadwyżka` : `${Math.abs(diff).toLocaleString('pl-PL')} deficyt`}
      </div>
    </div>
  )
}

export default function MainChart({ week, selectedDayIndex, onDayClick }: MainChartProps) {
  const data = week.dni.map((day) => ({
    name: day.dzien_tygodnia.slice(0, 3),
    fullName: day.dzien_tygodnia,
    Spożyte: day.kalorie_spozyte,
    Limit: day.limit_bazowy,
  }))

  const avgLimit = week.dni[0]?.limit_bazowy ?? 2000

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-[#141416] border border-[#232326] p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Kalorie w tygodniu</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{week.zakres_dat}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#10b981] inline-block" />
            Spożyte
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#6366f1] inline-block opacity-60" />
            Limit
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
          onClick={(e) => {
            if (e?.activeTooltipIndex !== undefined) onDayClick(e.activeTooltipIndex)
          }}
          style={{ cursor: 'pointer' }}
        >
          <defs>
            <linearGradient id="gradSpozyte" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLimit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#232326" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
          <ReferenceLine
            y={avgLimit}
            stroke="#6366f1"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="Limit"
            stroke="#6366f1"
            strokeWidth={1.5}
            strokeOpacity={0.5}
            fill="url(#gradLimit)"
            dot={false}
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="Spożyte"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradSpozyte)"
            dot={(props) => {
              const { cx, cy, index } = props
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={index === selectedDayIndex ? 5 : 3}
                  fill={index === selectedDayIndex ? '#10b981' : '#141416'}
                  stroke="#10b981"
                  strokeWidth={2}
                />
              )
            }}
            activeDot={{ r: 6, fill: '#10b981', stroke: '#141416', strokeWidth: 2 }}
          />
          <Legend wrapperStyle={{ display: 'none' }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
