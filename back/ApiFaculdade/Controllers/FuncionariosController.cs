using ApiFaculdade.Controllers.DTOS;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Adicionado

namespace ApiFaculdade.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Coordenador")] // REGRA: Apenas Coordenador tem acesso aos endpoints abaixo
    public class FuncionariosController : ControllerBase
    {
        private readonly IFuncionarioRepository _repository;

        public FuncionariosController(IFuncionarioRepository repository)
        {
            _repository = repository;
        }

       [HttpPost]
        [Authorize(Roles = "Gestor")] 
        public async Task<ActionResult<Funcionario>> Create([FromBody] CriarFuncionarioDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
 
            Funcionario funcionario = new Funcionario
            {
                Nome         = dto.Nome,
                Email        = dto.Email,
                Cargo        = dto.Cargo,
                Departamento = dto.Departamento,
                // Lembre-se de definir uma senha padrão ou pedir no DTO para o novo usuário criado
                Senha        = "faculdade123" 
            };
 
            await _repository.AddAsync(funcionario);
 
            return CreatedAtAction(nameof(GetById), new { id = funcionario.Id }, funcionario);
        }


        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Funcionario>>> GetAll()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Funcionario>> GetById(int id)
        {
            Funcionario? funcionario = await _repository.GetByIdAsync(id);
            if (funcionario is null)
                return NotFound(new { message = $"Funcionário com Id {id} não encontrado." });

            return Ok(funcionario);
        }
        
        [HttpGet("matricula/{matricula}")]
        public async Task<ActionResult<Funcionario>> GetByMatricula(string matricula)
        {
            Funcionario? funcionario = await _repository.GetByMatriculaAsync(matricula);
            if (funcionario is null)
                return NotFound(new { message = $"Funcionário com matrícula '{matricula}' não encontrado." });

            return Ok(funcionario);
        }
      
        [HttpGet("cargo/{cargo}")]
        public async Task<ActionResult<IEnumerable<Funcionario>>> GetByCargo(CargoFuncionario cargo)
        {
            return Ok(await _repository.GetByCargoAsync(cargo));
        }

        [HttpGet("departamento/{departamento}")]
        public async Task<ActionResult<IEnumerable<Funcionario>>> GetByDepartamento(string departamento)
        {
            return Ok(await _repository.GetByDepartamentoAsync(departamento));
        }
 
        
      
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Funcionario funcionario)
        {
            if (id != funcionario.Id)
                return BadRequest(new { message = "Id da rota diferente do Id do corpo da requisição." });
 
            if (!await _repository.ExistsAsync(id))
                return NotFound(new { message = $"Funcionário com Id {id} não encontrado." });
 
            await _repository.UpdateAsync(funcionario);
            return NoContent();
        }
        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _repository.ExistsAsync(id))
                return NotFound(new { message = $"Funcionário com Id {id} não encontrado." });
 
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}