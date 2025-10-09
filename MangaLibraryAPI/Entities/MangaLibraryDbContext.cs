using Microsoft.EntityFrameworkCore;

namespace Entities;

public class MangaLibraryDbContext(DbContextOptions<MangaLibraryDbContext> options) : DbContext(options)
{
    public DbSet<Manga> Mangas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Manga>().ToTable("mangas");
    }
}