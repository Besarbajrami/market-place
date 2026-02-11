using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddListingReportsAndModeration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_listings_CreatedAt",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_Status_CreatedAt",
                table: "listings");

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "listings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "listings",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "listings",
                type: "character varying(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "listings",
                type: "character varying(6000)",
                maxLength: 6000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "HiddenAt",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HiddenReason",
                table: "listings",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationCity",
                table: "listings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LocationRegion",
                table: "listings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ModerationStatus",
                table: "listings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReportCount",
                table: "listings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SoldAt",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "listings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "favorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ListingId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favorites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "listing_images",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ListingId = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    IsCover = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_listing_images", x => x.Id);
                    table.ForeignKey(
                        name: "FK_listing_images_listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "listing_reports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ListingId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReporterUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Reason = table.Column<int>(type: "integer", nullable: false),
                    Details = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_listing_reports", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_listings_CategoryId",
                table: "listings",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_listings_LocationCity",
                table: "listings",
                column: "LocationCity");

            migrationBuilder.CreateIndex(
                name: "IX_listings_LocationRegion",
                table: "listings",
                column: "LocationRegion");

            migrationBuilder.CreateIndex(
                name: "IX_listings_ModerationStatus",
                table: "listings",
                column: "ModerationStatus");

            migrationBuilder.CreateIndex(
                name: "IX_listings_Status_PublishedAt",
                table: "listings",
                columns: new[] { "Status", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_favorites_ListingId",
                table: "favorites",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_favorites_UserId",
                table: "favorites",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_favorites_UserId_ListingId",
                table: "favorites",
                columns: new[] { "UserId", "ListingId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_listing_images_ListingId_IsCover",
                table: "listing_images",
                columns: new[] { "ListingId", "IsCover" });

            migrationBuilder.CreateIndex(
                name: "IX_listing_images_ListingId_SortOrder",
                table: "listing_images",
                columns: new[] { "ListingId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_listing_reports_ListingId",
                table: "listing_reports",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_listing_reports_ListingId_ReporterUserId",
                table: "listing_reports",
                columns: new[] { "ListingId", "ReporterUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_listing_reports_ReporterUserId",
                table: "listing_reports",
                column: "ReporterUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "favorites");

            migrationBuilder.DropTable(
                name: "listing_images");

            migrationBuilder.DropTable(
                name: "listing_reports");

            migrationBuilder.DropIndex(
                name: "IX_listings_CategoryId",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_LocationCity",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_LocationRegion",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_ModerationStatus",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_Status_PublishedAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "Condition",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "HiddenAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "HiddenReason",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "LocationCity",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "LocationRegion",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "ModerationStatus",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "ReportCount",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "SoldAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "listings");

            migrationBuilder.CreateIndex(
                name: "IX_listings_CreatedAt",
                table: "listings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_listings_Status_CreatedAt",
                table: "listings",
                columns: new[] { "Status", "CreatedAt" });
        }
    }
}
