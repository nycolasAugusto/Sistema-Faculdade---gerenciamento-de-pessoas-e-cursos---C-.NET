using ApiFaculdade.Models;
using ApiFaculdade.DTOS; 

namespace ApiFaculdade.Repository.interfaces
{
    public interface ITurmaRepository
    {
        Task<IEnumerable<Turma>> BuscarTodasAsync();
        Task<Turma?> BuscarPorIdAsync(int id);
        Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId);
        
        Task<Turma> AdicionarAsync(CriarTurmaDto dto); 
        
        Task<Turma?> AtualizarAsync(Turma turma);
        Task<bool> DeletarAsync(int id);
    }
}