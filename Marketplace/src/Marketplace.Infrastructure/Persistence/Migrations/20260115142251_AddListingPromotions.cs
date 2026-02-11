using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddListingPromotions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BumpedAt",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FeaturedUntil",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UrgentUntil",
                table: "listings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_listings_BumpedAt",
                table: "listings",
                column: "BumpedAt");

            migrationBuilder.CreateIndex(
                name: "IX_listings_FeaturedUntil",
                table: "listings",
                column: "FeaturedUntil");

            migrationBuilder.CreateIndex(
                name: "IX_listings_UrgentUntil",
                table: "listings",
                column: "UrgentUntil");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_listings_BumpedAt",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_FeaturedUntil",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_UrgentUntil",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "BumpedAt",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "FeaturedUntil",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "UrgentUntil",
                table: "listings");
        }
    }
}
