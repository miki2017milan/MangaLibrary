namespace MangaLibraryAPI.Exceptions;

public class DuplicateUserManga(Guid mangaId, Guid userId)
    : Exception($"The user: '{userId.ToString()}' already has the manga: '{mangaId.ToString()}'")
{
}