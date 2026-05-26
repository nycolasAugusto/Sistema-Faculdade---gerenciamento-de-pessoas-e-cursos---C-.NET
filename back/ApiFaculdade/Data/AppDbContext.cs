using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Models;

namespace ApiFaculdade.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Funcionario> Funcionarios {get; set;}
        public DbSet<Turma> Turmas { get; set; }
        public DbSet<Curso> Cursos { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Quando o banco for criado, ele já vai nascer com esse usuário!
            modelBuilder.Entity<Funcionario>().HasData(
                new Funcionario
                {
                    Id = 1, // ID fixo 1
                    Nome = "Administrador do Sistema",
                    Email = "admin@faculdade.com",
                    Senha = "123",
                    Cargo = CargoFuncionario.Gestor, // Esse é o seu Admin!
                    Matricula = "ADMIN-000",
                    Departamento = "TI",
                    DataAdmissao = new DateTime(2026, 1, 1),
                    Ativo = true
                }
            );
        }
    }
}