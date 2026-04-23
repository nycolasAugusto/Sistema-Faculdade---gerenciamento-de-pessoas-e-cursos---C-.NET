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

        public async Task<IEnumerable<Aluno>> GetAllAsync()
        {
            return await _context.Alunos.ToListAsync();
        }

        public async Task<Aluno?> GetByIdAsync(int id)
        {
            return await _context.Alunos.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Aluno?> GetByMatriculaAsync(string matricula)
        {
            return await _context.Alunos.FirstOrDefaultAsync(a => a.Matricula == matricula);
        }

        public async Task<IEnumerable<Aluno>> GetByCursoAsync(Cursos curso)
        {
            return await _context.Alunos
                .Include(a => a.curso) 
                .Where(a => a.curso != null && a.curso.NomeCursoEnum == curso)
                .ToListAsync();
        }

        public async Task<Aluno> AddAsync(CriarAlunoDto dto)
        {
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
            var aluno = await GetByIdAsync(id);
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