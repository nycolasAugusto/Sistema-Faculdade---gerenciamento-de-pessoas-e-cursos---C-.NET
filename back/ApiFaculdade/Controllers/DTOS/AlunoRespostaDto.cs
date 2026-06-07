using System.ComponentModel.DataAnnotations;

namespace ApiFaculdade.DTOS
{
    public class AlunoRespostaDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Matricula { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Periodo { get; set; }
        public bool Ativo { get; set; }
        public int CursoId { get; set; }          // ← adicionado
        public string NomeCurso { get; set; } = string.Empty;
        public List<string> NomesDasTurmas { get; set; } = new List<string>();
    }

    public class AtualizarAlunoDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [RegularExpression(@".*@.*", ErrorMessage = "O e-mail deve conter @.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int CursoId { get; set; }

        [Required]
        public int Periodo { get; set; }

        [Required]
        public bool Ativo { get; set; }
    }
}