using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Models;
using ApiFaculdade.Data;
using ApiFaculdade.Repository.interfaces; 
using ApiFaculdade.DTOS; 

namespace ApiFaculdade.Controllers;


    [ApiController]
    [Route("api/cursos")]
    public class CursoController : ControllerBase
    {

        private readonly ICursoRepository _repository;

        // Injeção de dependência do Repositório
        public CursoController(ICursoRepository repository) {
            _repository = repository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Curso>> GetCurso(int id)
        {
            var curso = await _repository.GetByIdAsync(id);
            if (curso == null) return NotFound();
            return Ok(curso);
        }

        

        [HttpPost]
        public async Task<ActionResult<Curso>> PostCurso(CriarCursoDto dto)
        {
            
            var cursoSalvo = await _repository.AdicionarAsync(dto);

            return CreatedAtAction(nameof(GetCurso), new { id = cursoSalvo.Id }, cursoSalvo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Curso curso) {
            if (id != curso.Id) return BadRequest();
            await _repository.UpdateAsync(curso);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }