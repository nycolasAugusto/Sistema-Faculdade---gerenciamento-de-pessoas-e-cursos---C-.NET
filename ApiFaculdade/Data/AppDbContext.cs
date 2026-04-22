using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Models;

namespace ApiFaculdade.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Funcionario> Funcionarios {get; set;}
        public DbSet<Professor> Professores { get; set; }
        public DbSet<Coordenador> Coordenadores { get; set; }
        public DbSet<Turma> Turmas { get; set; }
        public DbSet<Curso> Cursos { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}