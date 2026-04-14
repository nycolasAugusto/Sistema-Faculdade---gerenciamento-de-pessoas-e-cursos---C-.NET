using ApiFaculdade.Enums;

namespace ApiFaculdade.Models{
    public class Curso{
        public int Id{get;set;}
        public Cursos Nome { get; set; }
        public int TempoDoCursoEmMeses { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Campus { get; set; }
        public List<int> AlunosIds { get; set; } = new List<int>();
        public List<string> Coordenadores { get; set; } = new List<string>();
        public List<string> Materias { get; set; } = new List<string>();
    }
}