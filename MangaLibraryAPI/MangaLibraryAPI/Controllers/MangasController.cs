using Microsoft.AspNetCore.Mvc;
using ServiceContracts;
using ServiceContracts.DTO;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MangasController(IMangaService mangaService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<MangaResponse>> CreateManga([FromBody] MangaCreateRequest mangaCreateRequest)
    {
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MangaResponse>> UpdateManga([FromRoute] Guid id,
        [FromBody] MangaUpdateRequest mangaUpdateRequest)
    {
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteManga([FromRoute] Guid id)
    {
        return NoContent();
    }

    [HttpGet("query")]
    public async Task<ActionResult<IEnumerable<MangaResponse>>> QueryMangas(
        [FromQuery(Name = "genre")] List<string>? genres, [FromQuery(Name = "title")] string? searchWord)
    {
        return NoContent();
    }
}