using ApiFaculdade.Data;
using ApiFaculdade.Models;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFaculdade.Repository
{
    public class TurmaRepository : ITurmaRepository
    {
        private readonly AppDbContext _context;

        public TurmaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TurmaRespostaDto?> BuscarPorIdAsync(int id)
        {
            return await _context.Turmas
                .Where(t => t.Id == id)
                .Select(t => new TurmaRespostaDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    ProfessorNome = t.Professor != null ? t.Professor.Nome : "Sem professor",
                    NomesDosCursos = t.Cursos.Select(c => c.NomeCursoEnum.ToString()).ToList(),
                    Alunos = t.Alunos.Select(a => new AlunoSimplesDto
                    {
                        Id = a.Id,
                        Nome = a.Nome,
                        Matricula = a.Matricula
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId)
        {
            Turma? turma = await _context.Turmas
                .Include(t => t.Alunos)
                .Include(t => t.Cursos)
                .FirstOrDefaultAsync(t => t.Id == turmaId);

            if (turma == null)
            {
                throw new Exception("Turma não encontrada.");
            }

            List<Aluno> alunosDoCurso = await _context.Alunos
                .Where(a => a.CursoId == cursoId)
                .ToListAsync();

            foreach (Aluno aluno in alunosDoCurso)
            {
                if (turma.Alunos.Count >= 40)
                {
                    throw new Exception("Capacidade máxima de 40 alunos atingida. A operação foi interrompida.");
                }

                if (!turma.Alunos.Any(a => a.Id == aluno.Id))
                {
                    turma.Alunos.Add(aluno);
                }
            }

            Curso? curso = await _context.Cursos.FindAsync(cursoId);
            if (curso != null && !turma.Cursos.Any(c => c.Id == cursoId))
            {
                turma.Cursos.Add(curso);
            }

            await _context.SaveChangesAsync();
            return turma;
        }

        public async Task<Turma> AdicionarAsync(CriarTurmaDto dto)
        {
            if (dto.DataInicio >= dto.DataFim)
            {
                throw new Exception("A data de término da turma não pode ser anterior ou igual à data de início.");
            }

            Funcionario? professor = await _context.Funcionarios.FindAsync(dto.ProfessorId);
            if (professor == null)
            {
                throw new Exception("Professor informado não existe no sistema.");
            }

            if (professor.Cargo != CargoFuncionario.Professor)
            {
                throw new Exception("O funcionário selecionado não possui o cargo de Professor.");
            }

            Turma novaTurma = new Turma
            {
                Nome = dto.Nome,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                ProfessorId = dto.ProfessorId,
                Cursos = new List<Curso>(),
                Alunos = new List<Aluno>()
            };

            if (dto.CursosIds != null && dto.CursosIds.Any())
            {
                List<Curso> cursosReais = await _context.Cursos
                    .Where(c => dto.CursosIds.Contains(c.Id))
                    .ToListAsync();
                    
                novaTurma.Cursos = cursosReais;

                List<Aluno> alunosDaTurma = await _context.Alunos
                    .Where(a => dto.CursosIds.Contains(a.CursoId))
                    .ToListAsync();

                if (alunosDaTurma.Count > 40)
                {
                    throw new Exception("A criação desta turma com os cursos selecionados excede o limite máximo de 40 alunos.");
                }

                novaTurma.Alunos = alunosDaTurma;
            }

            _context.Turmas.Add(novaTurma);
            await _context.SaveChangesAsync();
            
            return novaTurma;
        }

        public async Task<Turma?> AtualizarAsync(Turma turma)
        {
            Turma? turmaExistente = await _context.Turmas
                .Include(t => t.Cursos)
                .Include(t => t.Alunos)
                .FirstOrDefaultAsync(t => t.Id == turma.Id);

            if (turmaExistente == null)
            {
                throw new Exception("Turma não encontrada para atualização.");
            }

            if (turma.DataInicio >= turma.DataFim)
            {
                throw new Exception("A data de término não pode ser anterior ou igual à data de início.");
            }

            turmaExistente.Nome = turma.Nome;
            turmaExistente.DataInicio = turma.DataInicio;
            turmaExistente.DataFim = turma.DataFim;
            turmaExistente.ProfessorId = turma.ProfessorId;

            if (turma.Cursos != null)
            {
                turmaExistente.Cursos.Clear();
                List<int> idsCursos = turma.Cursos.Select(c => c.Id).ToList();
                turmaExistente.Cursos = await _context.Cursos.Where(c => idsCursos.Contains(c.Id)).ToListAsync();
            }

            if (turma.Alunos != null)
            {
                turmaExistente.Alunos.Clear();
                List<int> idsAlunos = turma.Alunos.Select(a => a.Id).ToList();
                List<Aluno> novosAlunos = await _context.Alunos.Where(a => idsAlunos.Contains(a.Id)).ToListAsync();
                
                if (novosAlunos.Count > 40)
                {
                    throw new Exception("A turma não pode ser atualizada pois a nova lista excede 40 alunos.");
                }

                turmaExistente.Alunos = novosAlunos;
            }

            await _context.SaveChangesAsync();
            return turmaExistente;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            Turma? turmaExistente = await _context.Turmas.FindAsync(id);
            if (turmaExistente == null) return false;

            _context.Turmas.Remove(turmaExistente);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TurmaRespostaDto>> BuscarTodasComDetalhesAsync()
        {
            return await _context.Turmas
                .Select(t => new TurmaRespostaDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    ProfessorNome = t.Professor != null ? t.Professor.Nome : "Sem professor",
                    NomesDosCursos = t.Cursos.Select(c => c.NomeCursoEnum.ToString()).ToList(),
                    Alunos = t.Alunos.Select(a => new AlunoSimplesDto
                    {
                        Id = a.Id,
                        Nome = a.Nome,
                        Matricula = a.Matricula
                    }).ToList()
                })
                .ToListAsync(); 
        }

        public async Task AtivarTurmaAsync(int turmaId)
        {
            Turma? turma = await _context.Turmas
                .Include(t => t.Alunos)
                .FirstOrDefaultAsync(t => t.Id == turmaId);

            if (turma == null)
            {
                throw new Exception("Turma não encontrada.");
            }

            if (turma.Alunos == null || turma.Alunos.Count < 5)
            {
                int quantidade = turma.Alunos != null ? turma.Alunos.Count : 0;
                throw new Exception($"Não é possível iniciar a turma. Ela possui apenas {quantidade} alunos, mas o mínimo exigido é 5.");
            }

            turma.EmAndamento = true;
            await _context.SaveChangesAsync();
        }
    }
}