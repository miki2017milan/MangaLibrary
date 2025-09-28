using Entities;

namespace ServiceContracts.DTO;

public class MangaSearchResponse
{
    public string? Id { get; set; }
    public string? TitleEnglish { get; set; }
    public List<string?>? Genres { get; set; }
    public string? Cover { get; set; }
}

public static class MangaSearchResponseExtensions
{
    public static MangaSearchResponse ToMangaSearchResponse(this Manga manga)
    {
        return new MangaSearchResponse
        {
            Id = manga.Id,
            TitleEnglish = manga.TitleEnglish,
            Genres = manga.Genres,
            Cover = manga.Cover,
        };
    }
}