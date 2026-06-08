import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  accentColor: string
  bgColor: string
  description?: string
  index: number
}

export default function KPICard({
  label,
  value,
  unit,
  icon: Icon,
  accentColor,
  bgColor,
  description,
  index,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-[#141416] border border-[#232326] p-5"
    >
      <div
        className="absolute inset-0 opacity-5 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${accentColor}, transparent 70%)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight" style={{ color: accentColor }}>
              {typeof value === 'number' ? value.toLocaleString('pl-PL') : value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-zinc-400">{unit}</span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{description}</p>
          )}
        </div>

        <div
          className="ml-4 flex-shrink-0 p-2.5 rounded-xl"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      </div>
    </motion.div>
  )
}
