using ApiFaculdade.Enums;

namespace ApiFaculdade.DTOS
{
    /// <summary>
    /// Corpo esperado no POST /api/alunos.
    /// Id e Matricula são gerados automaticamente pelo repositório.
    /// </summary>
    public class CriarAlunoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int CursoId { get; set; }
        public int Periodo { get; set; }
    }
}