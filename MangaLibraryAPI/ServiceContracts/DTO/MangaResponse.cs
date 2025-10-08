using Entities;

namespace ServiceContracts.DTO;

public class MangaResponse
{
    public Guid? Id { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    public string? Cover { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public List<Guid>? Staff { get; set; }
}

public static class MangaResponseExtensions
{
    public static MangaResponse ToMangaResponse(this Manga manga)
    {
        return new MangaResponse
        {
            Id = manga.Id,
            TitleEnglish = manga.Title,
            TitleNative = manga.TitleNative,
            Genres = manga.Genres,
            Cover = manga.Cover,
            BannerImage = manga.BannerImage,
            Description = manga.Description,
            Staff = manga.Staff
        };
    }
}