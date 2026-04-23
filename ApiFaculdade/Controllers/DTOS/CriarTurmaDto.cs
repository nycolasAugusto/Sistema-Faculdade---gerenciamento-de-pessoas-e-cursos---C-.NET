using System.ComponentModel.DataAnnotations;

namespace ApiFaculdade.DTOS
{
    public class CriarTurmaDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        
        [Required]
        public int ProfessorId { get; set; } 

        [Required]
        public List<int> CursosIds { get; set; } = new List<int>();
    }
}