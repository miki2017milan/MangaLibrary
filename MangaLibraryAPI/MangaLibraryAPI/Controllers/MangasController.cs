using Microsoft.AspNetCore.Mvc;
using ServiceContracts;
using ServiceContracts.DTO;

namespace MangaLibraryAPI.Controllers;

[Route("/api/mangas")]
public class MangaController : ControllerBase
{
    private readonly IMangaService _mangaService;

    public MangaController(IMangaService mangaService)
    {
        _mangaService = mangaService;
    }

    [HttpGet("")]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromQuery] string? id)
    {
        MangaResponse? manga;
        try
        {
            manga = await _mangaService.GetMangaById(id);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }

        return manga is null ? NotFound() : manga;
    }
    
    [HttpGet("search")]
    public async Task<ActionResult<List<MangaSearchResponse>>> SearchMangas([FromQuery(Name = "genre")] List<string>? genres, [FromQuery(Name = "title")] string? searchWord)
    {
        var mangas = await _mangaService.QueryMangas(genres, searchWord);
        return mangas is null ? NotFound() : mangas;
    }
}