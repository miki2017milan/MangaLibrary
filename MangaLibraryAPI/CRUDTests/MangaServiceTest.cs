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

    #region GetMangaById
    
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
    
    [Fact]
    public async Task GetMangaById_ValidIdAndFound()
    {
        const string id = "68d9845c347cd7e2f299a9a7";
        var manga = await _mangaService.GetMangaById(id);
        Assert.NotNull(manga);
    }
    
    [Fact]
    public async Task GetMangaById_ValidIdAndNotFound()
    {
        const string id = "68d721b67539e15774909109";
        var manga = await _mangaService.GetMangaById(id);
        Assert.Null(manga);
    }
    
    #endregion
    
    #region GetMangaByTitle
    
    [Fact]
    public async Task GetMangaByTitle_NullSearchWord()
    {
        string? searchWord = null;
        await Assert.ThrowsAsync<ArgumentNullException>(() => _mangaService.SearchMangasWithTitle(searchWord!));
    }
    
    [Fact]
    public async Task GetMangaByTitle_NoResult()
    {
        string? searchWord = "asadsdasdasdasdasdasdwawfawfas";
        Assert.Null(await _mangaService.SearchMangasWithTitle(searchWord));
    }
    
    [Fact]
    public async Task GetMangaByTitle_WithResult()
    {
        string? searchWord = "naruto";
        Assert.NotNull(await _mangaService.SearchMangasWithTitle(searchWord));
    }
    
    #endregion
    
}