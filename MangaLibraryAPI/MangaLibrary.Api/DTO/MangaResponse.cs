using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class MangaResponse
{
    public Guid? Id { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    public List<string>? Tags { get; set; }
    public string? Format { get; set; }
    public int? ReleaseYear { get; set; }
    public int? ReleaseMonth { get; set; }
    public int? ReleaseDay { get; set; }
    public bool? AdultContent { get; set; }
    public string? CountryOfOrigin { get; set; }
    public string? Cover { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public List<MangaStaff>? Staff { get; set; }
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
            Tags = manga.Tags,
            Format = manga.Format,
            ReleaseYear = manga.ReleaseYear,
            ReleaseMonth = manga.ReleaseMonth,
            ReleaseDay = manga.ReleaseDay,
            AdultContent = manga.AdultContent,
            CountryOfOrigin = manga.CountryOfOrigin,
            Cover = manga.Cover,
            BannerImage = manga.Banner,
            Description = manga.Description,
            Staff = manga.Staff
        };
    }
}