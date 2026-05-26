import type { IClassDetailsProps } from '../../pages/Home/interface'

export function ClassDetails({ curso, turma, activeTab }: IClassDetailsProps) {
  const showAlunos = activeTab === 'alunos' || activeTab === 'curso-turma'
  const showProfessores =
    activeTab === 'professor-coordenador' || activeTab === 'curso-turma'

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-6">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {curso.nome}
        </span>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          {turma.nome}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {turma.periodo} • {turma.sala}
        </p>
      </div>

      {showProfessores && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-bold text-slate-900">
            Professores
          </h3>

          <div className="space-y-3">
            {turma.professores.map((professor) => (
              <div
                key={professor.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">
                  {professor.nome}
                </p>

                <p className="text-sm text-slate-500">
                  {professor.disciplina}
                </p>

                <p className="mt-1 text-sm text-blue-600">
                  {professor.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'professor-coordenador' && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-bold text-slate-900">
            Coordenador
          </h3>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              {curso.coordenador.nome}
            </p>

            <p className="mt-1 text-sm text-blue-600">
              {curso.coordenador.email}
            </p>
          </div>
        </div>
      )}

      {showAlunos && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-slate-900">Alunos</h3>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="hidden grid-cols-3 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 sm:grid">
              <span>Nome</span>
              <span>Matrícula</span>
              <span>Email</span>
            </div>

            {turma.alunos.map((aluno) => (
              <div
                key={aluno.id}
                className="grid gap-1 border-t border-slate-100 px-4 py-3 text-sm sm:grid-cols-3"
              >
                <span className="font-medium text-slate-900">
                  {aluno.nome}
                </span>

                <span className="text-slate-500">{aluno.matricula}</span>

                <span className="text-blue-600">{aluno.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}