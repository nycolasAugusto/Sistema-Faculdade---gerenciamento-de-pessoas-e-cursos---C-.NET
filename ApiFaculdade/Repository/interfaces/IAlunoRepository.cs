using ApiFaculdade.Models;
using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;
//ok
namespace ApiFaculdade.Repository.interfaces
{
    public interface IAlunoRepository
    {
      
        
        Task<Aluno> AddAsync(CriarAlunoDto dto);
        
        Task UpdateAsync(Aluno aluno);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);

        Task<IEnumerable<AlunoRespostaDto>> GetAllAsync();
        Task<AlunoRespostaDto?> GetByIdAsync(int id);
        Task<AlunoRespostaDto?> GetByMatriculaAsync(string matricula);
        Task<IEnumerable<AlunoRespostaDto>> GetByCursoAsync(Cursos curso);
    }
}