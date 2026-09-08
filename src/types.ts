export interface CompanyInfo {
  name: string
  phone: string
  logoDataUrl: string | null
}

export interface ClientInfo {
  name: string
  address: string
}

export interface LineItem {
  id: string
  description: string
  quantity: string
  unitPrice: string
}

export interface BudgetState {
  company: CompanyInfo
  client: ClientInfo
  items: LineItem[]
  iban: string
}
