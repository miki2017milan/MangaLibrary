using Entities;

namespace ServiceContracts.DTO;

public class MangaResponse
{
    public List<string?>? Titles { get; set; }
    public List<string?>? Genres { get; set; }
    public string? Cover { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public List<Dictionary<string, string>>? Staff { get; set; }
}

public static class MangaResponseExtensions
{
    public static MangaResponse ToMangaResponse(this Manga manga)
    {
        return new MangaResponse
        {
            Titles = manga.Titles,
            Genres = manga.Genres,
            Cover = manga.Cover,
            BannerImage = manga.BannerImage,
            Description = manga.Description,
            Staff = manga.Staff
        };
    }
}