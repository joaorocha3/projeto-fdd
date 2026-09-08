import { Card, FieldLabel, inputClasses } from './Card'

interface FooterCardProps {
  iban: string
  onChange: (iban: string) => void
}

export function FooterCard({ iban, onChange }: FooterCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-semibold text-slate-500">Validade do orçamento</span>
        <span className="text-sm font-bold text-slate-900">30 dias</span>
      </div>
      <div className="mt-3">
        <FieldLabel>IBAN para pagamento</FieldLabel>
        <input
          className={`${inputClasses} font-mono tracking-tight`}
          placeholder="PT50 0000 0000 0000 0000 0000 0"
          value={iban}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Card>
  )
}
