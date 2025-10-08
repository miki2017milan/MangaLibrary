namespace ServiceContracts.DTO;

public class MangaUpdateRequest
{
    public string? Title { get; set; }
    public string? TitleNative { get; set; }
    public List<string>? Genres { get; set; }
    public string? Cover { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public List<Guid>? Staff { get; set; }
}