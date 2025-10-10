using MangaLibraryAPI.DTO;

namespace MangaLibraryAPI.ServiceContracts;

public interface IMangaService
{
    Task<MangaResponse?> GetMangaById(Guid id);
    Task<MangaResponse> CreateManga(MangaRequest mangaRequest);
    Task CreateMangaFromList(List<MangaRequest> mangaRequest);
    Task<MangaResponse?> UpdateManga(Guid? id, MangaRequest mangaRequest);
    Task DeleteManga(Guid id);
    Task<List<MangaResponse>?> QueryMangas(List<string>? genres, string? searchWord);
}