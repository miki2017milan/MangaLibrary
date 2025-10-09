using Entities;
using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaService(MangaLibraryDbContext dbContext) : IMangaService
{
    public async Task<MangaResponse?> GetMangaById(Guid id)
    {
        var manga = await dbContext.Mangas.FindAsync(id);

        return manga?.ToMangaResponse();
    }

    public async Task<MangaResponse> CreateManga(MangaRequest mangaRequest)
    {
        var manga = await dbContext.Mangas.AddAsync(mangaRequest.ToManga());

        await dbContext.SaveChangesAsync();
        return manga.Entity.ToMangaResponse();
    }

    public async Task<MangaResponse?> UpdateManga(Guid? id, MangaRequest mangaRequest)
    {
        var manga = await dbContext.Mangas.FindAsync(id);

        if (manga == null) return null;

        manga.Title = mangaRequest.Title!;
        manga.TitleNative = mangaRequest.TitleNative;
        manga.Genres = mangaRequest.Genres;
        manga.Tags = mangaRequest.Tags;
        manga.Format = mangaRequest.Format;
        manga.ReleaseYear = mangaRequest.ReleaseYear;
        manga.ReleaseMonth = mangaRequest.ReleaseMonth;
        manga.ReleaseDay = mangaRequest.ReleaseDay;
        manga.AdultContent = mangaRequest.AdultContent;
        manga.CountryOfOrigin = mangaRequest.CountryOfOrigin;
        manga.Cover = mangaRequest.Cover;
        manga.BannerImage = mangaRequest.BannerImage;
        manga.Description = mangaRequest.Description;
        manga.Staff = mangaRequest.Staff;

        await dbContext.SaveChangesAsync();

        return manga.ToMangaResponse();
    }

    public async Task DeleteManga(Guid id)
    {
        var manga = await dbContext.Mangas.FindAsync(id);

        if (manga != null)
        {
            dbContext.Mangas.Remove(manga);
            await dbContext.SaveChangesAsync();
        }
    }

    public Task<List<MangaResponse>?> QueryMangas(List<string>? genres, string? searchWord)
    {
        throw new NotImplementedException();
    }
}