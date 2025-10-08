using System.ComponentModel.DataAnnotations;
using Entities;

namespace ServiceContracts.DTO;

public class MangaCreateRequest
{
    [Required] public required string Title { get; set; }
    public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    public string? Cover { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public List<Guid>? Staff { get; set; }

    public Manga ToManga()
    {
        return new Manga()
        {
            Title = Title, TitleNative = TitleNative, Genres = Genres, Cover = Cover, BannerImage = BannerImage,
            Description = Description, Staff = Staff
        };
    }
}