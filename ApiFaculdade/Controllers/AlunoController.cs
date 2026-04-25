using ApiFaculdade.DTOS;
using ApiFaculdade.Enums;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;
 
namespace ApiFaculdade.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunosController : ControllerBase
    {
        private readonly IAlunoRepository _repository;
 
        public AlunosController(IAlunoRepository repository)
        {
            _repository = repository;
        }
 
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluno>>> GetAll()
        {
            return Ok(await _repository.GetAllAsync());
        }
 
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Aluno>> GetById(int id)
        {
            var aluno = await _repository.GetByIdAsync(id);
            if (aluno is null)
                return NotFound(new { message = $"Aluno com Id {id} não encontrado." });
 
            return Ok(aluno);
        }
 
        [HttpGet("matricula/{matricula}")]
        public async Task<ActionResult<Aluno>> GetByMatricula(string matricula)
        {
            var aluno = await _repository.GetByMatriculaAsync(matricula);
            if (aluno is null)
                return NotFound(new { message = $"Aluno com matrícula '{matricula}' não encontrado." });
 
            return Ok(aluno);
        }
 
  
        [HttpGet("curso/{curso}")]
        public async Task<ActionResult<IEnumerable<Aluno>>> GetByCurso(Cursos curso)
        {
            return Ok(await _repository.GetByCursoAsync(curso));
        }
 
        
       [HttpPost]
        public async Task<ActionResult<AlunoRespostaDto>> Create([FromBody] CriarAlunoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try 
            {
          
                var alunoSalvo = await _repository.AddAsync(dto);
                var alunoSeguro = await _repository.GetByIdAsync(alunoSalvo.Id);
                return CreatedAtAction(nameof(GetById), new { id = alunoSalvo.Id }, alunoSeguro);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }
 
        // PUT api/alunos/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Aluno aluno)
        {
            if (id != aluno.Id)
                return BadRequest(new { message = "Id da rota diferente do Id do corpo da requisição." });
 
            if (!await _repository.ExistsAsync(id))
                return NotFound(new { message = $"Aluno com Id {id} não encontrado." });
 
            await _repository.UpdateAsync(aluno);
            return NoContent();
        }
 
        // DELETE api/alunos/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _repository.ExistsAsync(id))
                return NotFound(new { message = $"Aluno com Id {id} não encontrado." });
 
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}