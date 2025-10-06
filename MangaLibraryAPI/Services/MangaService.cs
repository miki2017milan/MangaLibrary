using Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaService(MongoDbService dbService) : IMangaService
{
    private readonly IMongoCollection<Manga> _mangas = dbService.Mangas;

    public async Task<MangaResponse?> GetMangaById(string id)
    {
        var manga = await _mangas.Find(manga => manga.Id == id).FirstOrDefaultAsync();

        return manga?.ToMangaResponse();
    }

    private async Task<List<MangaSearchResponse>?> GetFilteredMangas(FilterDefinition<Manga> filter,
        FilterDefinition<Manga> genreFilter)
    {
        var mangas = await _mangas.Find(Builders<Manga>.Filter.And(filter, genreFilter)).Limit(10).ToListAsync();

        return mangas.Count != 0 ? mangas.Select(manga => manga.ToMangaSearchResponse()).ToList() : null;
    }

    public async Task<List<MangaSearchResponse>?> QueryMangas(List<string>? genres, string? searchWord)
    {
        var genreFilter = Builders<Manga>.Filter.Empty;
        if (genres != null && genres.Count != 0)
        {
            genreFilter = Builders<Manga>.Filter.All(manga => manga.Genres, genres);
        }

        if (string.IsNullOrEmpty(searchWord))
        {
            var defaultMangas = await _mangas.Find(genreFilter).Limit(10).ToListAsync();
            return defaultMangas.Count == 0
                ? null
                : defaultMangas.Select(manga => manga.ToMangaSearchResponse()).ToList();
        }

        // search for exact matches
        var textFilterExact = Builders<Manga>.Filter.Text("\"" + searchWord + "\"");
        var mangas = await GetFilteredMangas(textFilterExact, genreFilter);
        if (mangas != null) return mangas;

        // search for word matches
        var textFilter = Builders<Manga>.Filter.Text(searchWord);
        mangas = await GetFilteredMangas(textFilter, genreFilter);
        if (mangas != null) return mangas;

        // search for if titles contains search word
        var containsFilter =
            Builders<Manga>.Filter.Regex("titleEnglish", new BsonRegularExpression($".*{searchWord}.*", "i"));
        mangas = await GetFilteredMangas(containsFilter, genreFilter);

        return mangas ?? null;
    }
}