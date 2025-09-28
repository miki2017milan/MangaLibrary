using Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaService(MongoDbService dbService) : IMangaService
{
    private readonly IMongoCollection<Manga> _mangas = dbService.Database.GetCollection<Manga>("mangas");
    
    public async Task<MangaResponse?> GetMangaById(string? id)
    {
        if (string.IsNullOrEmpty(id)) throw new ArgumentNullException(nameof(id));
        if (!ObjectId.TryParse(id, out _)) throw new ArgumentException("Invalid id. Must be valid ObjectId.");

        var manga = await _mangas.Find(manga => manga.Id == id).FirstOrDefaultAsync();
        
        return manga?.ToMangaResponse();
    }

    public async Task<List<MangaSearchResponse>?> SearchMangasWithTitle(string? searchWord)
    {
        if (string.IsNullOrEmpty(searchWord)) throw new ArgumentNullException(nameof(searchWord));

        // search for exact matches
        var textFilterExact = Builders<Manga>.Filter.Text("\"" + searchWord + "\"");
        var mangas = await _mangas.Find(textFilterExact).Limit(10).ToListAsync();
        
        if(mangas.Count != 0) return mangas.Select(manga => manga.ToMangaSearchResponse()).ToList();
        
        // search for word matches
        var textFilter = Builders<Manga>.Filter.Text(searchWord);
        mangas = await _mangas.Find(textFilter).Limit(10).ToListAsync();

        if (mangas.Count != 0) return mangas.Select(manga => manga.ToMangaSearchResponse()).ToList();
        
        // search for if titles contains search word
        var containsFilter =  Builders<Manga>.Filter.Regex("titleEnglish", new BsonRegularExpression($".*{searchWord}.*", "i"));
        mangas = await _mangas.Find(containsFilter).Limit(10).ToListAsync();
        
        if (mangas.Count == 0) return null;
        
        return mangas.Select(manga => manga.ToMangaSearchResponse()).ToList();
    }
}