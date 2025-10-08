using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaService() : IMangaService
{
    public Task<MangaResponse?> GetMangaById(string id)
    {
        throw new NotImplementedException();
    }

    public Task<MangaResponse?> CreateManga(MangaCreateRequest mangaCreateRequest)
    {
        throw new NotImplementedException();
    }

    public Task<MangaResponse?> UpdateManga(MangaCreateRequest mangaCreateRequest)
    {
        throw new NotImplementedException();
    }

    public Task DeleteManga(string id)
    {
        throw new NotImplementedException();
    }

    public Task<List<MangaResponse>?> QueryMangas(List<string>? genres, string? searchWord)
    {
        throw new NotImplementedException();
    }
}