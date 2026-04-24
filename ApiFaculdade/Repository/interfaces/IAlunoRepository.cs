using ApiFaculdade.Models;
using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;
//ok
namespace ApiFaculdade.Repository.interfaces
{
    public interface IAlunoRepository
    {
        Task<IEnumerable<Aluno>> GetAllAsync();
        Task<Aluno?> GetByIdAsync(int id);
        Task<Aluno?> GetByMatriculaAsync(string matricula);
        Task<IEnumerable<Aluno>> GetByCursoAsync(Cursos curso);
        
        Task<Aluno> AddAsync(CriarAlunoDto dto);
        
        Task UpdateAsync(Aluno aluno);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}