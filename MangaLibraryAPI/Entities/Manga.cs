using Microsoft.AspNetCore.Mvc.ModelBinding;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities;

public class Manga
{
    [BindNever]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("titleEnglish")] public required string TitleEnglish { get; set; }
    
    [BsonElement("titleNative")] public required string TitleNative { get; set; }

    [BsonElement("genres")] public required List<string?>? Genres { get; set; }

    [BsonElement("cover")] public required string Cover { get; set; }

    [BsonElement("bannerImage")] public required string BannerImage { get; set; }

    [BsonElement("description")] public required string Description { get; set; }

    [BsonElement("staff")] public required List<Dictionary<string, string>> Staff { get; set; }
}