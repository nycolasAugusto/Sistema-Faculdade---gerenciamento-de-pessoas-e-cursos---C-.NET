using Microsoft.AspNetCore.Mvc;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;

namespace ApiFaculdade.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Use [controller] para pegar o nome da classe automaticamente
    public class CoordenadorController : ControllerBase
    {
        private readonly ICoordenadorRepository _repository;

        public CoordenadorController(ICoordenadorRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_repository.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var coord = _repository.GetById(id);
            return coord != null ? Ok(coord) : NotFound();
        }

        [HttpPost]
        public IActionResult Post([FromBody] Coordenador coordenador)
        {
            _repository.Add(coordenador);
            return CreatedAtAction(nameof(GetById), new { id = coordenador.Id }, coordenador);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Coordenador coordenador)
        {
            var existente = _repository.GetById(id);
            if (existente == null) return NotFound();

            // Regra de Negócio Simples: Validação de Nome
            if (string.IsNullOrEmpty(coordenador.Nome)) 
                return BadRequest("O nome do coordenador é obrigatório.");

            _repository.Update(coordenador);
            return Ok(coordenador);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existente = _repository.GetById(id);
            if (existente == null) return NotFound();

            _repository.Delete(id);
            return NoContent();
        }
    }
}