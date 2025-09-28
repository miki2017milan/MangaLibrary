using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using ServiceContracts;
using Services;

namespace CRUDTests;

public class MangaServiceTest
{
    private readonly IMangaService _mangaService;

    public MangaServiceTest()
    {
        var myConfiguration = new Dictionary<string, string?>
        {
            { "ConnectionStrings:DbConnection", "mongodb://localhost/aspnetdev" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration)
            .Build();

        var databaseService = new MongoDbService(configuration);
        _mangaService = new MangaService(databaseService);

        // Ping MongoDb server to check if it is running
        try
        {
            databaseService.Database.RunCommand((Command<BsonDocument>)"{ping:1}");
        }
        catch (TimeoutException)
        {
            Assert.Fail("Failed to connect to database");
        }
    }

    [Fact]
    public async Task TestGetAllManga()
    {
        var mangas = await _mangaService.GetAllMangas();
        Assert.NotEmpty(mangas);
    }

    [Fact]
    public async Task GetMangaById_NullId()
    {
        string? id = null;
        await Assert.ThrowsAsync<ArgumentNullException>(() => _mangaService.GetMangaById(id!));
    }

    [Fact]
    public async Task GetMangaById_InvalidId()
    {
        const string id = "invalid object id";
        await Assert.ThrowsAsync<ArgumentException>(() => _mangaService.GetMangaById(id));
    }
}