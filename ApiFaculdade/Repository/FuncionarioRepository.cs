using ApiFaculdade.Data;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;
using Microsoft.EntityFrameworkCore;
 
namespace ApiFaculdade.Repository
{
    public class FuncionarioRepository : IFuncionarioRepository
    {
        private readonly AppDbContext _context;
 
        public FuncionarioRepository(AppDbContext context)
        {
            _context = context;
        }
 
        // Gera matrícula no formato FUN + ano + id com 3 dígitos (ex: FUN2025001)
        private string GerarMatricula(int id, DateTime dataAdmissao) =>
            $"FUN{dataAdmissao.Year}{id:D3}";
 
        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            return await _context.Funcionarios.ToListAsync();
        }
 
        public async Task<Funcionario?> GetByIdAsync(int id)
        {
            return await _context.Funcionarios.FirstOrDefaultAsync(f => f.Id == id);
        }
 
        public async Task<Funcionario?> GetByMatriculaAsync(string matricula)
        {
            return await _context.Funcionarios.FirstOrDefaultAsync(f => f.Matricula == matricula);
        }
 
        public async Task<IEnumerable<Funcionario>> GetByCargoAsync(CargoFuncionario cargo)
        {
            return await _context.Funcionarios.Where(f => f.Cargo == cargo).ToListAsync();
        }
 
        public async Task<IEnumerable<Funcionario>> GetByDepartamentoAsync(string departamento)
        {
            return await _context.Funcionarios
                .Where(f => f.Departamento.Contains(departamento))
                .ToListAsync();
        }
 
        public async Task AddAsync(Funcionario funcionario)
        {
            funcionario.DataAdmissao = DateTime.Now;
 
            await _context.Funcionarios.AddAsync(funcionario);
            await _context.SaveChangesAsync();
 
            // Gera matrícula após salvar (Id gerado pelo banco)
            funcionario.Matricula = GerarMatricula(funcionario.Id, funcionario.DataAdmissao);
            await _context.SaveChangesAsync();
        }
 
        public async Task UpdateAsync(Funcionario funcionario)
        {
            _context.Funcionarios.Update(funcionario);
            await _context.SaveChangesAsync();
        }
 
        public async Task DeleteAsync(int id)
        {
            var funcionario = await GetByIdAsync(id);
            if (funcionario is not null)
            {
                _context.Funcionarios.Remove(funcionario);
                await _context.SaveChangesAsync();
            }
        }
 
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Funcionarios.AnyAsync(f => f.Id == id);
        }
    }
}