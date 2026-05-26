using ApiFaculdade.Models;
using ApiFaculdade.Data; 
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
    public class AlunoRepository : IAlunoRepository
    {
        private readonly AppDbContext _context;

        public AlunoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AlunoRespostaDto>> GetAllAsync()
        {
            return await _context.Alunos
                .Select(a => new AlunoRespostaDto
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Matricula = a.Matricula,
                    Email = a.Email,
                    Periodo = a.Periodo,
                    Ativo = a.Ativo ?? false,
                    NomeCurso = a.curso != null ? a.curso.NomeCursoEnum.ToString() : "Sem Curso",
                    NomesDasTurmas = a.turmas != null ? a.turmas.Select(t => t.Nome).ToList() : new List<string>()
                })
                .ToListAsync();
        }

        public async Task<AlunoRespostaDto?> GetByIdAsync(int id)
        {
            return await _context.Alunos
                .Where(a => a.Id == id)
                .Select(a => new AlunoRespostaDto
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Matricula = a.Matricula,
                    Email = a.Email,
                    Periodo = a.Periodo,
                    Ativo = a.Ativo ?? false,
                    NomeCurso = a.curso != null ? a.curso.NomeCursoEnum.ToString() : "Sem Curso",
                    NomesDasTurmas = a.turmas != null ? a.turmas.Select(t => t.Nome).ToList() : new List<string>()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<AlunoRespostaDto?> GetByMatriculaAsync(string matricula)
        {
            return await _context.Alunos
                .Where(a => a.Matricula == matricula)
                .Select(a => new AlunoRespostaDto
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Matricula = a.Matricula,
                    Email = a.Email,
                    Periodo = a.Periodo,
                    Ativo = a.Ativo ?? false,
                    NomeCurso = a.curso != null ? a.curso.NomeCursoEnum.ToString() : "Sem Curso",
                    NomesDasTurmas = a.turmas != null ? a.turmas.Select(t => t.Nome).ToList() : new List<string>()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AlunoRespostaDto>> GetByCursoAsync(Cursos curso)
        {
            return await _context.Alunos
                .Where(a => a.curso != null && a.curso.NomeCursoEnum == curso)
                .Select(a => new AlunoRespostaDto
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Matricula = a.Matricula,
                    Email = a.Email,
                    Periodo = a.Periodo,
                    Ativo = a.Ativo ?? false,
                    NomeCurso = a.curso != null ? a.curso.NomeCursoEnum.ToString() : "Sem Curso",
                    NomesDasTurmas = a.turmas != null ? a.turmas.Select(t => t.Nome).ToList() : new List<string>()
                })
                .ToListAsync();
        }

        public async Task<Aluno> AddAsync(CriarAlunoDto dto)
        {
            Curso? curso = await _context.Cursos
                .Include(c => c.Alunos) 
                .FirstOrDefaultAsync(c => c.Id == dto.CursoId);

            if (curso == null)
            {
                throw new Exception($"Não foi possível matricular: O curso com ID {dto.CursoId} não existe no sistema.");
            }

            bool emailExiste = await _context.Alunos.AnyAsync(a => a.Email == dto.Email);
            if (emailExiste)
            {
                throw new Exception($"Não foi possível matricular: O e-mail '{dto.Email}' já está em uso por outro aluno no sistema.");
            }

            if (curso.Alunos != null && curso.Alunos.Count >= 10)
            {
                throw new Exception($"Não foi possível matricular: O curso '{curso.NomeCursoEnum}' já atingiu o limite máximo de 10 alunos.");
            }

            string anoAtual = DateTime.Now.Year.ToString();
            string numeroAleatorio = new Random().Next(1000, 9999).ToString();
            string matriculaGerada = $"ALU{anoAtual}{numeroAleatorio}";

            Aluno novoAluno = new Aluno
            {
                Nome = dto.Nome,
                Email = dto.Email,
                CursoId = dto.CursoId,
                Periodo = dto.Periodo,
                Matricula = matriculaGerada,
                DataMatricula = DateTime.Now,
                Ativo = true 
            };

            _context.Alunos.Add(novoAluno);
            await _context.SaveChangesAsync();
            
            return novoAluno;
        }

        public async Task UpdateAsync(int id, AtualizarAlunoDto dto)
        {
            Aluno? alunoOriginal = await _context.Alunos
                .Include(a => a.turmas)
                    .ThenInclude(t => t.Cursos)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (alunoOriginal == null)
            {
                throw new Exception("Aluno não encontrado.");
            }

            int cursoIdAntigo = alunoOriginal.CursoId;

            if (cursoIdAntigo != dto.CursoId)
            {
                bool possuiTurmaAtiva = alunoOriginal.turmas.Any(t => t.EmAndamento == true);
                if (possuiTurmaAtiva)
                {
                    throw new Exception("Não é possível alterar o curso: o aluno possui turmas em andamento.");
                }

                List<Turma> turmasParaRemover = alunoOriginal.turmas
                    .Where(t => t.Cursos.Any(c => c.Id == cursoIdAntigo))
                    .ToList();

                foreach (Turma turmaOld in turmasParaRemover)
                {
                    alunoOriginal.turmas.Remove(turmaOld);
                }

                alunoOriginal.CursoId = dto.CursoId;

                List<Turma> turmasDoNovoCurso = await _context.Turmas
                    .Where(t => t.Cursos.Any(c => c.Id == dto.CursoId) && t.EmAndamento == false)
                    .ToListAsync();

                foreach (Turma turmaNew in turmasDoNovoCurso)
                {
                    if (!turmaNew.Alunos.Any(a => a.Id == id) && turmaNew.Alunos.Count < 40)
                    {
                        turmaNew.Alunos.Add(alunoOriginal);
                    }
                }
            }

            alunoOriginal.Nome = dto.Nome;
            alunoOriginal.Email = dto.Email;
            alunoOriginal.Periodo = dto.Periodo;
            alunoOriginal.Ativo = dto.Ativo;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Aluno? aluno = await _context.Alunos
                .Include(a => a.turmas)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluno != null) 
            {
                if (aluno.turmas != null && aluno.turmas.Any())
                {
                    throw new Exception("Não é possível excluir o aluno pois ele possui histórico de turmas vinculadas. Em vez de excluir, inative-o.");
                }

                _context.Alunos.Remove(aluno);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Alunos.AnyAsync(a => a.Id == id);
        }
    }
}