namespace MangaLibraryAPI.Exceptions;

public class MangaNotFoundException(Guid id) : Exception($"Manga with id: '{id.ToString()}' was not found'.");