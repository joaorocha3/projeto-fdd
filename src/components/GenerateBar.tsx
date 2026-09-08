import { StatusBanner, type Status } from './StatusBanner'

interface GenerateBarProps {
  onClick: () => void
  loading: boolean
  status: Status | null
}

export function GenerateBar({ onClick, loading, status }: GenerateBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-4 pt-3 backdrop-blur"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="mx-auto max-w-md">
        {status && (
          <div className="mb-3">
            <StatusBanner status={status} />
          </div>
        )}
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 py-5 text-xl font-extrabold text-white shadow-lg shadow-blue-600/30 active:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'A gerar...' : 'Gerar PDF e Partilhar'}
        </button>
      </div>
    </div>
  )
}
