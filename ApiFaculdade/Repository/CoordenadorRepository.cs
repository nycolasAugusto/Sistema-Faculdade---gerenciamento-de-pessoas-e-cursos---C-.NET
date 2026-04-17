using ApiFaculdade.Models;
using ApiFaculdade.Data;
using ApiFaculdade.Repository.interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiFaculdade.Repository
{
    public class CoordenadorRepository : ICoordenadorRepository
    {
        private readonly AppDbContext _context;

        public CoordenadorRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Coordenador> GetAll()
        {
            return _context.Coordenadores
                .Include(c => c.listaDeTurmas)
                .Include(c => c.listaDeCursos)
                .ToList();
        }

        public Coordenador GetById(int id)
        {
            return _context.Coordenadores
                .Include(c => c.listaDeTurmas)
                .Include(c => c.listaDeCursos)
                .FirstOrDefault(c => c.Id == id);
        }

        public void Add(Coordenador coordenador)
        {
            _context.Coordenadores.Add(coordenador);
            _context.SaveChanges();
        }

        public void Update(Coordenador coordenador)
        {
            _context.Coordenadores.Update(coordenador);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var coord = GetById(id);
            if (coord != null)
            {
                _context.Coordenadores.Remove(coord);
                _context.SaveChanges();
            }
        }
    }
}