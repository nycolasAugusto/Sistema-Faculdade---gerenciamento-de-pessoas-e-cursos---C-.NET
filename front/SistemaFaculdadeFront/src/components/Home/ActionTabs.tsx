import type { IActionTabsProps, ITipoVisualizacao } from '../../pages/Home/interface'

const tabs: Array<{
  label: string
  value: ITipoVisualizacao
}> = [
  {
    label: 'Alunos',
    value: 'alunos',
  },
  {
    label: 'Curso/Turma',
    value: 'curso-turma',
  },
  {
    label: 'Professor/Coordenador',
    value: 'professor-coordenador',
  },
]

export function ActionTabs({ activeTab, onChangeTab }: IActionTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChangeTab(tab.value)}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white text-slate-700 shadow hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}