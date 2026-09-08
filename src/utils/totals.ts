import type { IvaConfig, LineItem } from '../types'
import { parseDecimal } from './format'

export interface Totals {
  subtotal: number
  ivaRate: number
  ivaAmount: number
  total: number
}

export function calculateTotals(items: LineItem[], iva: IvaConfig): Totals {
  const subtotal = items.reduce(
    (sum, item) => sum + parseDecimal(item.quantity) * parseDecimal(item.unitPrice),
    0,
  )

  if (iva.regime === 'isento') {
    return { subtotal, ivaRate: 0, ivaAmount: 0, total: subtotal }
  }

  const ivaRate = parseDecimal(iva.taxa)
  const ivaAmount = subtotal * (ivaRate / 100)
  return { subtotal, ivaRate, ivaAmount, total: subtotal + ivaAmount }
}
