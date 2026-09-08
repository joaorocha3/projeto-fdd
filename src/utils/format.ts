export function parseDecimal(raw: string): number {
  const normalized = raw.trim().replace(',', '.')
  const value = parseFloat(normalized)
  return Number.isFinite(value) ? value : 0
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export function formatPlainNumber(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
