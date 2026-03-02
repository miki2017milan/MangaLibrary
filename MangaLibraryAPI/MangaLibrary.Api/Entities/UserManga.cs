namespace MangaLibraryAPI.Entities;

public class UserManga
{
    public required Guid MangaId { get; set; }
    public required Guid UserId { get; set; }
    public required string Status { get; set; }
    public int? Rating { get; set; }
}