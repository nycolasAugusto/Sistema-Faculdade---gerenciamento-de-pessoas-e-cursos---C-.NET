using ApiFaculdade.Enums;

namespace ApiFaculdade.Models
{
    public class Curso
    {
        public int Id { get; set; }
        public Cursos NomeCursoEnum { get; set; }
        public int TempoDoCursoEmMeses { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Campus { get; set; } = string.Empty;
        public List<Aluno>? Alunos { get; set; } = new List<Aluno>();

        // IDs dos coordenadores guardados como "1,2,3" — sem tabela de junção
        // Remove List<Funcionario> Coordenador para evitar FK automática no EF
        public string CoordenadorIds { get; set; } = string.Empty;
    }
}