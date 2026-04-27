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
        public async Task<IActionResult> Put(int id, [FromBody] Curso curso)
        {
          
            if (id != curso.Id)
            {
                return BadRequest(new { message = "O ID da URL deve ser igual ao ID do corpo da requisição." });
            }

            try
            {            
                await _repository.UpdateAsync(curso);
                return Ok(new { message = "Curso atualizado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //adicionar ou alterar coord de 1 curso sem mandar o JSON DO CURSO TODO ...
        [HttpPut("coordenador/{id}")]
        public async Task<IActionResult> AdicionarCoordenador(int id, [FromBody] IdsCoordenadores dto)
        {
            try
            {
                await _repository.AlterarCoordenadores(id, dto.CoordenadorIds);
                return Ok(new { message = "Coordenadores atualizados com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }