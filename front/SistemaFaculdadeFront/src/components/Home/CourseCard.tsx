import type { ICourseCardProps } from '../../pages/Home/interface'

export function CourseCard({ curso, isSelected, onSelect }: ICourseCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(curso)}
      className={`w-full rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{curso.nome}</h3>

          <p className="mt-2 text-sm text-slate-500">{curso.descricao}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {curso.turmas.length} turma(s)
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Coordenador
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {curso.coordenador.nome}
        </p>
      </div>
    </button>
  )
}