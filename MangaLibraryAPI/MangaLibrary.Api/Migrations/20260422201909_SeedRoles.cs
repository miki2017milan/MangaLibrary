using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MangaLibraryAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: ["Id", "Name", "NormalizedName", "ConcurrencyStamp"],
                values: new object[]
                {
                    Guid.NewGuid().ToString(), "Admin", "ADMIN", Guid.NewGuid().ToString(),
                }
            );
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: ["Id", "Name", "NormalizedName", "ConcurrencyStamp"],
                values: new object[]
                {
                    Guid.NewGuid().ToString(), "User", "USER", Guid.NewGuid().ToString(),
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "NormalizedName",
                keyValue: "ADMIN"
            );

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "NormalizedName",
                keyValue: "USER"
            );
        }
    }
}
