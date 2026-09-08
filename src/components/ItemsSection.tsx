import type { LineItem } from '../types'
import { formatCurrency, parseDecimal } from '../utils/format'
import { Card, FieldLabel, inputClasses } from './Card'

interface ItemsSectionProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

function createItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: '1',
    unitPrice: '',
  }
}

export function ItemsSection({ items, onChange }: ItemsSectionProps) {
  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  function addItem() {
    onChange([...items, createItem()])
  }

  return (
    <Card title="Itens do orçamento">
      <div className="space-y-4">
        {items.map((item, index) => {
          const lineTotal = parseDecimal(item.quantity) * parseDecimal(item.unitPrice)
          return (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Item {index + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full px-3 py-1 text-sm font-semibold text-red-500 active:bg-red-50"
                    aria-label={`Remover item ${index + 1}`}
                  >
                    Remover
                  </button>
                )}
              </div>

              <FieldLabel>Descrição do serviço/material</FieldLabel>
              <input
                className={inputClasses}
                placeholder="Ex: Substituição de torneira"
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
              />

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Quantidade</FieldLabel>
                  <input
                    className={inputClasses}
                    inputMode="decimal"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel>Preço unitário</FieldLabel>
                  <input
                    className={inputClasses}
                    inputMode="decimal"
                    placeholder="0,00"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: e.target.value })}
                  />
                </div>
              </div>

              <p className="mt-3 text-right text-lg font-bold text-slate-900">
                {formatCurrency(lineTotal)}
              </p>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 w-full rounded-2xl border-2 border-dashed border-blue-300 py-4 text-lg font-bold text-blue-600 active:bg-blue-50"
      >
        + Adicionar item
      </button>
    </Card>
  )
}
