using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangaLibraryAPI.Entities;

public class Manga
{
    [Key, Column(name: "id")] public Guid Id { get; set; }

    [StringLength(256), Column(name: "title")]
    public required string Title { get; set; }

    [StringLength(256), Column(name: "titleNative")]
    public string? TitleNative { get; set; }

    [Column(name: "genres")] public List<string>? Genres { get; set; }

    [Column(name: "tags")] public List<string>? Tags { get; set; }

    [StringLength(8), Column(name: "format")]
    public string? Format { get; set; }

    [Column(name: "releaseYear")] public int? ReleaseYear { get; set; }

    [Column(name: "releaseMonth")] public int? ReleaseMonth { get; set; }

    [Column(name: "releaseDay")] public int? ReleaseDay { get; set; }

    [Column(name: "adultContent")] public bool? AdultContent { get; set; }

    [StringLength(2), Column(name: "countryOfOrigin")]
    public string? CountryOfOrigin { get; set; }

    [StringLength(256), Column(name: "cover")]
    public string? Cover { get; set; }

    [StringLength(256), Column(name: "banner")]
    public string? Banner { get; set; }

    [StringLength(65536), Column(name: "description")]
    public string? Description { get; set; }

    [Column(name: "staff", TypeName = "jsonb")]
    public List<MangaStaff>? Staff { get; set; }
}

public struct MangaStaff
{
    [StringLength(256), Required] public string Name { get; set; }
    [StringLength(256)] public string Role { get; set; }
}