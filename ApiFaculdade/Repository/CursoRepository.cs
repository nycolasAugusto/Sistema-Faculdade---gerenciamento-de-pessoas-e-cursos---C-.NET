using ApiFaculdade.Models;
using ApiFaculdade.Data; 
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;

namespace ApiFaculdade.Repository{

    public class CursoRepository : ICursoRepository{
        private readonly AppDbContext _context;

        public CursoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Curso>> GetAllAsync()
        {
            return await _context.Cursos.ToListAsync();
        }

        public async Task<Curso?> GetByIdAsync(int id)
        {
            return await _context.Cursos.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddAsync(Curso curso)
        {
            if (curso.Coordenadores == null || curso.Coordenadores.Count < 1) {
                throw new Exception("O curso precisa de pelo menos 1 coordenador.");
            }

            curso.TempoDoCursoEmMeses = ((curso.DataFim.Year - curso.DataInicio.Year) * 12)
                                        + curso.DataFim.Month - curso.DataInicio.Month;

            await _context.Cursos.AddAsync(curso);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Curso curso)
        {
            _context.Cursos.Update(curso);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var curso = await GetByIdAsync(id);
            if (curso != null) {
                _context.Cursos.Remove(curso);
                await _context.SaveChangesAsync();
            }
        }
    }
}