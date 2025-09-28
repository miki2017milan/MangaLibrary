using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Services;

public class MongoDbService
{
    public MongoDbService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DbConnection");
        var mongoUrl = MongoUrl.Create(connectionString);
        var client = new MongoClient(mongoUrl);
        Database = client.GetDatabase(mongoUrl.DatabaseName);
    }

    public IMongoDatabase Database { get; }
}