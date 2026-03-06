using MangaLibraryAPI.DTO;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MangasController(IMangaService mangaService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromRoute] Guid id)
    {
        var manga = await mangaService.GetMangaById(id);

        return Ok(manga);
    }

    [HttpPost]
    public async Task<ActionResult<MangaResponse>> CreateManga([FromBody] MangaRequest mangaRequest)
    {
        var manga = await mangaService.CreateManga(mangaRequest);
        return CreatedAtAction(nameof(GetMangaFromId), new { manga!.Id }, manga);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MangaResponse>> UpdateManga([FromRoute] Guid id,
        [FromBody] MangaRequest mangaRequest)
    {
        var manga = await mangaService.UpdateManga(id, mangaRequest);
        if (manga == null) return await CreateManga(mangaRequest);
        return Ok(manga);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteManga([FromRoute] Guid id)
    {
        await mangaService.DeleteManga(id);
        return NoContent();
    }

    [HttpGet("query")]
    public async Task<ActionResult<PagedResponse<MangaResponse>>> QueryMangas(
        [FromQuery] MangaQuery mangaQuery)
    {
        return await mangaService.QueryMangas(mangaQuery);
    }

    [HttpGet("{id}/reading-status")]
    public async Task<ActionResult<Dictionary<string, int>>> GetReadingStatusByManga(
        [FromRoute] Guid id)
    {
        var stati = await mangaService.GetReadingStatusByManga(id);

        return Ok(stati);
    }

    [HttpGet("{id}/rating")]
    public async Task<ActionResult<Dictionary<string, int>>> GetRatingByManga(
        [FromRoute] Guid id)
    {
        var stati = await mangaService.GetRatingByManga(id);

        return Ok(stati);
    }
}