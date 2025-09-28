using Microsoft.AspNetCore.Mvc.ModelBinding;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities;

public class Manga
{
    [BindNever]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")] public List<string?>? Titles { get; set; }

    [BsonElement("genres")] public List<string?>? Genres { get; set; }

    [BsonElement("cover")] public string? Cover { get; set; }

    [BsonElement("bannerImage")] public string? BannerImage { get; set; }

    [BsonElement("description")] public string? Description { get; set; }

    [BsonElement("staff")] public List<Dictionary<string, string>>? Staff { get; set; }
}