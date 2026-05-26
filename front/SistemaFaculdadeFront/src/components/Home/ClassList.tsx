import { ClassCard } from './ClassCard'

import type { IClassListProps } from '../../pages/Home/interface'

export function ClassList({
  turmas,
  selectedTurmaId,
  onSelectTurma,
}: IClassListProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Turmas do curso</h2>

        <p className="text-sm text-slate-500">
          Clique em uma turma para ver professores e alunos.
        </p>
      </div>

      <div className="space-y-3">
        {turmas.map((turma) => (
          <ClassCard
            key={turma.id}
            turma={turma}
            isSelected={selectedTurmaId === turma.id}
            onSelect={onSelectTurma}
          />
        ))}
      </div>
    </section>
  )
}