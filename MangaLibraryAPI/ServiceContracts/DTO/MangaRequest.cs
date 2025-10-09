using System.ComponentModel.DataAnnotations;
using Entities;
using Microsoft.Extensions.Options;

namespace ServiceContracts.DTO;

public class MangaRequest
{
    [Required] public string? Title { get; set; }
    public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    public List<string>? Tags { get; set; }
    public string? Format { get; set; }
    public int? ReleaseYear { get; set; }
    public int? ReleaseMonth { get; set; }
    public int? ReleaseDay { get; set; }
    public bool? AdultContent { get; set; }
    public string? CountryOfOrigin { get; set; }
    [Url] public string? Cover { get; set; }
    [Url] public string? BannerImage { get; set; }
    public string? Description { get; set; }
    [ValidateEnumeratedItems] public List<MangaStaff>? Staff { get; set; }

    public Manga ToManga()
    {
        return new Manga()
        {
            Title = Title!, TitleNative = TitleNative, Genres = Genres, Tags = Tags, Format = Format,
            ReleaseYear = ReleaseYear, ReleaseMonth = ReleaseMonth, ReleaseDay = ReleaseDay,
            AdultContent = AdultContent, CountryOfOrigin = CountryOfOrigin, Cover = Cover,
            BannerImage = BannerImage,
            Description = Description, Staff = Staff
        };
    }
}