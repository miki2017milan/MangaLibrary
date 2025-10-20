using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace MangaLibraryAPI.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    [StringLength(32)] public required string DisplayName { get; set; }
}