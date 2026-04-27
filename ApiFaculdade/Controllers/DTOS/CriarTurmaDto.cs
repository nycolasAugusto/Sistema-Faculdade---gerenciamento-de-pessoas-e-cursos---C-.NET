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
    public class AtualizarTurmaDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da turma é obrigatório.")]
        public string Nome { get; set; } = string.Empty;


        [Required]
        public int ProfessorId { get; set; }

        [Required]
        public List<int> CursosIds { get; set; } = new List<int>();

        [Required]
        public bool EmAndamento { get; set; }
    }
}


    
