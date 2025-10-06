using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ServiceContracts;
using ServiceContracts.DTO;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MangasController(IMangaService mangaService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromQuery] ObjectId? id)
    {
        if (id == null) return Problem("Id can not be null.", statusCode: 400);

        var manga = await mangaService.GetMangaById(id.ToString()!);

        return manga is null ? NotFound() : manga;
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<MangaSearchResponse>>> SearchMangas(
        [FromQuery(Name = "genre")] List<string>? genres, [FromQuery(Name = "title")] string? searchWord)
    {
        var mangas = await mangaService.QueryMangas(genres, searchWord);
        return mangas is null ? NotFound() : mangas;
    }
}