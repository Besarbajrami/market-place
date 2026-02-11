using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class OptionChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryAttributeOptions_CategoryAttributes_CategoryAttrib~1",
                table: "CategoryAttributeOptions");

            migrationBuilder.DropIndex(
                name: "IX_CategoryAttributeOptions_CategoryAttributeId1",
                table: "CategoryAttributeOptions");

            migrationBuilder.DropColumn(
                name: "CategoryAttributeId1",
                table: "CategoryAttributeOptions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryAttributeId1",
                table: "CategoryAttributeOptions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeOptions_CategoryAttributeId1",
                table: "CategoryAttributeOptions",
                column: "CategoryAttributeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryAttributeOptions_CategoryAttributes_CategoryAttrib~1",
                table: "CategoryAttributeOptions",
                column: "CategoryAttributeId1",
                principalTable: "CategoryAttributes",
                principalColumn: "Id");
        }
    }
}
