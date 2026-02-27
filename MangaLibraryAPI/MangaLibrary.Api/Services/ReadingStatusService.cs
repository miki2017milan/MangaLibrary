using Dapper;
using MangaLibraryAPI.Database;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;

namespace MangaLibraryAPI.Services;

public class ReadingStatusService(IDbConnectionFactory connectionFactory) : IReadingStatusService
{
    public async Task<ReadingStatus?> AddReadingStatus(ReadingStatus readingStatus)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var rows = await connection.ExecuteAsync(
            """
            INSERT INTO reading_status(manga_id, user_id, status)
            VALUES (@MangaId, @UserId, @Status)
            """,
            readingStatus);

        if (rows == 0) return null;

        return readingStatus;
    }

    public async Task<ReadingStatus?> UpdateReadingStatus(ReadingStatus readingStatus)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var rows = await connection.ExecuteAsync(
            """
            UPDATE reading_status
            SET status = @Status
            WHERE manga_id = @MangaId and user_id = @UserId
            """,
            readingStatus);

        if (rows == 0) return null;

        return readingStatus;
    }

    public async Task DeleteReadingStatus(Guid mangaId, Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        await connection.ExecuteAsync("DELETE FROM reading_status where manga_id = @mangaId and user_id = @userId",
            new { mangaId, userId });
    }

    public async Task<ReadingStatus?> GetReadingStatus(Guid mangaId, Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var readingStatus = await connection.QueryFirstOrDefaultAsync<ReadingStatus>(
            "Select * from reading_status where manga_id = @mangaId and user_id = @userId",
            new { mangaId, userId });

        return readingStatus;
    }

    public async Task<IEnumerable<MangaReadingStatus>?> GetReadingStatusByUser(Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var mangas = await connection.QueryAsync<MangaReadingStatus>(
            """
            Select manga_id, title, cover, status
            from reading_status, mangas
            where user_id = @userId and id = manga_id
            """, new { userId });

        return mangas;
    }

    public async Task<IEnumerable<string>?> GetReadingStatusByManga(Guid mangaId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var stati = await connection.QueryAsync<string>(
            """
            Select status
            from reading_status
            where manga_id = @mangaId
            """, new { mangaId });

        return stati;
    }
}