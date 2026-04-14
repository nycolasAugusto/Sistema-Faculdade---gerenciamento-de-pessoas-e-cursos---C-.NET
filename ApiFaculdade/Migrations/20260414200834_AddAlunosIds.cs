using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class AddAlunosIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlunosIds",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Campus",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Coordenadores",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataFim",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DataInicio",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Materias",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<int>(
                name: "Nome",
                table: "Cursos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TempoDoCursoEmMeses",
                table: "Cursos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlunosIds",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "Campus",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "Coordenadores",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "DataFim",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "DataInicio",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "Materias",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "Nome",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "TempoDoCursoEmMeses",
                table: "Cursos");
        }
    }
}
