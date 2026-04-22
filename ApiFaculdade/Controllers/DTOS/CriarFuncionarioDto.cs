using ApiFaculdade.Models;
 
namespace ApiFaculdade.Controllers.DTOS
{
    public class CriarFuncionarioDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public CargoFuncionario Cargo { get; set; }
        public string Departamento { get; set; } = string.Empty;
    }
}
 