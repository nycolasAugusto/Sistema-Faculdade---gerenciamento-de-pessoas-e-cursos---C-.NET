using ApiFaculdade.Models;
 
namespace ApiFaculdade.Repository.interfaces
{
    public interface IFuncionarioRepository
    {
        Task<IEnumerable<Funcionario>> GetAllAsync();
        Task<Funcionario?> GetByIdAsync(int id);
        Task<Funcionario?> GetByMatriculaAsync(string matricula);
        Task<IEnumerable<Funcionario>> GetByCargoAsync(CargoFuncionario cargo);
        Task<IEnumerable<Funcionario>> GetByDepartamentoAsync(string departamento);
        Task AddAsync(Funcionario funcionario);
        Task UpdateAsync(Funcionario funcionario);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}