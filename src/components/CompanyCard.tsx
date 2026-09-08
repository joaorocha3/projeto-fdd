import { useRef } from 'react'
import type { CompanyInfo } from '../types'
import { resizeImageToDataUrl } from '../utils/image'
import { Card, FieldLabel, inputClasses } from './Card'

interface CompanyCardProps {
  company: CompanyInfo
  onChange: (company: CompanyInfo) => void
  onError: (message: string) => void
}

export function CompanyCard({ company, onChange, onError }: CompanyCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onError('Escolha um ficheiro de imagem para o logótipo.')
      return
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      onChange({ ...company, logoDataUrl: dataUrl })
    } catch {
      onError('Não foi possível carregar o logótipo.')
    }
  }

  return (
    <Card title="A sua empresa">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 active:bg-slate-100"
          aria-label="Carregar logótipo"
        >
          {company.logoDataUrl ? (
            <img src={company.logoDataUrl} alt="Logótipo" className="h-full w-full object-contain" />
          ) : (
            <span className="text-3xl leading-none">+</span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        <div className="flex-1 space-y-3">
          <div>
            <FieldLabel>Nome da empresa</FieldLabel>
            <input
              className={inputClasses}
              placeholder="Ex: João Canalizações"
              value={company.name}
              onChange={(e) => onChange({ ...company, name: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Telefone</FieldLabel>
          <input
            className={inputClasses}
            placeholder="Ex: 912 345 678"
            type="tel"
            inputMode="tel"
            value={company.phone}
            onChange={(e) => onChange({ ...company, phone: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>NIF</FieldLabel>
          <input
            className={inputClasses}
            placeholder="Ex: 123456789"
            inputMode="numeric"
            value={company.nif}
            onChange={(e) => onChange({ ...company, nif: e.target.value })}
          />
        </div>
      </div>
    </Card>
  )
}
