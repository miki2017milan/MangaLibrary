using Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaService(MongoDbService dbService) : IMangaService
{
    private readonly IMongoCollection<Manga> _mangas = dbService.Database.GetCollection<Manga>("mangas");

    public async Task<List<MangaResponse>> GetAllMangas()
    {
        var mangas = await _mangas.Find(manga => true).ToListAsync();
        return mangas.Select(manga => manga.ToMangaResponse()).ToList();
    }

    public async Task<MangaResponse> GetMangaById(string id)
    {
        if (string.IsNullOrEmpty(id)) throw new ArgumentNullException(nameof(id));
        if (!ObjectId.TryParse(id, out _)) throw new ArgumentException("Invalid manga id");

        var manga = await _mangas.Find(manga => manga.Id == id).FirstOrDefaultAsync();
        return manga.ToMangaResponse();
    }

    public async Task<List<MangaResponse>> GetMangasByTitle(string title)
    {
        var mangas = await _mangas.Find(manga =>
                manga.Titles!.Where(ele => ele != null && ele.ToLower().Contains(title.ToLower())).ToList().Any())
            .ToListAsync();
        return mangas.Select(manga => manga.ToMangaResponse()).ToList();
    }
}