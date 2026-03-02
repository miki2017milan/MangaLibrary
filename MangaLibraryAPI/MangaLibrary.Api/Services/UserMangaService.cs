using Dapper;
using MangaLibraryAPI.Database;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Npgsql;

namespace MangaLibraryAPI.Services;

public class UserMangaService(IDbConnectionFactory connectionFactory) : IUserMangaService
{
    public async Task<UserManga?> GetUserManga(Guid mangaId, Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();


        var manga = await connection.QueryFirstOrDefaultAsync<UserManga>(
            """
            Select * from user_manga
            where user_id = @userId and manga_id = @mangaId
            """,
            new { userId, mangaId });

        return manga;
    }

    public async Task<UserManga?> AddMangaToUser(UserManga readingStatus)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        try
        {
            var rows = await connection.ExecuteAsync(
                """
                INSERT INTO user_manga(manga_id, user_id, status, rating)
                VALUES (@MangaId, @UserId, @Status, @Rating)
                """,
                readingStatus);
        }
        catch (PostgresException ex) when (ex.SqlState == "23505")
        {
            return null;
        }

        return readingStatus;
    }

    public async Task<UserManga?> UpdateUserManga(UserManga readingStatus)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var rows = 0;
        if (string.IsNullOrEmpty(readingStatus.Status))
        {
            rows = await connection.ExecuteAsync(
                """
                UPDATE user_manga
                SET rating = @Rating
                WHERE manga_id = @MangaId and user_id = @UserId
                """,
                readingStatus);
        }
        else
        {
            rows = await connection.ExecuteAsync(
                """
                UPDATE user_manga
                SET status = @Status, rating = @Rating
                WHERE manga_id = @MangaId and user_id = @UserId
                """,
                readingStatus);
        }

        return rows == 0 ? null : readingStatus;
    }

    public async Task RemoveMangaFromUser(Guid mangaId, Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        await connection.ExecuteAsync("DELETE FROM user_manga where manga_id = @mangaId and user_id = @userId",
            new { mangaId, userId });
    }

    public async Task<IEnumerable<UserMangaReadingStatus>?> GetMangasFromUser(Guid userId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var mangas = await connection.QueryAsync<UserMangaReadingStatus>(
            """
            Select manga_id, title, cover, status
            from user_manga, mangas
            where user_id = @userId and id = manga_id
            """, new { userId });

        return mangas;
    }
}