using System.Text.Json.Serialization;


namespace ApiFaculdade.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Cursos
{
    Tecnologia,
    Engenharia,
    Saude,
    Administracao,
    Direito,
    Artes
}
}