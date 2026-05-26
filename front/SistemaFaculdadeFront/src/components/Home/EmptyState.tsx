import type { IEmptyStateProps } from '../../pages/Home/interface'

export function EmptyState({ title, description }: IEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}