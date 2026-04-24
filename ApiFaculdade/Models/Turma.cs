
//ok

namespace ApiFaculdade.Models{
    public class Turma{
        public int Id{get;set;}
        
        public string Nome { get; set; }
        
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        
        public int ProfessorId { get; set; } 
        public Funcionario Professor {get; set;}
        public List<Aluno> Alunos { get; set; } = new List<Aluno>();
        
        public List<Curso> Cursos { get; set; } = new List<Curso>();

         

    }
}







 