import type { BudgetState } from '../types'

const STORAGE_KEY = 'orcamentos-express:v1'

export function loadBudget(): BudgetState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as BudgetState
  } catch {
    return null
  }
}

export function saveBudget(state: BudgetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage indisponível (modo privado, quota excedida) — falha silenciosa
  }
}
