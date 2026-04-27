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
    public class IdsCoordenadores{
        [Required]
        public List<int> CoordenadorIds {get; set;} = new List<int>();
    }
    public class CursoRespostaDto
    {
        public int Id { get; set; }
        public string NomeCurso { get; set; } = string.Empty;
        public int TempoEmMeses { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Campus { get; set; } = string.Empty;
        public List<string> NomesAlunos { get; set; } = new List<string>();
        public List<CoordenadorResumidoDto> Coordenadores { get; set; } = new List<CoordenadorResumidoDto>();
    }

    public class CoordenadorResumidoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}