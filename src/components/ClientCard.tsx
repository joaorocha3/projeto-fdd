import type { ClientInfo } from '../types'
import { Card, FieldLabel, inputClasses } from './Card'

interface ClientCardProps {
  client: ClientInfo
  onChange: (client: ClientInfo) => void
}

export function ClientCard({ client, onChange }: ClientCardProps) {
  return (
    <Card title="Dados do cliente">
      <div className="space-y-3">
        <div>
          <FieldLabel>Nome do cliente</FieldLabel>
          <input
            className={inputClasses}
            placeholder="Ex: Maria Silva"
            value={client.name}
            onChange={(e) => onChange({ ...client, name: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Morada/Obra (opcional)</FieldLabel>
          <input
            className={inputClasses}
            placeholder="Ex: Rua das Flores, 12, Porto"
            value={client.address}
            onChange={(e) => onChange({ ...client, address: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>NIF do cliente (opcional)</FieldLabel>
          <input
            className={inputClasses}
            placeholder="Ex: 123456789"
            inputMode="numeric"
            value={client.nif}
            onChange={(e) => onChange({ ...client, nif: e.target.value })}
          />
        </div>
      </div>
    </Card>
  )
}
