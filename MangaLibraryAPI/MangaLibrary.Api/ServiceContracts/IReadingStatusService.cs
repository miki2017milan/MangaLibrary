using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.ServiceContracts;

public interface IReadingStatusService
{
    public Task<ReadingStatus?> AddReadingStatus(ReadingStatus readingStatus);
    public Task<ReadingStatus?> UpdateReadingStatus(ReadingStatus readingStatus);
    public Task DeleteReadingStatus(Guid mangaId, Guid userId);
    public Task<ReadingStatus?> GetReadingStatus(Guid mangaId, Guid userId);
    public Task<IEnumerable<MangaReadingStatus>?> GetReadingStatusByUser(Guid userId);
    public Task<IEnumerable<string>?> GetReadingStatusByManga(Guid mangaId);
}