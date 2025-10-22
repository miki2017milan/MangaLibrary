using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MangaLibraryAPI.Entities;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>(options)
{
    public DbSet<Manga> Mangas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Manga>(entity =>
        {
            entity.ToTable("mangas");

            // Explicitly configure Staff as JSONB
            entity.Property(e => e.Staff)
                .HasColumnType("jsonb");
        });
    }
}