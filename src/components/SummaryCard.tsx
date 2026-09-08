import type { IvaConfig, LineItem } from '../types'
import { formatCurrency } from '../utils/format'
import { calculateTotals } from '../utils/totals'

interface SummaryCardProps {
  items: LineItem[]
  iva: IvaConfig
  onIvaChange: (iva: IvaConfig) => void
}

export function SummaryCard({ items, iva, onIvaChange }: SummaryCardProps) {
  const { subtotal, ivaRate, ivaAmount, total } = calculateTotals(items, iva)
  const isento = iva.regime === 'isento'

  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onIvaChange({ ...iva, regime: 'isento' })}
          className={`rounded-xl py-2.5 text-sm font-bold ${isento ? 'bg-white text-slate-900' : 'bg-white/10 text-slate-300'}`}
        >
          Isento de IVA
        </button>
        <button
          type="button"
          onClick={() => onIvaChange({ ...iva, regime: 'acrescer' })}
          className={`rounded-xl py-2.5 text-sm font-bold ${!isento ? 'bg-white text-slate-900' : 'bg-white/10 text-slate-300'}`}
        >
          Acrescer IVA
        </button>
      </div>

      {!isento && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-slate-300">Taxa de IVA</span>
          <input
            className="w-16 rounded-lg bg-white/10 px-2 py-1.5 text-right text-sm font-bold text-white"
            inputMode="decimal"
            value={iva.taxa}
            onChange={(e) => onIvaChange({ ...iva, taxa: e.target.value })}
          />
          <span className="text-sm text-slate-300">%</span>
        </div>
      )}

      {!isento && (
        <div className="mb-4 space-y-1 border-b border-white/10 pb-4 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA ({ivaRate.toString().replace('.', ',')}%)</span>
            <span>{formatCurrency(ivaAmount)}</span>
          </div>
        </div>
      )}

      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Total a pagar</p>
      <p className="mt-1 text-4xl font-extrabold tracking-tight">{formatCurrency(total)}</p>

      {isento && (
        <p className="mt-3 text-xs text-slate-400">Isento de IVA — artigo 53.º do Código do IVA.</p>
      )}
    </section>
  )
}
