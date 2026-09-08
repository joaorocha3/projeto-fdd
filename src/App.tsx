import { useEffect, useMemo, useState } from 'react'
import { CompanyCard } from './components/CompanyCard'
import { ClientCard } from './components/ClientCard'
import { ItemsSection } from './components/ItemsSection'
import { SummaryCard } from './components/SummaryCard'
import { FooterCard } from './components/FooterCard'
import { GenerateBar } from './components/GenerateBar'
import type { Status } from './components/StatusBanner'
import type { BudgetState, LineItem } from './types'
import { loadBudget, saveBudget } from './utils/storage'
import { parseDecimal } from './utils/format'

function createEmptyItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '' }
}

function createDefaultState(): BudgetState {
  return {
    company: { name: '', phone: '', logoDataUrl: null },
    client: { name: '', address: '' },
    items: [createEmptyItem()],
    iban: '',
  }
}

export default function App() {
  const [state, setState] = useState<BudgetState>(() => loadBudget() ?? createDefaultState())
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    saveBudget(state)
  }, [state])

  useEffect(() => {
    // Pré-carrega o gerador de PDF em segundo plano para que o clique no botão
    // (exigido pela Web Share API) não fique à espera da rede.
    void import('./utils/pdf')
  }, [])

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 4000)
    return () => clearTimeout(timer)
  }, [status])

  const grandTotal = useMemo(
    () =>
      state.items.reduce((sum, item) => sum + parseDecimal(item.quantity) * parseDecimal(item.unitPrice), 0),
    [state.items],
  )

  function handleNewBudget() {
    const confirmed = window.confirm('Começar um novo orçamento? Os dados do cliente e os itens serão apagados.')
    if (!confirmed) return
    setState((prev) => ({
      ...createDefaultState(),
      company: prev.company,
      iban: prev.iban,
    }))
    setStatus(null)
  }

  async function handleGenerate() {
    if (!state.client.name.trim()) {
      setStatus({ type: 'error', message: 'Indique o nome do cliente antes de continuar.' })
      return
    }
    const hasValidItem = state.items.some((item) => item.description.trim() !== '')
    if (!hasValidItem) {
      setStatus({ type: 'error', message: 'Adicione pelo menos um item ao orçamento.' })
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      const { generateAndShareBudget } = await import('./utils/pdf')
      const result = await generateAndShareBudget(state)
      if (result === 'shared') {
        setStatus({ type: 'success', message: 'Orçamento partilhado com sucesso!' })
      } else if (result === 'downloaded') {
        setStatus({ type: 'success', message: 'PDF gerado. Envie-o agora pelo WhatsApp.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Não foi possível gerar o PDF. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="mx-auto max-w-md space-y-4 px-4 pb-44 pt-6">
        <header className="mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Orçamentos Express</h1>
          <button
            type="button"
            onClick={handleNewBudget}
            className="rounded-full px-3 py-2 text-sm font-bold text-slate-500 active:bg-slate-200"
          >
            Novo
          </button>
        </header>

        <CompanyCard
          company={state.company}
          onChange={(company) => setState((prev) => ({ ...prev, company }))}
          onError={(message) => setStatus({ type: 'error', message })}
        />
        <ClientCard client={state.client} onChange={(client) => setState((prev) => ({ ...prev, client }))} />
        <ItemsSection items={state.items} onChange={(items) => setState((prev) => ({ ...prev, items }))} />
        <SummaryCard total={grandTotal} />
        <FooterCard iban={state.iban} onChange={(iban) => setState((prev) => ({ ...prev, iban }))} />
      </div>

      <GenerateBar onClick={handleGenerate} loading={loading} status={status} />
    </div>
  )
}
