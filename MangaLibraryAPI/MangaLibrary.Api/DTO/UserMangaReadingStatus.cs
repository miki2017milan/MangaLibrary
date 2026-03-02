namespace MangaLibraryAPI.DTO;

public class UserMangaReadingStatus
{
    public Guid MangaId { get; set; }
    public string Title { get; set; }
    public string cover { get; set; }
    public string Status { get; set; }
}