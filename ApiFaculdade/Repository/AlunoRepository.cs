using ApiFaculdade.Models;
using ApiFaculdade.Data; 
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;

using ApiFaculdade.Enums;

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
        
            var curso = await _context.Cursos
                .Include(c => c.Alunos) 
                .FirstOrDefaultAsync(c => c.Id == dto.CursoId);

            if (curso == null)
            {
                throw new Exception($"Não foi possível matricular: O curso com ID {dto.CursoId} não existe no sistema.");
            }

            
            if (curso.Alunos != null && curso.Alunos.Count >= 10)
            {
                throw new Exception($"Não foi possível matricular: O curso '{curso.NomeCursoEnum}' já atingiu o limite máximo de 10 alunos.");
            }

            string anoAtual = DateTime.Now.Year.ToString();
            string numeroAleatorio = new Random().Next(1000, 9999).ToString();
            string matriculaGerada = $"ALU{anoAtual}{numeroAleatorio}";

            var novoAluno = new Aluno
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
        public async Task UpdateAsync(Aluno aluno)
        {
            _context.Alunos.Update(aluno);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var aluno = await _context.Alunos.FindAsync(id);
            if (aluno != null) 
            {
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