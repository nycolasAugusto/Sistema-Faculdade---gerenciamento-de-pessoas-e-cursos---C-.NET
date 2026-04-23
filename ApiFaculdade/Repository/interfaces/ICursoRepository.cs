using ApiFaculdade.Models;
using ApiFaculdade.DTOS; // Ajustado para o seu namespace

namespace ApiFaculdade.Repository.interfaces
{
    public interface ICursoRepository {
        Task<IEnumerable<Curso>> GetAllAsync();
        Task<Curso?> GetByIdAsync(int id);
        
        // MUDANÇA AQUI: Retorna Curso, chama AdicionarAsync, recebe CriarCursoDto
        Task<Curso> AdicionarAsync(CriarCursoDto dto); 
        
        Task UpdateAsync(Curso curso);
        Task DeleteAsync(int id);
    }
}