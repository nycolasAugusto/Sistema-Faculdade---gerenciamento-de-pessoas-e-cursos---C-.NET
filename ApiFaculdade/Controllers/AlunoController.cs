using Microsoft.AspNetCore.Mvc;
using ApiFaculdade.Models;
using ApiFaculdade.Data;


namespace ApiFaculdade.Controllers{

    [ApiController]
    [Route("api/alunos")]
    public class AlunoController : ControllerBase{

        private readonly AppDbContext _context;

        public AlunoController(AppDbContext context){
            _context = context;
        }


        [HttpGet]
        public IActionResult Get(){
            return Ok(_context.Alunos.ToList());
        }


        [HttpPost]
        public IActionResult Post([FromBody] Aluno aluno){
            
            
            _context.Alunos.Add(aluno);
            _context.SaveChanges();
            return Ok(aluno);


        }



    }
}