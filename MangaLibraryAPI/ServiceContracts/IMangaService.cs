using ServiceContracts.DTO;

namespace ServiceContracts;

public interface IMangaService
{
    public Task<List<MangaResponse>> GetAllMangas();
    public Task<MangaResponse> GetMangaById(string id);
    public Task<List<MangaResponse>> GetMangasByTitle(string title);
}