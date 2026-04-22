using ApiFaculdade.DTOs;
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
 
        // GET api/alunos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluno>>> GetAll()
        {
            return Ok(await _repository.GetAllAsync());
        }
 
        // GET api/alunos/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Aluno>> GetById(int id)
        {
            var aluno = await _repository.GetByIdAsync(id);
            if (aluno is null)
                return NotFound(new { message = $"Aluno com Id {id} não encontrado." });
 
            return Ok(aluno);
        }
 
        // GET api/alunos/matricula/ALU2025001
        [HttpGet("matricula/{matricula}")]
        public async Task<ActionResult<Aluno>> GetByMatricula(string matricula)
        {
            var aluno = await _repository.GetByMatriculaAsync(matricula);
            if (aluno is null)
                return NotFound(new { message = $"Aluno com matrícula '{matricula}' não encontrado." });
 
            return Ok(aluno);
        }
 
        // GET api/alunos/curso/Tecnologia
        [HttpGet("curso/{curso}")]
        public async Task<ActionResult<IEnumerable<Aluno>>> GetByCurso(Cursos curso)
        {
            return Ok(await _repository.GetByCursoAsync(curso));
        }
 
        // POST api/alunos
        // Body: { "nome": "...", "email": "...", "curso": 0, "periodo": 1 }
        // Id, Matricula e DataMatricula são gerados automaticamente — não enviar no body.
        [HttpPost]
        public async Task<ActionResult<Aluno>> Create([FromBody] CriarAlunoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
 
            var aluno = new Aluno
            {
                Nome    = dto.Nome,
                Email   = dto.Email,
                Curso   = dto.Curso,
                Periodo = dto.Periodo
            };
 
            await _repository.AddAsync(aluno);
 
            return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, aluno);
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