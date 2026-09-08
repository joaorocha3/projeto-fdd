export interface Status {
  type: 'error' | 'success' | 'info'
  message: string
}

const STYLES: Record<Status['type'], string> = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
}

export function StatusBanner({ status }: { status: Status | null }) {
  if (!status) return null
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${STYLES[status.type]}`}>
      {status.message}
    </div>
  )
}
