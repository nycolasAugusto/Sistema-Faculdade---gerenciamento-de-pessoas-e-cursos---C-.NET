import { useState } from 'react'

import { ActionTabs } from '../../components/Home/ActionTabs'
import { ClassDetails } from '../../components/Home/ClassDetails'
import { ClassList } from '../../components/Home/ClassList'
import { CourseList } from '../../components/Home/CourseList'
import { EmptyState } from '../../components/Home/EmptyState'

import { cursosMock } from './service/mockData'

import type { ICurso, ITipoVisualizacao, ITurma } from './interface'

export function Home() {
  const [activeTab, setActiveTab] = useState<ITipoVisualizacao>('curso-turma')
  const [selectedCurso, setSelectedCurso] = useState<ICurso | null>(null)
  const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null)

  function handleSelectCurso(curso: ICurso) {
    setSelectedCurso(curso)
    setSelectedTurma(null)
  }

  function handleSelectTurma(turma: ITurma) {
    setSelectedTurma(turma)
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Faculdade Prime
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Gestão Acadêmica
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Controle de cursos, turmas, professores, coordenadores e alunos.
            </p>
          </div>

          <ActionTabs activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <CourseList
          cursos={cursosMock}
          selectedCursoId={selectedCurso?.id}
          onSelectCurso={handleSelectCurso}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          {selectedCurso ? (
            <ClassList
              turmas={selectedCurso.turmas}
              selectedTurmaId={selectedTurma?.id}
              onSelectTurma={handleSelectTurma}
            />
          ) : (
            <EmptyState
              title="Nenhum curso selecionado"
              description="Escolha um curso acima para visualizar suas turmas."
            />
          )}

          {selectedCurso && selectedTurma ? (
            <ClassDetails
              curso={selectedCurso}
              turma={selectedTurma}
              activeTab={activeTab}
            />
          ) : (
            <EmptyState
              title="Nenhuma turma selecionada"
              description="Depois de escolher um curso, selecione uma turma para ver os detalhes."
            />
          )}
        </div>
      </div>
    </main>
  )
}