using System.ComponentModel.DataAnnotations;

namespace Entities;

public class Manga
{
    [Key] public Guid Id { get; set; }
    [StringLength(256)] public required string Title { get; set; }
    [StringLength(256)] public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    [StringLength(256)] public string? Cover { get; set; }
    [StringLength(256)] public string? BannerImage { get; set; }
    [StringLength(1024)] public string? Description { get; set; }
    public List<Guid>? Staff { get; set; }
}