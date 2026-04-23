using ApiFaculdade.Models;
using ApiFaculdade.Data; 
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;

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

        public async Task<Curso> AdicionarAsync(CriarCursoDto dto)
        {
            
            var novoCurso = new Curso
            {
                NomeCursoEnum = dto.NomeCursoEnum,
                TempoDoCursoEmMeses = dto.TempoDoCursoEmMeses,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                Campus = dto.Campus,
                Materias = dto.Materias

            };
            if (dto.CoordenadorIds != null && dto.CoordenadorIds.Any())
            {
                var coordenadoresReais = await _context.Funcionarios
                    .Where(f => dto.CoordenadorIds.Contains(f.Id))
                    .ToListAsync();
                    
                novoCurso.Coordenador = coordenadoresReais;
            }

          
            _context.Cursos.Add(novoCurso);
            await _context.SaveChangesAsync();
            
            return novoCurso; 
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