using Dapper;
using MangaLibraryAPI.Database;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.Exceptions;
using MangaLibraryAPI.ServiceContracts;

namespace MangaLibraryAPI.Services;

public class MangaService(IDbConnectionFactory connectionFactory) : IMangaService
{
    public async Task<MangaResponse?> GetMangaById(Guid id)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();
        var manga = await connection.QueryFirstOrDefaultAsync<Manga>("SELECT * FROM mangas WHERE id = @id", new { id });

        if (manga is null) throw new MangaNotFoundException(id);

        return manga.ToMangaResponse();
    }

    public async Task<MangaResponse?> CreateManga(MangaRequest mangaRequest)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        var guid = Guid.NewGuid();

        await connection.ExecuteAsync(
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

    public async Task<PagedResponse<MangaResponse>> QueryMangas(MangaQuery mangaQuery)
    {
        using var connection = await connectionFactory.CreateDbConnectionAsync();

        if (string.IsNullOrEmpty(mangaQuery.Title) && (mangaQuery.Genres == null || mangaQuery.Genres.Count == 0) &&
            (mangaQuery.Tags == null || mangaQuery.Tags.Count == 0) && string.IsNullOrEmpty(mangaQuery.Format) &&
            string.IsNullOrEmpty(mangaQuery.CountryOfOrigin))
        {
            var popularMangas =
                (await connection.QueryAsync<PaginatedManga>(
                    $"""
                     Select id, title, title_native, genres, tags, format, release_year, release_month, release_day, adult_content, country_of_origin, cover, banner, description, staff,
                            Count(*) Over() as TotalCount
                     from mangas, popular_mangas
                     where id = mangaid
                     order by spot 
                     """)).ToList();

            return new PagedResponse<MangaResponse>()
            {
                Content = popularMangas.Select((value) => value.ToMangaResponse()),
                Total = popularMangas.Count != 0
                    ? (int)Math.Ceiling((double)popularMangas[0].TotalCount / mangaQuery.PageSize)
                    : 0,
                Page = mangaQuery.Page,
                PageSize = mangaQuery.PageSize,
            };
        }

        var whereParameters = new List<string>();
        var parameters = new DynamicParameters();
        var orderBy = "";

        if (!string.IsNullOrEmpty(mangaQuery.Title))
        {
            whereParameters.Add("title ILIKE @Title");
            parameters.Add("@Title", "%" + mangaQuery.Title + "%");
            orderBy = "ORDER BY similarity(title, @Title) DESC";
        }

        if (mangaQuery.Genres != null && mangaQuery.Genres.Count != 0)
        {
            for (var i = 0; i < mangaQuery.Genres.Count; i++)
            {
                whereParameters.Add($"@Genre{i} = ANY(genres)");
                parameters.Add($"@Genre{i}", mangaQuery.Genres[i]);
            }
        }

        if (mangaQuery.Tags != null && mangaQuery.Tags.Count != 0)
        {
            for (var i = 0; i < mangaQuery.Tags.Count; i++)
            {
                whereParameters.Add($"@Tag{i} = ANY(tags)");
                parameters.Add($"@Tag{i}", mangaQuery.Tags[i]);
            }
        }

        if (!string.IsNullOrEmpty(mangaQuery.Format))
        {
            whereParameters.Add("format = @Format");
            parameters.Add("@Format", mangaQuery.Format);
        }

        if (!string.IsNullOrEmpty(mangaQuery.CountryOfOrigin))
        {
            whereParameters.Add("country_of_origin = @CountryOfOrigin");
            parameters.Add("@CountryOfOrigin", mangaQuery.CountryOfOrigin);
        }

        if (!mangaQuery.IncludesAdultContent)
        {
            whereParameters.Add("adult_content = false");
        }

        var whereSql = string.Join(" and ", whereParameters);

        if (!string.IsNullOrEmpty(whereSql))
        {
            whereSql = "where " + whereSql;
        }

        var parameterValues = parameters.ParameterNames
            .Aggregate($"""
                        Select *
                        from mangas
                        where {whereSql}
                        """, (current, name) =>
                current.Replace($"@{name}", parameters.Get<object>(name)?.ToString() ?? "NULL"));

        var result =
            (await connection.QueryAsync<PaginatedManga>(
                $"""
                 Select *, Count(*) Over() as TotalCount
                 from mangas
                 {whereSql}
                 {orderBy}
                 Offset {(mangaQuery.Page - 1) * mangaQuery.PageSize}
                 Limit {mangaQuery.PageSize}
                 """, parameters)).ToList();

        return new PagedResponse<MangaResponse>()
        {
            Content = result.Select((value) => value.ToMangaResponse()),
            Total = result.Count != 0 ? (int)Math.Ceiling((double)result[0].TotalCount / mangaQuery.PageSize) : 0,
            Page = mangaQuery.Page,
            PageSize = mangaQuery.PageSize,
        };
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