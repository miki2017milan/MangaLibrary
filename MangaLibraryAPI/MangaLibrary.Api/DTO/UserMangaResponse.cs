using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class UserMangaResponse
{
    public required string Status { get; set; }
    public int? Rating { get; set; }
}

public static class UserMangaExtension
{
    public static UserMangaResponse ToUserMangaResponse(this UserManga userManga)
    {
        return new UserMangaResponse()
        {
            Status = userManga.Status,
            Rating = userManga.Rating
        };
    }
}