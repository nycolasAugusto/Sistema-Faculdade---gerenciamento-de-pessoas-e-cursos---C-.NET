using System.ComponentModel.DataAnnotations;
using ApiFaculdade.Enums;

namespace ApiFaculdade.DTOS
{
    public class CriarCursoDto
    {
        [Required]
        public Cursos NomeCursoEnum { get; set; }
        
        [Required]
        public int TempoDoCursoEmMeses { get; set; }
        
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        
        [Required]
        public string Campus { get; set; } = string.Empty;

        [Required]
        public List<int> CoordenadorIds { get; set; } = new List<int>();

    }
}