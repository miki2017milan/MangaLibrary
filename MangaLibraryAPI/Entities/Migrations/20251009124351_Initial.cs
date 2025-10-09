using System;
using System.Collections.Generic;
using Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Entities.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "mangas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    titleNative = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    genres = table.Column<List<string>>(type: "text[]", nullable: true),
                    tags = table.Column<List<string>>(type: "text[]", nullable: true),
                    format = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    releaseYear = table.Column<int>(type: "integer", nullable: true),
                    releaseMonth = table.Column<int>(type: "integer", nullable: true),
                    releaseDay = table.Column<int>(type: "integer", nullable: true),
                    adultContent = table.Column<bool>(type: "boolean", nullable: true),
                    countryOfOrigin = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                    cover = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    banner = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    staff = table.Column<List<MangaStaff>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mangas", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mangas");
        }
    }
}
