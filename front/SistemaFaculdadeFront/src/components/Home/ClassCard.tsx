import type { IClassCardProps } from '../../pages/Home/interface'

export function ClassCard({ turma, isSelected, onSelect }: IClassCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(turma)}
      className={`w-full rounded-xl border p-4 text-left transition hover:shadow-md ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <h3 className="font-bold text-slate-900">{turma.nome}</h3>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-500 sm:grid-cols-3">
        <span>Período: {turma.periodo}</span>
        <span>Sala: {turma.sala}</span>
        <span>{turma.alunos.length} aluno(s)</span>
      </div>
    </button>
  )
}