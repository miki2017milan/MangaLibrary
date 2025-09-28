using Microsoft.AspNetCore.Mvc;
using ServiceContracts;
using ServiceContracts.DTO;

namespace MangaLibraryAPI.Controllers;

[Route("/api/mangas")]
public class MangaController : Controller
{
    private readonly IMangaService _mangaService;

    public MangaController(IMangaService mangaService)
    {
        _mangaService = mangaService;
    }

    [HttpGet("")]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromQuery] string? id)
    {
        var manga = await _mangaService.GetMangaById(id);

        return manga is null ? NotFound() : manga;
    }
    
    [HttpGet("search/{searchWord}")]
    public async Task<ActionResult<List<MangaSearchResponse>>> SearchMangas(string? searchWord)
    {
        var mangas = await _mangaService.SearchMangasWithTitle(searchWord);
        return mangas is null ? NotFound() : mangas;
    }
}