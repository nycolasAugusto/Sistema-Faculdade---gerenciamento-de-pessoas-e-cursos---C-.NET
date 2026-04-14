using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Models;
using ApiFaculdade.Data;


namespace ApiFaculdade.Controllers{

    [ApiController]
    [Route("api/coordenadores")]
    public class CoordenadorController : ControllerBase{

        private readonly AppDbContext _context;

        public CoordenadorController(AppDbContext context){
            _context = context;
        }

        [HttpGet]
        public IActionResult Get(){
            List<Coordenador>? coordenadores = _context.Coordenadores
                .Include(c => c.listaDeTurmas)
                .Include(c => c.listaDeCursos)
                .ToList();
            return Ok(coordenadores);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id){
            Coordenador? coordenador = _context.Coordenadores
                .Include(c => c.listaDeTurmas)
                .Include(c => c.listaDeCursos)
                .FirstOrDefault(c => c.Id == id);

            if(coordenador == null)
                return NotFound();

            return Ok(coordenador);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Coordenador coordenador){
            _context.Coordenadores.Add(coordenador);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = coordenador.Id }, coordenador);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Coordenador coordenador){
            Coordenador? coordenadorExistente = _context.Coordenadores.FirstOrDefault(c => c.Id == id);

            if(coordenadorExistente == null)
                return NotFound();

            coordenadorExistente.Nome = coordenador.Nome;
            coordenadorExistente.DataNascimento = coordenador.DataNascimento;
            coordenadorExistente.Contato = coordenador.Contato;
            coordenadorExistente.listaDeTurmas = coordenador.listaDeTurmas;
            coordenadorExistente.listaDeCursos = coordenador.listaDeCursos;

            _context.SaveChanges();
            return Ok(coordenadorExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id){
            Coordenador? coordenador = _context.Coordenadores.FirstOrDefault(c => c.Id == id);

            if(coordenador == null)
                return NotFound();

            _context.Coordenadores.Remove(coordenador);
            _context.SaveChanges();
            return NoContent();
        }
    }
}