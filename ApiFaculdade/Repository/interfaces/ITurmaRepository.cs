using ApiFaculdade.Models;
using ApiFaculdade.DTOS; 


//ok
namespace ApiFaculdade.Repository.interfaces
{
    public interface ITurmaRepository
    {
        Task<TurmaRespostaDto?> GetByIdAsync(int id);
        Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId);
        Task AtivarTurmaAsync(int turmaId);
        Task<Turma> AdicionarAsync(CriarTurmaDto dto); 
        
        Task UpdateAsync(int id, AtualizarTurmaDto dto);
        Task<bool> DeletarAsync(int id);
        Task<IEnumerable<TurmaRespostaDto>> BuscarTodasComDetalhesAsync();
    }
}