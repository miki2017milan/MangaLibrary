using System.ComponentModel.DataAnnotations;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class UserMangaRequest
{
    [Required] public required string Status { get; set; }
    public int? Rating { get; set; }

    public UserManga ToUserManga()
    {
        return new UserManga() { MangaId = Guid.Empty, UserId = Guid.Empty, Status = Status, Rating = Rating };
    }
}