using Entities;
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
        var database = client.GetDatabase(mongoUrl.DatabaseName);

        Mangas = database.GetCollection<Manga>("mangas");
    }

    public IMongoCollection<Manga> Mangas { get; }
}