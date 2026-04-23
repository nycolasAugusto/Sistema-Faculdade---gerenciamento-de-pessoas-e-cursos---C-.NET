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

        public async Task<IEnumerable<Turma>> BuscarTodasAsync()
        {
            return await _context.Turmas
                .Include(t => t.Professor)
                .Include(t => t.Cursos)
                .Include(t => t.Alunos)
                .ToListAsync();
        }

        public async Task<Turma?> BuscarPorIdAsync(int id)
        {
            return await _context.Turmas
                .Include(t => t.Professor)
                .Include(t => t.Cursos)
                .Include(t => t.Alunos)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
        public async Task<Turma?> AdicionarAlunosDeUmCursoAsync(int turmaId, int cursoId)
        {
            // 1. Busca a turma no banco, já trazendo os alunos e cursos que ela tem hoje
            var turma = await _context.Turmas
                .Include(t => t.Alunos)
                .Include(t => t.Cursos)
                .FirstOrDefaultAsync(t => t.Id == turmaId);

            // Se a turma não existir, retorna nulo para o Controller dar erro 404
            if (turma == null) return null;

            // 2. Busca TODOS os alunos que pertencem ao curso especificado
            var alunosDoCurso = await _context.Alunos
                .Where(a => a.CursoId == cursoId)
                .ToListAsync();

            // 3. Adiciona os alunos na Turma (Cuidando para não adicionar duplicado!)
            foreach (var aluno in alunosDoCurso)
            {
                // Se o ID do aluno NÃO estiver na lista da turma, a gente adiciona
                if (!turma.Alunos.Any(a => a.Id == aluno.Id))
                {
                    turma.Alunos.Add(aluno);
                }
            }

            // Opcional: Já vincula o Curso à Turma também, caso não esteja vinculado
            var curso = await _context.Cursos.FindAsync(cursoId);
            if (curso != null && !turma.Cursos.Any(c => c.Id == cursoId))
            {
                turma.Cursos.Add(curso);
            }

            // 4. Salva no banco de dados
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
                // 2. Busca os cursos reais no banco
                var cursosReais = await _context.Cursos
                    .Where(c => dto.CursosIds.Contains(c.Id))
                    .ToListAsync();
                    
                novaTurma.Cursos = cursosReais;

                // 3. A REGRA DE OURO: Busca todos os alunos que pertencem a esses cursos!
                var alunosDaTurma = await _context.Alunos
                    .Where(a => dto.CursosIds.Contains(a.CursoId)) // Pega alunos baseados nos CursosIds
                    .ToListAsync();

                novaTurma.Alunos = alunosDaTurma;
            }

            // 4. Salva tudo de uma vez
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

            // Limpa as listas antigas e vincula as novas iterando os objetos
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
    }
}