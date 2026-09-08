import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BudgetState } from '../types'
import { formatCurrency, parseDecimal } from './format'
import { calculateTotals } from './totals'

function sanitizeForFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function buildFileName(state: BudgetState): string {
  const clientPart = sanitizeForFileName(state.client.name) || 'cliente'
  const datePart = new Date().toISOString().slice(0, 10)
  return `Orcamento_${clientPart}_${datePart}.pdf`
}

function buildPdfDocument(state: BudgetState): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 15
  let cursorY = 18

  const companyName = state.company.name.trim() || 'A sua empresa'
  const logo = state.company.logoDataUrl

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', marginX, cursorY - 4, 22, 22, undefined, 'FAST')
    } catch {
      // logotipo corrompido/ilegível — segue sem imagem
    }
  }

  const textX = logo ? marginX + 28 : marginX
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(15, 23, 42)
  doc.text(companyName, textX, cursorY)

  const companySubline = [
    state.company.phone.trim(),
    state.company.nif.trim() ? `NIF ${state.company.nif.trim()}` : '',
  ]
    .filter(Boolean)
    .join('  ·  ')

  if (companySubline) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(companySubline, textX, cursorY + 6)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42)
  doc.text('ORÇAMENTO', pageWidth - marginX, cursorY, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  const todayLabel = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  doc.text(todayLabel, pageWidth - marginX, cursorY + 6, { align: 'right' })

  cursorY += 20
  doc.setDrawColor(226, 232, 240)
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY)
  cursorY += 10

  doc.setFontSize(11)
  const valueX = marginX + Math.max(doc.getTextWidth('Cliente'), doc.getTextWidth('Morada/Obra')) + 6

  const clientNameLine = [
    state.client.name.trim() || '-',
    state.client.nif.trim() ? `(NIF ${state.client.nif.trim()})` : '',
  ]
    .filter(Boolean)
    .join('  ')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Cliente', marginX, cursorY)
  doc.setFont('helvetica', 'normal')
  doc.text(clientNameLine, valueX, cursorY)

  if (state.client.address.trim()) {
    cursorY += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Morada/Obra', marginX, cursorY)
    doc.setFont('helvetica', 'normal')
    doc.text(state.client.address.trim(), valueX, cursorY)
  }

  cursorY += 10

  const rows = state.items
    .filter((item) => item.description.trim() !== '')
    .map((item) => {
      const quantity = parseDecimal(item.quantity)
      const unitPrice = parseDecimal(item.unitPrice)
      const total = quantity * unitPrice
      return [
        item.description.trim(),
        quantity.toString().replace('.', ','),
        formatCurrency(unitPrice),
        formatCurrency(total),
      ]
    })

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['Descrição', 'Qtd', 'Preço Unit.', 'Total']],
    body: rows.length > 0 ? rows : [['-', '-', '-', '-']],
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      1: { halign: 'right', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 32 },
      3: { halign: 'right', cellWidth: 32 },
    },
  })

  const { subtotal, ivaRate, ivaAmount, total: grandTotal } = calculateTotals(state.items, state.iva)
  const isento = state.iva.regime === 'isento'

  let afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  if (!isento) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text('Subtotal', pageWidth - marginX - 70, afterTableY)
    doc.text(formatCurrency(subtotal), pageWidth - marginX - 4, afterTableY, { align: 'right' })
    afterTableY += 6
    doc.text(`IVA (${ivaRate.toString().replace('.', ',')}%)`, pageWidth - marginX - 70, afterTableY)
    doc.text(formatCurrency(ivaAmount), pageWidth - marginX - 4, afterTableY, { align: 'right' })
    afterTableY += 9
  }

  doc.setFillColor(15, 23, 42)
  doc.roundedRect(pageWidth - marginX - 75, afterTableY - 7, 75, 14, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('Total a pagar', pageWidth - marginX - 70, afterTableY + 1.5)
  doc.setFontSize(13)
  doc.text(formatCurrency(grandTotal), pageWidth - marginX - 4, afterTableY + 1.5, { align: 'right' })

  const pageHeight = doc.internal.pageSize.getHeight()
  const footerY = pageHeight - 22
  doc.setDrawColor(226, 232, 240)
  doc.line(marginX, footerY, pageWidth - marginX, footerY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  const validadeLine = isento
    ? 'Validade do orçamento: 30 dias  ·  Isento de IVA, artigo 53.º do CIVA'
    : 'Validade do orçamento: 30 dias'
  doc.text(validadeLine, marginX, footerY + 7)

  if (state.iban.trim()) {
    doc.text(`IBAN: ${state.iban.trim()}`, pageWidth - marginX, footerY + 7, { align: 'right' })
  }

  return doc
}

export type ShareResult = 'shared' | 'downloaded' | 'cancelled'

export async function generateAndShareBudget(state: BudgetState): Promise<ShareResult> {
  const doc = buildPdfDocument(state)
  const fileName = buildFileName(state)

  const canUseFileShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function'

  if (canUseFileShare) {
    const blob = doc.output('blob')
    const file = new File([blob], fileName, { type: 'application/pdf' })
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Orçamento',
          text: `Orçamento para ${state.client.name.trim() || 'cliente'}`,
        })
        return 'shared'
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return 'cancelled'
        }
      }
    }
  }

  doc.save(fileName)
  return 'downloaded'
}
