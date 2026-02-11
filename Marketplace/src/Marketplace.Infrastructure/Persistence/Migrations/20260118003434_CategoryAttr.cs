using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CategoryAttr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CategoryAttributes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryAttributes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ListingAttributeValues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ListingId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryAttributeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    ListingId1 = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingAttributeValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListingAttributeValues_listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListingAttributeValues_listings_ListingId1",
                        column: x => x.ListingId1,
                        principalTable: "listings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CategoryAttributeOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryAttributeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CategoryAttributeId1 = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryAttributeOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryAttributeOptions_CategoryAttributes_CategoryAttribu~",
                        column: x => x.CategoryAttributeId,
                        principalTable: "CategoryAttributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryAttributeOptions_CategoryAttributes_CategoryAttrib~1",
                        column: x => x.CategoryAttributeId1,
                        principalTable: "CategoryAttributes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeOptions_CategoryAttributeId",
                table: "CategoryAttributeOptions",
                column: "CategoryAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryAttributeOptions_CategoryAttributeId1",
                table: "CategoryAttributeOptions",
                column: "CategoryAttributeId1");

            migrationBuilder.CreateIndex(
                name: "IX_ListingAttributeValues_ListingId",
                table: "ListingAttributeValues",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingAttributeValues_ListingId1",
                table: "ListingAttributeValues",
                column: "ListingId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryAttributeOptions");

            migrationBuilder.DropTable(
                name: "ListingAttributeValues");

            migrationBuilder.DropTable(
                name: "CategoryAttributes");
        }
    }
}
