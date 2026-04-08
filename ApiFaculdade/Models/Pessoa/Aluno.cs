// 
// 1 curso 
// ate 7 materias 
// periodo que esta 
//matricula
using ApiFaculdade.Enums;
using ApiFaculdade.Models;

namespace ApiFaculdade.Models{

    public class Aluno : Pessoa{

        public string Matricula {get; set ;}
        public Curso cursoAluno{get; set ;}
        public int periodoAtual{get; set ;}
        public List<MateriasEnum> ListaDematerias{get; set ;}

    }




}
