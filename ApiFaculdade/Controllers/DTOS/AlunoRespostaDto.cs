namespace ApiFaculdade.DTOS
{
    public class AlunoRespostaDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Matricula { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Periodo { get; set; }
        public bool Ativo { get; set; }
        public string NomeCurso { get; set; } = string.Empty;
        public List<string> NomesDasTurmas { get; set; } = new List<string>();
    }
}