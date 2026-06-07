using ApiFaculdade.Models;
using ApiFaculdade.DTOS; 

namespace ApiFaculdade.Repository.interfaces
{
    public interface ICursoRepository {
        Task<IEnumerable<CursoRespostaDto>> GetAllAsync(); // ← corrigido
        Task<CursoRespostaDto?> GetByIdAsync(int id);
        Task<Curso> AdicionarAsync(CriarCursoDto dto); 
        Task UpdateAsync(Curso curso);
        Task DeleteAsync(int id);
        Task AlterarCoordenadores(int id, List<int> idsEnviados);
    }
}