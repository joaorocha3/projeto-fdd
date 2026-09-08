import { formatCurrency } from '../utils/format'

interface SummaryCardProps {
  total: number
}

export function SummaryCard({ total }: SummaryCardProps) {
  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Total a pagar</p>
      <p className="mt-1 text-4xl font-extrabold tracking-tight">{formatCurrency(total)}</p>
    </section>
  )
}
