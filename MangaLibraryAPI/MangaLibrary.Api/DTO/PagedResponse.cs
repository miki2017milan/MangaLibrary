namespace MangaLibraryAPI.DTO;

public class PagedResponse<T>
{
    public required IEnumerable<T> Content { get; set; }
    public required int Total { get; set; }
    public required int Page { get; set; }
    public required int PageSize { get; set; }
    public bool HasNext => Total > Page;
    public bool HasPrevious => Page > 1;
}