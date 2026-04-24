using ApiFaculdade.Models;
using ApiFaculdade.DTOS; 

namespace ApiFaculdade.Repository.interfaces
{
    public interface ICursoRepository {
        Task<IEnumerable<Curso>> GetAllAsync();
        Task<Curso?> GetByIdAsync(int id);
        Task<Curso> AdicionarAsync(CriarCursoDto dto); 
        Task UpdateAsync(Curso curso);
        Task DeleteAsync(int id);
    }
}