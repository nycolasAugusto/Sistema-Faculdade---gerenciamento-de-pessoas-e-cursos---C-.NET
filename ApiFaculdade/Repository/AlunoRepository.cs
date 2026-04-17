using ApiFaculdade.Models;
using ApiFaculdade.Data;
using ApiFaculdade.Repository.Interfaces;

namespace ApiFaculdade.Repository
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly AppDbContext _context;

        public AlunoRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Aluno> GetAll() => _context.Alunos.ToList();

        public Aluno GetById(int id) => _context.Alunos.Find(id);

        public void Add(Aluno aluno)
        {
            _context.Alunos.Add(aluno);
            _context.SaveChanges();
        }

        public void Update(Aluno aluno)
        {
            _context.Alunos.Update(aluno);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var aluno = GetById(id);
            if (aluno != null)
            {
                _context.Alunos.Remove(aluno);
                _context.SaveChanges();
            }
        }
    }
}