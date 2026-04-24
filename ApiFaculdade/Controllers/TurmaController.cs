using Microsoft.AspNetCore.Mvc;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;
using ApiFaculdade.DTOS;


namespace ApiFaculdade.Controllers
{
    [Route("api/turmas")]
    [ApiController]
    public class TurmaController : ControllerBase
    {
        private readonly ITurmaRepository _turmaRepository;

     
        public TurmaController(ITurmaRepository turmaRepository)
        {
            _turmaRepository = turmaRepository;
        }

    
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Turma>>> GetTurmas()
        {
            var turmas = await _turmaRepository.BuscarTodasAsync();
            return Ok(turmas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Turma>> GetTurma(int id)
        {
            var turma = await _turmaRepository.BuscarPorIdAsync(id);

            if (turma == null)
            {
                return NotFound(new { mensagem = $"Turma com ID {id} não encontrada." });
            }

            return Ok(turma);
        }

        [HttpPost("{turmaId}/adicionar-curso/{cursoId}")]
        public async Task<ActionResult<Turma>> AdicionarAlunosDoCurso(int turmaId, int cursoId)
        {
            var turmaAtualizada = await _turmaRepository.AdicionarAlunosDeUmCursoAsync(turmaId, cursoId);

            if (turmaAtualizada == null)
            {
                return NotFound(new { mensagem = $"Turma com ID {turmaId} não encontrada." });
            }

            return Ok(turmaAtualizada);
        }

        [HttpPost]
        public async Task<ActionResult<Turma>> PostTurma(CriarTurmaDto dto)
        {
           
            var turmaSalva = await _turmaRepository.AdicionarAsync(dto);
            return CreatedAtAction(nameof(GetTurma), new { id = turmaSalva.Id }, turmaSalva);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTurma(int id, Turma turma)
        {
            if (id != turma.Id)
            {
                return BadRequest(new { mensagem = "O ID da URL não bate com o ID do corpo da requisição." });
            }

            var turmaAtualizada = await _turmaRepository.AtualizarAsync(turma);

            if (turmaAtualizada == null)
            {
                return NotFound(new { mensagem = $"Turma com ID {id} não encontrada." });
            }

            return Ok(turmaAtualizada);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTurma(int id)
        {
            var deletado = await _turmaRepository.DeletarAsync(id);

            if (!deletado)
            {
                return NotFound(new { mensagem = $"Turma com ID {id} não encontrada." });
            }

            return NoContent(); 
        }
    }
}