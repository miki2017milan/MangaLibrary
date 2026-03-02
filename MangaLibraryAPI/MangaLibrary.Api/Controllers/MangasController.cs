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

        if (manga is null) return NotFound();
        return Ok(manga);
    }

    [HttpPost]
    public async Task<ActionResult<MangaResponse>> CreateManga([FromBody] MangaRequest? mangaRequest)
    {
        var manga = await mangaService.CreateManga(mangaRequest!);
        if (manga is null) return Problem("Failed to create manga");
        return CreatedAtAction(nameof(GetMangaFromId), new { manga.Id }, manga);
    }

    [HttpPut("{id?}")]
    public async Task<ActionResult<MangaResponse>> UpdateManga([FromRoute] Guid? id,
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
    public async Task<ActionResult<IEnumerable<MangaResponse>>> QueryMangas(
        [FromQuery(Name = "genre")] List<string>? genres, [FromQuery(Name = "title")] string? searchWord)
    {
        return (await mangaService.QueryMangas(genres, searchWord))!;
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