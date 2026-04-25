using ApiFaculdade.Data; 
using ApiFaculdade.Models;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;

namespace ApiFaculdade.Repository
{
    public class TurmaRepository : ITurmaRepository
    {
        private readonly AppDbContext _context;

        public TurmaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TurmaRespostaDto?> BuscarPorIdAsync(int id)
        {
            return await _context.Turmas
                .Where(t => t.Id == id)
                .Select(t => new TurmaRespostaDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    ProfessorNome = t.Professor != null ? t.Professor.Nome : "Sem professor",
                    
                    NomesDosCursos = t.Cursos.Select(c => c.NomeCursoEnum.ToString()).ToList(),
                    
                    Alunos = t.Alunos.Select(a => new AlunoSimplesDto
                    {
                        Id = a.Id,
                        Nome = a.Nome,
                        Matricula = a.Matricula
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
        public async Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId)
        {
           
            var turma = await _context.Turmas
                .Include(t => t.Alunos)
                .Include(t => t.Cursos)
                .FirstOrDefaultAsync(t => t.Id == turmaId);

           
            if (turma == null) return null;

            
            var alunosDoCurso = await _context.Alunos
                .Where(a => a.CursoId == cursoId)
                .ToListAsync();

           
            foreach (var aluno in alunosDoCurso)
            {
                
                if (!turma.Alunos.Any(a => a.Id == aluno.Id))
                {
                    turma.Alunos.Add(aluno);
                }
            }

            var curso = await _context.Cursos.FindAsync(cursoId);
            if (curso != null && !turma.Cursos.Any(c => c.Id == cursoId))
            {
                turma.Cursos.Add(curso);
            }

            await _context.SaveChangesAsync();

            return turma;
        }
        public async Task<Turma> AdicionarAsync(CriarTurmaDto dto)
        {
      
            var novaTurma = new Turma
            {
                Nome = dto.Nome,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                ProfessorId = dto.ProfessorId 
            };

            if (dto.CursosIds != null && dto.CursosIds.Any())
            {
                var cursosReais = await _context.Cursos
                    .Where(c => dto.CursosIds.Contains(c.Id))
                    .ToListAsync();
                    
                novaTurma.Cursos = cursosReais;

                
                var alunosDaTurma = await _context.Alunos
                    .Where(a => dto.CursosIds.Contains(a.CursoId)) 
                    .ToListAsync();

                novaTurma.Alunos = alunosDaTurma;
            }

            _context.Turmas.Add(novaTurma);
            await _context.SaveChangesAsync();
            
            return novaTurma;
        }
        public async Task<Turma?> AtualizarAsync(Turma turma)
        {
            var turmaExistente = await _context.Turmas
                .Include(t => t.Cursos)
                .Include(t => t.Alunos)
                .FirstOrDefaultAsync(t => t.Id == turma.Id);

            if (turmaExistente == null) return null;

            turmaExistente.Nome = turma.Nome;
            turmaExistente.DataInicio = turma.DataInicio;
            turmaExistente.DataFim = turma.DataFim;
            turmaExistente.ProfessorId = turma.ProfessorId;

            if (turma.Cursos != null)
            {
                turmaExistente.Cursos.Clear();
                var idsCursos = turma.Cursos.Select(c => c.Id).ToList();
                turmaExistente.Cursos = await _context.Cursos.Where(c => idsCursos.Contains(c.Id)).ToListAsync();
            }

            if (turma.Alunos != null)
            {
                turmaExistente.Alunos.Clear();
                var idsAlunos = turma.Alunos.Select(a => a.Id).ToList();
                turmaExistente.Alunos = await _context.Alunos.Where(a => idsAlunos.Contains(a.Id)).ToListAsync();
            }

            await _context.SaveChangesAsync();
            return turmaExistente;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var turmaExistente = await _context.Turmas.FindAsync(id);
            if (turmaExistente == null) return false;

            _context.Turmas.Remove(turmaExistente);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<TurmaRespostaDto>> BuscarTodasComDetalhesAsync()
        {
    
            return await _context.Turmas
                .Select(t => new TurmaRespostaDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    ProfessorNome = t.Professor != null ? t.Professor.Nome : "Sem professor",
                    
                    NomesDosCursos = t.Cursos.Select(c => c.NomeCursoEnum.ToString()).ToList(),
                    
                    Alunos = t.Alunos.Select(a => new AlunoSimplesDto
                    {
                        Id = a.Id,
                        Nome = a.Nome,
                        Matricula = a.Matricula
                    }).ToList()
                })
                .ToListAsync(); 
        }

        public async Task AtivarTurmaAsync(int turmaId)
        {
            var turma = await _context.Turmas
                .Include(t => t.Alunos)
                .FirstOrDefaultAsync(t => t.Id == turmaId);

            if (turma == null)
                throw new Exception("Turma não encontrada.");

          
            if (turma.Alunos == null || turma.Alunos.Count < 5)
            {
                throw new Exception($"Não é possível iniciar a turma. Ela possui apenas {turma.Alunos?.Count ?? 0} alunos, mas o mínimo exigido é 5.");
            }

            turma.EmAndamento = true;
            await _context.SaveChangesAsync();
        }

        
    }
}