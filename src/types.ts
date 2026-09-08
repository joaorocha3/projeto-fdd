export interface CompanyInfo {
  name: string
  phone: string
  nif: string
  logoDataUrl: string | null
}

export interface ClientInfo {
  name: string
  address: string
  nif: string
}

export interface LineItem {
  id: string
  description: string
  quantity: string
  unitPrice: string
}

export type IvaRegime = 'isento' | 'acrescer'

export interface IvaConfig {
  regime: IvaRegime
  taxa: string
}

export interface BudgetState {
  company: CompanyInfo
  client: ClientInfo
  items: LineItem[]
  iva: IvaConfig
  iban: string
}
