using Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Services;

namespace CRUDTests;

public class MongoDbServiceTest
{
    [Fact]
    public async Task TestDbConnection()
    {
        var myConfiguration = new Dictionary<string, string?>
        {
            { "ConnectionStrings:DbConnection", "mongodb://localhost/aspnetdev" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration)
            .Build();

        var mangas = new MongoDbService(configuration).Mangas;

        try
        {
            await mangas.FindAsync(Builders<Manga>.Filter.Empty);
        }
        catch (TimeoutException)
        {
            Assert.Fail("Failed to connect to database");
        }
    }
}