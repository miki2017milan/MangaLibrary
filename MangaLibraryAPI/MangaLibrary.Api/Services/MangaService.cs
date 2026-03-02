using Dapper;
using MangaLibraryAPI.Database;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;

namespace MangaLibraryAPI.Services;

public class MangaService(IDbConnectionFactory connectionFactory) : IMangaService
{
    public async Task<MangaResponse?> GetMangaById(Guid id)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();
        var manga = await connection.QueryFirstOrDefaultAsync<Manga>("SELECT * FROM mangas WHERE id = @id", new { id });

        return manga?.ToMangaResponse();
    }

    public async Task<MangaResponse?> CreateManga(MangaRequest mangaRequest)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var guid = Guid.NewGuid();
        var rows = await connection.ExecuteAsync(
            """
            INSERT INTO mangas (id, title, title_native, genres, tags, format, release_year, release_month, release_day, adult_content, country_of_origin, cover, banner, description, staff) 
            VALUES (@Id, @Title, @TitleNative, @Genres, @Tags, @Format::manga_format, @ReleaseYear, @ReleaseMonth, @ReleaseDay, @AdultContent, @CountryOfOrigin, @Cover, @Banner, @Description, @Staff::jsonb)
            """,
            new
            {
                Id = guid,
                mangaRequest.Title,
                mangaRequest.TitleNative,
                mangaRequest.Genres,
                mangaRequest.Tags,
                mangaRequest.Format,
                mangaRequest.ReleaseYear,
                mangaRequest.ReleaseMonth,
                mangaRequest.ReleaseDay,
                mangaRequest.AdultContent,
                mangaRequest.CountryOfOrigin,
                mangaRequest.Cover,
                mangaRequest.Banner,
                mangaRequest.Description,
                mangaRequest.Staff
            });

        if (rows == 0) return null;

        var manga = mangaRequest.ToManga();
        manga.Id = guid;
        return manga.ToMangaResponse();
    }

    public async Task<MangaResponse?> UpdateManga(Guid? id, MangaRequest mangaRequest)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        int rows = await connection.ExecuteAsync(
            """
            UPDATE mangas SET
                title = @Title,
                title_native = @TitleNative,
                genres = @Genres,
                tags = @Tags,
                format = @Format,
                release_year = @ReleaseYear,
                release_month = @ReleaseMonth,
                release_day = @ReleaseDay,
                adult_content = @AdultContent,
                country_of_origin = @CountryOfOrigin,
                cover = @Cover,
                banner = @Banner,
                description = @Description,
                staff = @Staff::jsonb
            WHERE id = @Id
            """,
            new
            {
                Id = id,
                mangaRequest.Title,
                mangaRequest.TitleNative,
                mangaRequest.Genres,
                mangaRequest.Tags,
                mangaRequest.Format,
                mangaRequest.ReleaseYear,
                mangaRequest.ReleaseMonth,
                mangaRequest.ReleaseDay,
                mangaRequest.AdultContent,
                mangaRequest.CountryOfOrigin,
                mangaRequest.Cover,
                mangaRequest.Banner,
                mangaRequest.Description,
                mangaRequest.Staff
            });

        if (rows == 0) return null;

        var manga = mangaRequest.ToManga();
        manga.Id = id ?? Guid.Empty;
        return manga.ToMangaResponse();
    }

    public async Task DeleteManga(Guid id)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        await connection.ExecuteAsync("DELETE FROM mangas WHERE id = @Id", new { Id = id });
    }

    public async Task<List<MangaResponse>?> QueryMangas(List<string>? genres, string? searchWord)
    {
        return null;
    }

    public async Task<Dictionary<string, int>?> GetReadingStatusByManga(Guid mangaId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var stati = await connection.QueryAsync<ReadingStatusDictionary>(
            """
            Select status, Count(status)
            from user_manga
            where manga_id = @mangaId
            group by status 
            """, new { mangaId });

        return stati.ToDictionary(s => s.Status, s => s.Count);
    }

    public async Task<Dictionary<int, int>?> GetRatingByManga(Guid mangaId)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var stati = await connection.QueryAsync<RatingHistogram>(
            """
            Select r.rating, coalesce(v.value, 0) as value
            from 
            (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10)) r(rating)
            left Join 
            (Select rating, Count(*) as value
            from user_manga
            where manga_id = @mangaId
            group by rating) v
            On v.rating = r.rating
            order by r.rating 
            """, new { mangaId });

        return stati.ToDictionary(s => s.Rating, s => s.Value);
    }
}