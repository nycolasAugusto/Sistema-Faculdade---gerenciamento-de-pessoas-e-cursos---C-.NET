using ApiFaculdade.Enums;

namespace ApiFaculdade.Models
{
    public class Aluno
    {
        public int Id { get; set; }
        public string Matricula { get; set; } = string.Empty;

        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int CursoId { get; set; }
        public Curso? curso {get; set;}
        public int Periodo { get; set; }
        public DateTime DataMatricula { get; set; }
        public List<Turma>? turmas {get ; set;}
        public bool? Ativo { get; set; } = true;
    }
}
