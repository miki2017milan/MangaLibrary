namespace MangaLibraryAPI.DTO;

public class MangaQuery : PagedRequest
{
    public string? Title { get; set; }
    public List<string>? Genres { get; set; }
    public List<string>? Tags { get; set; }
    public string? Format { get; set; }
    public bool IncludesAdultContent { get; set; }
    public string? CountryOfOrigin { get; set; }
}