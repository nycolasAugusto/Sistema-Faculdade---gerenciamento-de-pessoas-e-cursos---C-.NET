using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class InserirAdminPeloContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Funcionarios",
                columns: new[] { "Id", "Ativo", "Cargo", "CursoId", "DataAdmissao", "Departamento", "Email", "Matricula", "Nome", "Senha" },
                values: new object[] { 1, true, 2, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "TI", "admin@faculdade.com", "ADMIN-000", "Administrador do Sistema", "123" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Funcionarios",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
