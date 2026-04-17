using Microsoft.AspNetCore.Mvc;
using ApiFaculdade.Models;
using ApiFaculdade.Repository.interfaces;

namespace ApiFaculdade.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : ControllerBase
    {
        private readonly IAlunoRepository _alunoRepository;

        // Injetando a Interface em vez do Contexto
        public AlunoController(IAlunoRepository alunoRepository)
        {
            _alunoRepository = alunoRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_alunoRepository.GetAll());
        }

        [HttpPost]
        public IActionResult Post([FromBody] Aluno aluno)
        {
            if (aluno == null) return BadRequest();
            
            _alunoRepository.Add(aluno);
            return CreatedAtAction(nameof(Get), new { id = aluno.Matricula }, aluno);
        }
    }
}