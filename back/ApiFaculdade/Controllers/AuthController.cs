using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ApiFaculdade.Models;
using ApiFaculdade.Data; 
using Microsoft.EntityFrameworkCore;

namespace ApiFaculdade.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Funcionario dadosLogin)
        {
            // 1. Usa o próprio modelo Funcionario para buscar o E-mail e Senha informados na tela
            Funcionario? funcionarioDb = await _context.Funcionarios
                .FirstOrDefaultAsync(f => f.Email == dadosLogin.Email && f.Senha == dadosLogin.Senha);

            // 2. Se encontrar o funcionário no banco de dados, gera o token
            if (funcionarioDb != null)
            {
                string token = GerarToken(funcionarioDb);
                
                return Ok(new 
                { 
                    token = token,
                    perfil = funcionarioDb.Cargo.ToString(),
                    usuarioId = funcionarioDb.Id
                });
            }

            return Unauthorized(new { message = "E-mail ou senha incorretos." });
        }

        private string GerarToken(Funcionario funcionario)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                "minha-chave-super-secreta-com-mais-de-32-caracteres"));
                
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 3. Grava o Cargo do funcionário dentro do Token (Isso faz o [Authorize] funcionar)
            Claim[] claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, funcionario.Email),
                new Claim(ClaimTypes.Role, funcionario.Cargo.ToString()) 
            };

            JwtSecurityToken token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}