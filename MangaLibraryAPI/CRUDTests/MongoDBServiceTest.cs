using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
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

        var database = new MongoDbService(configuration).Database;

        try
        {
            await database.RunCommandAsync((Command<BsonDocument>)"{ping:1}");
        }
        catch (TimeoutException)
        {
            Assert.Fail("Failed to connect to database");
        }
    }
}