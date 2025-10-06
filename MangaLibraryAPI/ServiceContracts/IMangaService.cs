using ServiceContracts.DTO;

namespace ServiceContracts;

public interface IMangaService
{
    /// <summary>
    /// Gets a manga from database with given id.
    /// </summary>
    /// <param name="id">Input ObjectId</param>
    /// <returns>Found manga or null</returns>
    Task<MangaResponse?> GetMangaById(string id);

    /// <summary>
    /// Gets mangas from database with given search word.
    /// </summary>
    /// <param name="genres">Genres the manga has to contain</param>
    /// <param name="searchWord">Search string</param>
    /// <returns>List of found mangas or null.</returns>
    Task<List<MangaSearchResponse>?> QueryMangas(List<string>? genres, string? searchWord);
}