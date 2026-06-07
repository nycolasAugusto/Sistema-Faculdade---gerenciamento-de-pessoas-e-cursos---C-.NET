using ApiFaculdade.Models;
using ApiFaculdade.Data;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;

namespace ApiFaculdade.Repository
{
    public class CursoRepository : ICursoRepository
    {
        private readonly AppDbContext _context;

        public CursoRepository(AppDbContext context)
        {
            _context = context;
        }

        // ── GET ALL → retorna DTO com coordenadores buscados por CursoId
        public async Task<IEnumerable<CursoRespostaDto>> GetAllAsync()
        {
            List<Curso> cursos = await _context.Cursos
                .Include(c => c.Alunos)
                .ToListAsync();

            List<Funcionario> todosFuncionarios = await _context.Funcionarios.ToListAsync();

            List<CursoRespostaDto> resultado = new();

            foreach (Curso c in cursos)
            {
                List<CoordenadorResumidoDto> coordenadores = todosFuncionarios
                    .Where(f => f.CursoId == c.Id)
                    .Select(f => new CoordenadorResumidoDto
                    {
                        Id    = f.Id,
                        Nome  = f.Nome,
                        Email = f.Email
                    })
                    .ToList();

                resultado.Add(new CursoRespostaDto
                {
                    Id            = c.Id,
                    NomeCurso     = c.NomeCursoEnum.ToString(),
                    TempoEmMeses  = c.TempoDoCursoEmMeses,
                    DataInicio    = c.DataInicio,
                    DataFim       = c.DataFim,
                    Campus        = c.Campus,
                    NomesAlunos   = c.Alunos?.Select(a => a.Nome).ToList() ?? new(),
                    Coordenadores = coordenadores
                });
            }

            return resultado;
        }

        // ── GET BY ID
        public async Task<CursoRespostaDto?> GetByIdAsync(int id)
        {
            Curso? c = await _context.Cursos
                .Include(c => c.Alunos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (c == null) return null;

            List<CoordenadorResumidoDto> coordenadores = await _context.Funcionarios
                .Where(f => f.CursoId == c.Id)
                .Select(f => new CoordenadorResumidoDto
                {
                    Id    = f.Id,
                    Nome  = f.Nome,
                    Email = f.Email
                })
                .ToListAsync();

            return new CursoRespostaDto
            {
                Id            = c.Id,
                NomeCurso     = c.NomeCursoEnum.ToString(),
                TempoEmMeses  = c.TempoDoCursoEmMeses,
                DataInicio    = c.DataInicio,
                DataFim       = c.DataFim,
                Campus        = c.Campus,
                NomesAlunos   = c.Alunos?.Select(a => a.Nome).ToList() ?? new(),
                Coordenadores = coordenadores
            };
        }

        // ── POST
        public async Task<Curso> AdicionarAsync(CriarCursoDto dto)
        {
            if (dto.DataInicio >= dto.DataFim)
                throw new Exception("A data de término não pode ser anterior ou igual à data de início.");

            Curso novoCurso = new Curso
            {
                NomeCursoEnum       = dto.NomeCursoEnum,
                TempoDoCursoEmMeses = dto.TempoDoCursoEmMeses,
                DataInicio          = dto.DataInicio,
                DataFim             = dto.DataFim,
                Campus              = dto.Campus
            };

            _context.Cursos.Add(novoCurso);
            await _context.SaveChangesAsync();

            // Vincula coordenadores pelo CursoId do funcionário
            if (dto.CoordenadorIds != null && dto.CoordenadorIds.Any())
            {
                List<Funcionario> coords = await _context.Funcionarios
                    .Where(f => dto.CoordenadorIds.Contains(f.Id))
                    .ToListAsync();

                if (coords.Any(f => f.Cargo != CargoFuncionario.Coordenador))
                    throw new Exception("Um ou mais funcionários não possuem o cargo de Coordenador.");

                foreach (Funcionario coord in coords)
                    coord.CursoId = novoCurso.Id;

                await _context.SaveChangesAsync();
            }

            return novoCurso;
        }

        // ── PUT (só dados do curso, sem mexer em coordenadores)
        public async Task UpdateAsync(Curso cursoAtualizado)
        {
            Curso? cursoOriginal = await _context.Cursos.FindAsync(cursoAtualizado.Id);

            if (cursoOriginal == null)
                throw new Exception("Curso não encontrado para atualização.");

            if (cursoAtualizado.DataInicio >= cursoAtualizado.DataFim)
                throw new Exception("A data de término não pode ser anterior ou igual à data de início.");

            cursoOriginal.NomeCursoEnum       = cursoAtualizado.NomeCursoEnum;
            cursoOriginal.TempoDoCursoEmMeses = cursoAtualizado.TempoDoCursoEmMeses;
            cursoOriginal.DataInicio          = cursoAtualizado.DataInicio;
            cursoOriginal.DataFim             = cursoAtualizado.DataFim;
            cursoOriginal.Campus              = cursoAtualizado.Campus;

            _context.Cursos.Update(cursoOriginal);
            await _context.SaveChangesAsync();
        }

        // ── ALTERAR COORDENADORES
        public async Task AlterarCoordenadores(int id, List<int> idsEnviados)
        {
            // Remove vínculo dos coordenadores antigos
            List<Funcionario> coordsAntigos = await _context.Funcionarios
                .Where(f => f.CursoId == id)
                .ToListAsync();

            foreach (Funcionario f in coordsAntigos)
                f.CursoId = null;

            // Vincula os novos
            List<Funcionario> novosCoords = await _context.Funcionarios
                .Where(f => idsEnviados.Contains(f.Id))
                .ToListAsync();

            if (!novosCoords.All(f => f.Cargo == CargoFuncionario.Coordenador))
                throw new Exception("Um ou mais IDs não pertencem a Coordenadores.");

            foreach (Funcionario f in novosCoords)
                f.CursoId = id;

            await _context.SaveChangesAsync();
        }

        // ── DELETE
        public async Task DeleteAsync(int id)
        {
            Curso? curso = await _context.Cursos
                .Include(c => c.Alunos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (curso == null) return;

            if (curso.Alunos != null && curso.Alunos.Any())
                throw new Exception("Não é possível excluir este curso pois existem alunos matriculados.");

            bool vinculadoTurma = await _context.Turmas
                .AnyAsync(t => t.Cursos.Any(c => c.Id == id));

            if (vinculadoTurma)
                throw new Exception("Não é possível excluir este curso pois está vinculado a uma ou mais turmas.");

            // Limpa CursoId dos coordenadores antes de deletar
            List<Funcionario> coords = await _context.Funcionarios
                .Where(f => f.CursoId == id)
                .ToListAsync();

            foreach (Funcionario f in coords)
                f.CursoId = null;

            _context.Cursos.Remove(curso);
            await _context.SaveChangesAsync();
        }
    }
}