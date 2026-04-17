using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Models;
using ApiFaculdade.Data;
using ApiFaculdade.Repository.interfaces;

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

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repository.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var curso = await _repository.GetByIdAsync(id);
            return curso == null ? NotFound() : Ok(curso);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Curso curso) {
            try {
                await _repository.AddAsync(curso);
                return CreatedAtAction(nameof(GetById), new { id = curso.Id }, curso);
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
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