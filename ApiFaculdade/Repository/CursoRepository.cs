using ApiFaculdade.Models;
using ApiFaculdade.Data;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFaculdade.Repository
{
    public class CursoRepository : ICursoRepository
    {
        private readonly AppDbContext _context;

        public CursoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Curso>> GetAllAsync()
        {
            return await _context.Cursos.ToListAsync();
        }

        public async Task<Curso?> GetByIdAsync(int id)
        {
            return await _context.Cursos.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Curso> AdicionarAsync(CriarCursoDto dto)
        {
            if (dto.DataInicio >= dto.DataFim)
            {
                throw new Exception("A data de término do curso não pode ser anterior ou igual à data de início.");
            }

            Curso novoCurso = new Curso
            {
                NomeCursoEnum = dto.NomeCursoEnum,
                TempoDoCursoEmMeses = dto.TempoDoCursoEmMeses,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                Campus = dto.Campus
            };

            if (dto.CoordenadorIds != null && dto.CoordenadorIds.Any())
            {
                List<Funcionario> coordenadoresReais = await _context.Funcionarios
                    .Where(f => dto.CoordenadorIds.Contains(f.Id))
                    .ToListAsync();

                if (coordenadoresReais.Any(f => f.Cargo != CargoFuncionario.Coordenador))
                {
                    throw new Exception("Um ou mais funcionários selecionados não possuem o cargo de Coordenador.");
                }

                novoCurso.Coordenador = coordenadoresReais;
            }

            _context.Cursos.Add(novoCurso);
            await _context.SaveChangesAsync();

            return novoCurso;
        }

        public async Task UpdateAsync(Curso cursoAtualizado)
        {
            Curso? cursoOriginal = await _context.Cursos.FindAsync(cursoAtualizado.Id);
            
            if (cursoOriginal == null)
            {
                throw new Exception("Curso não encontrado para atualização.");
            }

            if (cursoAtualizado.DataInicio >= cursoAtualizado.DataFim)
            {
                throw new Exception("A data de término não pode ser anterior ou igual à data de início.");
            }

            cursoOriginal.NomeCursoEnum = cursoAtualizado.NomeCursoEnum;
            cursoOriginal.TempoDoCursoEmMeses = cursoAtualizado.TempoDoCursoEmMeses;
            cursoOriginal.DataInicio = cursoAtualizado.DataInicio;
            cursoOriginal.DataFim = cursoAtualizado.DataFim;
            cursoOriginal.Campus = cursoAtualizado.Campus;

            _context.Cursos.Update(cursoOriginal);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Curso? curso = await _context.Cursos
                .Include(c => c.Alunos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (curso != null)
            {
                if (curso.Alunos != null && curso.Alunos.Any())
                {
                    throw new Exception("Não é possível excluir este curso pois existem alunos matriculados nele.");
                }

                bool cursoVinculadoTurma = await _context.Turmas.AnyAsync(t => t.Cursos.Any(c => c.Id == id));
                if (cursoVinculadoTurma)
                {
                    throw new Exception("Não é possível excluir este curso pois ele está vinculado a uma ou mais turmas.");
                }

                _context.Cursos.Remove(curso);
                await _context.SaveChangesAsync();
            }
        }
    }
}