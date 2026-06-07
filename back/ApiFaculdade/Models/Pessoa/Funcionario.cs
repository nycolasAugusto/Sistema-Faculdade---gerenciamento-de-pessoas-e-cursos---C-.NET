using System.Text.Json.Serialization;

namespace ApiFaculdade.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CargoFuncionario
    {
        Professor,
        Coordenador,
        Gestor,
        Secretario,
        Bibliotecario,
        TecnicoAdministrativo,
        DiretorAcademico,
        Reitor
    }

    public class Funcionario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Matricula { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public CargoFuncionario Cargo { get; set; }
        public string Departamento { get; set; } = string.Empty;
        public DateTime DataAdmissao { get; set; }
        public bool? Ativo { get; set; } = true;
        public int? CursoId { get; set; }  // mantido para compatibilidade com banco existente

        // IDs dos cursos que este coordenador gerencia — ex: "1,2,5"
        public string CursosIds { get; set; } = string.Empty;
    }
}