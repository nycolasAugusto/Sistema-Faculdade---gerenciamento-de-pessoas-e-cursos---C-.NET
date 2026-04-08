// lista de cursos
// lista de turmas
using ApiFaculdade.Models;

namespace ApiFaculdade.Models{

    public class Coordenador : Pessoa{

        public List<Turma> listaDeTurmas{get; set ;}
        public List<Curso> listaDeCursos{get; set ;}
        

    }




}