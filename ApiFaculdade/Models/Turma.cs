

namespace ApiFaculdade.Models{
    public class Turma{
        public int Id{get;set;}
        
        public string Nome { get; set; }
        
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int PeriodoAtual { get; set; }

        public int ProfessorId { get; set; } 
        public List<int> AlunosIds { get; set; } = new List<int>();
        public List<int> CursosIds { get; set; } = new List<int>();

    }
}


