using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class UserMangaUpdate
{
    public string? Status { get; set; }
    public int? Rating { get; set; }

    public UserManga ToUserManga()
    {
        return new UserManga() { MangaId = Guid.Empty, UserId = Guid.Empty, Status = Status ?? "", Rating = Rating };
    }
}