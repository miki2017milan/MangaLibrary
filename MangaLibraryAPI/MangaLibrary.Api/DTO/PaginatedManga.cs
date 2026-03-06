using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class PaginatedManga : Manga
{
    public int TotalCount { get; set; }
}