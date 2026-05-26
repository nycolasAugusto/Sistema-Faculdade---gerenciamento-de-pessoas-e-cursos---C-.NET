import { CourseCard } from './CourseCard'

import type { ICourseListProps } from '../../pages/Home/interface'

export function CourseList({
  cursos,
  selectedCursoId,
  onSelectCurso,
}: ICourseListProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Cursos disponíveis</h2>

        <p className="text-sm text-slate-500">
          Selecione um curso para visualizar suas turmas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursos.map((curso) => (
          <CourseCard
            key={curso.id}
            curso={curso}
            isSelected={selectedCursoId === curso.id}
            onSelect={onSelectCurso}
          />
        ))}
      </div>
    </section>
  )
}