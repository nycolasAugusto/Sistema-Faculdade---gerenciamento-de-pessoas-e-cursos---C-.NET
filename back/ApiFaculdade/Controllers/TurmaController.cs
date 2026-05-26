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
        public async Task<ActionResult<IEnumerable<TurmaRespostaDto>>> GetAll()
        {
            var turmas = await _turmaRepository.BuscarTodasComDetalhesAsync();
            
            return Ok(turmas);
        }
        [HttpPatch("{id}/ativar")]
        public async Task<IActionResult> Ativar(int id)
        {
            try
            {
                await _turmaRepository.AtivarTurmaAsync(id);
                return Ok(new { message = "Turma iniciada com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TurmaRespostaDto>> GetById(int id)
        {
            try
            {
                TurmaRespostaDto? turma = await _turmaRepository.GetByIdAsync(id);

                if (turma == null)
                {
                    return NotFound(new { message = $"Turma com Id {id} não encontrada." });
                }

                return Ok(turma);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{turmaId}/adicionar-curso/{cursoId}")]
        public async Task<ActionResult<Turma>> AdicionarAlunosDoCurso(int turmaId, int cursoId)
        {
            var turmaAtualizada = await _turmaRepository.AdicionarAlunosDeUmCursoAsync(turmaId, cursoId);

            if (turmaAtualizada == null)
            {
                return NotFound(new { mensagem = $"Turma com ID {turmaId} não encontrada." });
            }

            return Ok("Turma Atrelada ao curso com sucesso !");
        }

        [HttpPost]
        public async Task<ActionResult<TurmaRespostaDto>> PostTurma(CriarTurmaDto dto)
        {
           
            var turmaSalva = await _turmaRepository.AdicionarAsync(dto);
            TurmaRespostaDto turmaResposta = await _turmaRepository.GetByIdAsync
            (turmaSalva.Id);
            return CreatedAtAction(nameof(GetById), new { id = turmaResposta.Id }, turmaResposta);
        }

       [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AtualizarTurmaDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "O ID da rota deve ser igual ao ID do corpo da requisição." });
            }

            try
            {
                await _turmaRepository.UpdateAsync(id, dto);
                return Ok(new { message = "Turma atualizada com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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