using ServiceContracts.DTO;

namespace ServiceContracts;

public interface IMangaService
{
    Task<MangaResponse?> GetMangaById(string id);
    Task<MangaResponse?> CreateManga(MangaCreateRequest mangaCreateRequest);
    Task<MangaResponse?> UpdateManga(MangaCreateRequest mangaCreateRequest);
    Task DeleteManga(string id);
    Task<List<MangaResponse>?> QueryMangas(List<string>? genres, string? searchWord);
}