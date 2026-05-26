import type { ICurso } from '../interface'

export const cursosMock: ICurso[] = [
  {
    id: 1,
    nome: 'Análise e Desenvolvimento de Sistemas',
    descricao: 'Formação focada em desenvolvimento de software, banco de dados e sistemas web.',
    coordenador: {
      id: 1,
      nome: 'Marcos Henrique',
      email: 'marcos.henrique@faculdadeprime.com',
    },
    turmas: [
      {
        id: 101,
        nome: 'ADS - 1º Semestre',
        periodo: 'Noturno',
        sala: 'Laboratório 02',
        professores: [
          {
            id: 1,
            nome: 'Ana Paula Ribeiro',
            disciplina: 'Lógica de Programação',
            email: 'ana.ribeiro@faculdadeprime.com',
          },
          {
            id: 2,
            nome: 'Carlos Mendes',
            disciplina: 'Banco de Dados',
            email: 'carlos.mendes@faculdadeprime.com',
          },
        ],
        alunos: [
          {
            id: 1,
            nome: 'João Pedro',
            matricula: 'ADS2025001',
            email: 'joao.pedro@aluno.com',
          },
          {
            id: 2,
            nome: 'Maria Clara',
            matricula: 'ADS2025002',
            email: 'maria.clara@aluno.com',
          },
        ],
      },
      {
        id: 102,
        nome: 'ADS - 2º Semestre',
        periodo: 'Matutino',
        sala: 'Sala 14',
        professores: [
          {
            id: 3,
            nome: 'Fernanda Lima',
            disciplina: 'Programação Web',
            email: 'fernanda.lima@faculdadeprime.com',
          },
        ],
        alunos: [
          {
            id: 3,
            nome: 'Lucas Almeida',
            matricula: 'ADS2024008',
            email: 'lucas.almeida@aluno.com',
          },
          {
            id: 4,
            nome: 'Beatriz Souza',
            matricula: 'ADS2024011',
            email: 'beatriz.souza@aluno.com',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    nome: 'Administração',
    descricao: 'Curso voltado para gestão, finanças, pessoas e processos organizacionais.',
    coordenador: {
      id: 2,
      nome: 'Patrícia Gomes',
      email: 'patricia.gomes@faculdadeprime.com',
    },
    turmas: [
      {
        id: 201,
        nome: 'Administração - 1º Semestre',
        periodo: 'Noturno',
        sala: 'Sala 08',
        professores: [
          {
            id: 4,
            nome: 'Roberto Alves',
            disciplina: 'Teoria Geral da Administração',
            email: 'roberto.alves@faculdadeprime.com',
          },
        ],
        alunos: [
          {
            id: 5,
            nome: 'Gabriel Martins',
            matricula: 'ADM2025001',
            email: 'gabriel.martins@aluno.com',
          },
          {
            id: 6,
            nome: 'Juliana Costa',
            matricula: 'ADM2025002',
            email: 'juliana.costa@aluno.com',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    nome: 'Pedagogia',
    descricao: 'Curso focado em educação, didática, gestão escolar e práticas pedagógicas.',
    coordenador: {
      id: 3,
      nome: 'Helena Castro',
      email: 'helena.castro@faculdadeprime.com',
    },
    turmas: [
      {
        id: 301,
        nome: 'Pedagogia - 3º Semestre',
        periodo: 'Matutino',
        sala: 'Sala 21',
        professores: [
          {
            id: 5,
            nome: 'Camila Rocha',
            disciplina: 'Didática',
            email: 'camila.rocha@faculdadeprime.com',
          },
        ],
        alunos: [
          {
            id: 7,
            nome: 'Rafaela Nunes',
            matricula: 'PED2023010',
            email: 'rafaela.nunes@aluno.com',
          },
          {
            id: 8,
            nome: 'André Felipe',
            matricula: 'PED2023012',
            email: 'andre.felipe@aluno.com',
          },
        ],
      },
    ],
  },
]