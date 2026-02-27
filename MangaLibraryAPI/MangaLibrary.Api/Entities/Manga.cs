using System.Text.Json.Serialization;

namespace MangaLibraryAPI.Entities;

public class Manga
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? TitleNative { get; set; }
    public String[]? Genres { get; set; }
    public String[]? Tags { get; set; }
    public string? Format { get; set; }
    public int? ReleaseYear { get; set; }
    public int? ReleaseMonth { get; set; }
    public int? ReleaseDay { get; set; }
    public bool? AdultContent { get; set; }
    public string? CountryOfOrigin { get; set; }
    public string? Cover { get; set; }
    public string? Banner { get; set; }
    public string? Description { get; set; }
    public List<MangaStaff>? Staff { get; set; }
}

public class MangaStaff
{
    [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;

    [JsonPropertyName("role")] public string Role { get; set; } = string.Empty;
}