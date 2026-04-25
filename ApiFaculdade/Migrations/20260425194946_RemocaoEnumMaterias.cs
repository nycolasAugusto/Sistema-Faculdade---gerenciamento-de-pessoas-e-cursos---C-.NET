using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class RemocaoEnumMaterias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Materias",
                table: "Cursos");

            migrationBuilder.AlterColumn<bool>(
                name: "Ativo",
                table: "Alunos",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "INTEGER");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Materias",
                table: "Cursos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<bool>(
                name: "Ativo",
                table: "Alunos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "INTEGER",
                oldNullable: true);
        }
    }
}
