using ApiFaculdade.Models;

namespace ApiFaculdade.Repository.interfaces
{
    public interface ICursoRepository {
        
        
        Task<IEnumerable<Curso>> GetAllAsync();
        Task<Curso?> GetByIdAsync(int id);
        Task AddAsync(Curso curso);
        Task UpdateAsync(Curso curso);
        Task DeleteAsync(int id);


    }
}