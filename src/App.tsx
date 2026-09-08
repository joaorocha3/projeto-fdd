import { useEffect, useState } from 'react'
import { CompanyCard } from './components/CompanyCard'
import { ClientCard } from './components/ClientCard'
import { ItemsSection } from './components/ItemsSection'
import { SummaryCard } from './components/SummaryCard'
import { FooterCard } from './components/FooterCard'
import { GenerateBar } from './components/GenerateBar'
import type { Status } from './components/StatusBanner'
import type { BudgetState, LineItem } from './types'
import { loadBudget, saveBudget } from './utils/storage'

function createEmptyItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '' }
}

function createDefaultState(): BudgetState {
  return {
    company: { name: '', phone: '', nif: '', logoDataUrl: null },
    client: { name: '', address: '', nif: '' },
    items: [createEmptyItem()],
    iva: { regime: 'isento', taxa: '23' },
    iban: '',
  }
}

function loadInitialState(): BudgetState {
  const defaults = createDefaultState()
  const loaded = loadBudget()
  if (!loaded) return defaults
  return {
    company: { ...defaults.company, ...loaded.company },
    client: { ...defaults.client, ...loaded.client },
    items: loaded.items?.length ? loaded.items : defaults.items,
    iva: { ...defaults.iva, ...loaded.iva },
    iban: loaded.iban ?? defaults.iban,
  }
}

export default function App() {
  const [state, setState] = useState<BudgetState>(loadInitialState)
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

  function handleNewBudget() {
    const confirmed = window.confirm('Começar um novo orçamento? Os dados do cliente e os itens serão apagados.')
    if (!confirmed) return
    setState((prev) => ({
      ...createDefaultState(),
      company: prev.company,
      iva: prev.iva,
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
        <SummaryCard
          items={state.items}
          iva={state.iva}
          onIvaChange={(iva) => setState((prev) => ({ ...prev, iva }))}
        />
        <FooterCard iban={state.iban} onChange={(iban) => setState((prev) => ({ ...prev, iban }))} />
      </div>

      <GenerateBar onClick={handleGenerate} loading={loading} status={status} />
    </div>
  )
}
