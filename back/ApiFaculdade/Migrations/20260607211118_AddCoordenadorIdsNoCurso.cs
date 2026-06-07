using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordenadorIdsNoCurso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Funcionarios_Cursos_CursoId",
                table: "Funcionarios");

            migrationBuilder.DropIndex(
                name: "IX_Funcionarios_CursoId",
                table: "Funcionarios");

            migrationBuilder.AddColumn<string>(
                name: "CursosIds",
                table: "Funcionarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CoordenadorIds",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Funcionarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "CursosIds",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CursosIds",
                table: "Funcionarios");

            migrationBuilder.DropColumn(
                name: "CoordenadorIds",
                table: "Cursos");

            migrationBuilder.CreateIndex(
                name: "IX_Funcionarios_CursoId",
                table: "Funcionarios",
                column: "CursoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Funcionarios_Cursos_CursoId",
                table: "Funcionarios",
                column: "CursoId",
                principalTable: "Cursos",
                principalColumn: "Id");
        }
    }
}
