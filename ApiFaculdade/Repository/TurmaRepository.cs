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

        public async Task<TurmaRespostaDto?> GetByIdAsync(int id)
        {
            TurmaRespostaDto? turma = await _context.Turmas
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

            return turma;
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

        public async Task UpdateAsync(int id, AtualizarTurmaDto dto)
        {
           
            Turma? turmaOriginal = await _context.Turmas
                .Include(t => t.Cursos)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (turmaOriginal == null)
            {
                throw new Exception("Turma não encontrada.");
            }

            Funcionario? professor = await _context.Funcionarios.FindAsync(dto.ProfessorId);
            if (professor == null || professor.Cargo != CargoFuncionario.Professor)
            {
                throw new Exception("Professor inválido ou não encontrado.");
            }

            turmaOriginal.Nome = dto.Nome;
            turmaOriginal.ProfessorId = dto.ProfessorId;
            turmaOriginal.EmAndamento = dto.EmAndamento;

            turmaOriginal.Cursos.Clear();

            List<Curso> novosCursos = await _context.Cursos
                .Where(c => dto.CursosIds.Contains(c.Id))
                .ToListAsync();

            foreach (Curso curso in novosCursos)
            {
                turmaOriginal.Cursos.Add(curso);
            }

            await _context.SaveChangesAsync();
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