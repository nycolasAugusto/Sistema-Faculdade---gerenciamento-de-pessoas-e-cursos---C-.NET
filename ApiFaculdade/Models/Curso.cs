using ApiFaculdade.Enums;





namespace ApiFaculdade.Models{


    public class Curso{
        public int Id{get;set;}
        public Cursos NomeCursoEnum { get; set; }
        public int TempoDoCursoEmMeses { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Campus { get; set; }
        public List<Aluno>? Alunos { get; set; } = new List<Aluno>();
        
        public List<Funcionario> Coordenador { get; set; } = new List<Funcionario>();
        public List<MateriasEnum> Materias { get; set; } = new List<MateriasEnum>();
    }
}