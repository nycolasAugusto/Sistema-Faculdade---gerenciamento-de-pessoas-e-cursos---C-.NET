using ApiFaculdade.Models;
using ApiFaculdade.DTOS; 


//ok
namespace ApiFaculdade.Repository.interfaces
{
    public interface ITurmaRepository
    {
        Task<TurmaRespostaDto?> BuscarPorIdAsync(int id);
        Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId);
        Task AtivarTurmaAsync(int turmaId);
        Task<Turma> AdicionarAsync(CriarTurmaDto dto); 
        
        Task<Turma?> AtualizarAsync(Turma turma);
        Task<bool> DeletarAsync(int id);
        Task<IEnumerable<TurmaRespostaDto>> BuscarTodasComDetalhesAsync();
    }
}