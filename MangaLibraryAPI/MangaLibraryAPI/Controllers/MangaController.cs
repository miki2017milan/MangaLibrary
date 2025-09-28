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
    public async Task<List<MangaResponse>> GetMangas([FromQuery] string? title)
    {
        if (title is null) return await _mangaService.GetAllMangas();
        return await _mangaService.GetMangasByTitle(title);
    }

    [HttpGet("{id}")]
    public async Task<MangaResponse> GetManga(string id)
    {
        return await _mangaService.GetMangaById(id);
    }
}