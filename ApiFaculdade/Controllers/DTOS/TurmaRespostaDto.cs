using System.ComponentModel.DataAnnotations;
using ApiFaculdade.Enums;

namespace ApiFaculdade.DTOS
{
    
      public class TurmaRespostaDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? ProfessorNome { get; set; }
        
      
        public List<string> NomesDosCursos { get; set; } = new List<string>();
        public List<AlunoSimplesDto> Alunos { get; set; } = new List<AlunoSimplesDto>();
    }

    public class AlunoSimplesDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Matricula { get; set; } = string.Empty;
    }
    }
