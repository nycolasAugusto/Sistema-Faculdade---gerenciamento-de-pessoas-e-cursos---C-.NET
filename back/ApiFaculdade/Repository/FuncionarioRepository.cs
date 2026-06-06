using ApiFaculdade.Data;
using ApiFaculdade.Models;
using ApiFaculdade.Enums;
using ApiFaculdade.Repository.interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFaculdade.Repository
{
    public class FuncionarioRepository : IFuncionarioRepository
    {
        private readonly AppDbContext _context;

        public FuncionarioRepository(AppDbContext context)
        {
            _context = context;
        }

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
            string anoAtual = funcionario.DataAdmissao.Year.ToString();
            string numeroAleatorio = new Random().Next(1000, 9999).ToString();
            funcionario.Matricula = $"FUN{anoAtual}{numeroAleatorio}";

            await _context.Funcionarios.AddAsync(funcionario);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Funcionario funcionario)
        {
            Funcionario? funcionarioOriginal = await _context.Funcionarios.FindAsync(funcionario.Id);

            if (funcionarioOriginal == null)
            {
                throw new Exception("Funcionário não encontrado para atualização.");
            }

            funcionarioOriginal.Nome         = funcionario.Nome;
            funcionarioOriginal.Email        = funcionario.Email;        // ← estava faltando
            funcionarioOriginal.Cargo        = funcionario.Cargo;
            funcionarioOriginal.Departamento = funcionario.Departamento;

            _context.Funcionarios.Update(funcionarioOriginal);
            await _context.SaveChangesAsync();
        }

       public async Task DeleteAsync(int id)
        {
           
            Funcionario? funcionario = await GetByIdAsync(id);

            if (funcionario == null)
            {
                throw new Exception("Funcionário não encontrado.");
            }

           
            if (funcionario.Cargo == CargoFuncionario.Professor)
            {
                bool temTurmaVinculada = await _context.Turmas.AnyAsync(t => t.ProfessorId == id);
                
                if (temTurmaVinculada)
                {
                    throw new Exception("Não é possível deletar este professor pois ele está atrelado a uma ou mais turmas.");
                }
            }

          
            _context.Funcionarios.Remove(funcionario);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Funcionarios.AnyAsync(f => f.Id == id);
        }
    }
}