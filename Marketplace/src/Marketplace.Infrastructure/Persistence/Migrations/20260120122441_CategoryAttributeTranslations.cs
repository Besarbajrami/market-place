using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CategoryAttributeTranslations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CategoryAttributeOptionTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryAttributeOptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Culture = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    Label = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryAttributeOptionTranslations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryAttributeTranslations",
                columns: table => new
                {
                    CategoryAttributeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Culture = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    Label = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CategoryAttributeId1 = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryAttributeOptionId = table.Column<Guid>(type: "uuid", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryAttributeTranslations", x => x.CategoryAttributeId);
                    table.ForeignKey(
                        name: "FK_CategoryAttributeTranslations_CategoryAttributeOptions_Cate~",
                        column: x => x.CategoryAttributeOptionId,
                        principalTable: "CategoryAttributeOptions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CategoryAttributeTranslations_CategoryAttributes_CategoryAt~",
                        column: x => x.CategoryAttributeId1,
                        principalTable: "CategoryAttributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeOptionTranslations_CategoryAttributeOption~",
                table: "CategoryAttributeOptionTranslations",
                columns: new[] { "CategoryAttributeOptionId", "Culture" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeTranslations_CategoryAttributeId_Culture",
                table: "CategoryAttributeTranslations",
                columns: new[] { "CategoryAttributeId", "Culture" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeTranslations_CategoryAttributeId1",
                table: "CategoryAttributeTranslations",
                column: "CategoryAttributeId1");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeTranslations_CategoryAttributeOptionId",
                table: "CategoryAttributeTranslations",
                column: "CategoryAttributeOptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryAttributeOptionTranslations");

            migrationBuilder.DropTable(
                name: "CategoryAttributeTranslations");
        }
    }
}
