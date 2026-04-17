using ApiFaculdade.Models;

namespace ApiFaculdade.Repository.interfaces
{
    public interface IAlunoRepository
    {
        IEnumerable<Aluno> GetAll();
        Aluno GetById(int id);
        void Add(Aluno aluno);
        void Update(Aluno aluno);
        void Delete(int id);
    }
}