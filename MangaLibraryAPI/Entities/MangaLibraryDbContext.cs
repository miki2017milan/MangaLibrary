using Microsoft.EntityFrameworkCore;

namespace Entities;

public class MangaLibraryDbContext : DbContext
{
    public DbSet<Manga> Mangas { get; set; }
    public DbSet<MangaStaff> MangaStaffs { get; set; }

    public MangaLibraryDbContext(DbContextOptions<MangaLibraryDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Manga>().ToTable("Manga");
        modelBuilder.Entity<MangaStaff>().ToTable("MangaStaff");
    }
}