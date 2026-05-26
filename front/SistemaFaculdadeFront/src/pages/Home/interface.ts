export interface IAluno {
  id: number
  nome: string
  matricula: string
  email: string
}

export interface IProfessor {
  id: number
  nome: string
  disciplina: string
  email: string
}

export interface ICoordenador {
  id: number
  nome: string
  email: string
}

export interface ITurma {
  id: number
  nome: string
  periodo: string
  sala: string
  alunos: IAluno[]
  professores: IProfessor[]
}

export interface ICurso {
  id: number
  nome: string
  descricao: string
  coordenador: ICoordenador
  turmas: ITurma[]
}

export type ITipoVisualizacao = 'alunos' | 'curso-turma' | 'professor-coordenador'

export interface IActionTabsProps {
  activeTab: ITipoVisualizacao
  onChangeTab: (tab: ITipoVisualizacao) => void
}

export interface ICourseCardProps {
  curso: ICurso
  isSelected: boolean
  onSelect: (curso: ICurso) => void
}

export interface ICourseListProps {
  cursos: ICurso[]
  selectedCursoId?: number
  onSelectCurso: (curso: ICurso) => void
}

export interface IClassCardProps {
  turma: ITurma
  isSelected: boolean
  onSelect: (turma: ITurma) => void
}

export interface IClassListProps {
  turmas: ITurma[]
  selectedTurmaId?: number
  onSelectTurma: (turma: ITurma) => void
}

export interface IClassDetailsProps {
  curso: ICurso
  turma: ITurma
  activeTab: ITipoVisualizacao
}

export interface IEmptyStateProps {
  title: string
  description: string
}