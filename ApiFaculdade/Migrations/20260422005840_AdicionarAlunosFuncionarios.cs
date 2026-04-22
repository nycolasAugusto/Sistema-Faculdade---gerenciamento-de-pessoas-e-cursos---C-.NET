using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarAlunosFuncionarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alunos_Cursos_cursoAlunoId",
                table: "Alunos");

            migrationBuilder.DropIndex(
                name: "IX_Alunos_cursoAlunoId",
                table: "Alunos");

            migrationBuilder.DropColumn(
                name: "Contato",
                table: "Alunos");

            migrationBuilder.RenameColumn(
                name: "periodoAtual",
                table: "Alunos",
                newName: "Periodo");

            migrationBuilder.RenameColumn(
                name: "cursoAlunoId",
                table: "Alunos",
                newName: "Curso");

            migrationBuilder.RenameColumn(
                name: "ListaDematerias",
                table: "Alunos",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "DataNascimento",
                table: "Alunos",
                newName: "DataMatricula");

            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Alunos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Funcionarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Matricula = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Cargo = table.Column<int>(type: "INTEGER", nullable: false),
                    Departamento = table.Column<string>(type: "TEXT", nullable: false),
                    DataAdmissao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Funcionarios", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Funcionarios");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Alunos");

            migrationBuilder.RenameColumn(
                name: "Periodo",
                table: "Alunos",
                newName: "periodoAtual");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Alunos",
                newName: "ListaDematerias");

            migrationBuilder.RenameColumn(
                name: "DataMatricula",
                table: "Alunos",
                newName: "DataNascimento");

            migrationBuilder.RenameColumn(
                name: "Curso",
                table: "Alunos",
                newName: "cursoAlunoId");

            migrationBuilder.AddColumn<string>(
                name: "Contato",
                table: "Alunos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_cursoAlunoId",
                table: "Alunos",
                column: "cursoAlunoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alunos_Cursos_cursoAlunoId",
                table: "Alunos",
                column: "cursoAlunoId",
                principalTable: "Cursos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
