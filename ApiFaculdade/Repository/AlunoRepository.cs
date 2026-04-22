using ApiFaculdade.Data;
using ApiFaculdade.Enums;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;
using Microsoft.EntityFrameworkCore;
 
namespace ApiFaculdade.Repository
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly AppDbContext _context;
 
        public AlunoRepository(AppDbContext context)
        {
            _context = context;
        }
 
        // Gera matrícula no formato ALU + ano + id com 3 dígitos (ex: ALU2025001)
        private string GerarMatricula(int id, DateTime dataMatricula) =>
            $"ALU{dataMatricula.Year}{id:D3}";
 
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
            return await _context.Alunos.Where(a => a.Curso == curso).ToListAsync();
        }
 
        public async Task AddAsync(Aluno aluno)
        {
            aluno.DataMatricula = DateTime.Now;
 
            await _context.Alunos.AddAsync(aluno);
            await _context.SaveChangesAsync();
 
            // Gera matrícula após salvar (Id gerado pelo banco)
            aluno.Matricula = GerarMatricula(aluno.Id, aluno.DataMatricula);
            await _context.SaveChangesAsync();
        }
 
        public async Task UpdateAsync(Aluno aluno)
        {
            _context.Alunos.Update(aluno);
            await _context.SaveChangesAsync();
        }
 
        public async Task DeleteAsync(int id)
        {
            var aluno = await GetByIdAsync(id);
            if (aluno is not null)
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