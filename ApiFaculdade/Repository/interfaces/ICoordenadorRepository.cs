using ApiFaculdade.Models;

namespace ApiFaculdade.Repository.interfaces
{
    public interface ICoordenadorRepository
    {
        IEnumerable<Coordenador> GetAll();
        Coordenador GetById(int id);
        void Add(Coordenador coordenador);
        void Update(Coordenador coordenador);
        void Delete(int id);
   
   
    }


}