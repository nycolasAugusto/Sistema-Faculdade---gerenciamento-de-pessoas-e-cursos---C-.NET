using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiFaculdade.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarSenhaFuncionario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Senha",
                table: "Funcionarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Senha",
                table: "Funcionarios");
        }
    }
}
