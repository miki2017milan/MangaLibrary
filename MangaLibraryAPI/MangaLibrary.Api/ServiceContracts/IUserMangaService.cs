using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.ServiceContracts;

public interface IUserMangaService
{
    public Task<UserManga?> GetUserManga(Guid mangaId, Guid userId);
    public Task<UserManga?> AddMangaToUser(UserManga readingStatus);
    public Task<UserManga?> UpdateUserManga(UserManga readingStatus);
    public Task RemoveMangaFromUser(Guid mangaId, Guid userId);
    public Task<IEnumerable<UserMangaReadingStatus>?> GetMangasFromUser(Guid userId);
}