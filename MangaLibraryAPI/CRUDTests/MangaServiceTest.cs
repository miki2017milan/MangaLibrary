using Microsoft.Extensions.Configuration;
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

    // #region GetMangaByTitle
    //
    // [Fact]
    // public async Task QueryMangas_NullSearchWord()
    // {
    //     string? searchWord = null;
    //     await Assert.ThrowsAsync<ArgumentNullException>(() => _mangaService.QueryMangas(searchWord!));
    // }
    //
    // [Fact]
    // public async Task QueryMangas_NoResult()
    // {
    //     string? searchWord = "asadsdasdasdasdasdasdwawfawfas";
    //     Assert.Null(await _mangaService.QueryMangas(searchWord));
    // }
    //
    // [Fact]
    // public async Task QueryMangas_WithResult()
    // {
    //     string? searchWord = "naruto";
    //     Assert.NotNull(await _mangaService.QueryMangas(searchWord));
    // }
    //
    // #endregion
}