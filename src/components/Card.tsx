import type { PropsWithChildren, ReactNode } from 'react'

interface CardProps {
  title?: ReactNode
  action?: ReactNode
  className?: string
}

export function Card({ title, action, className, children }: PropsWithChildren<CardProps>) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-sm ${className ?? ''}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function FieldLabel({ children }: PropsWithChildren) {
  return <label className="mb-1.5 block text-sm font-semibold text-slate-500">{children}</label>
}

export const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white'
