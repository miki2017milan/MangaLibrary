using MangaLibraryAPI.DTO;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Mvc;
using ServiceContracts;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]", Name = "mangas")]
[ApiController]
public class MangasController(IMangaService mangaService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<MangaResponse>> GetMangaFromId([FromRoute] Guid id)
    {
        var manga = await mangaService.GetMangaById(id);
        return manga != null ? manga : NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<MangaResponse>> CreateManga([FromBody] MangaRequest? mangaRequest)
    {
        var manga = await mangaService.CreateManga(mangaRequest!);
        return CreatedAtAction(nameof(GetMangaFromId), new { manga.Id }, manga);
    }

    [HttpPost("list")]
    public async Task<ActionResult> CreateMangaFromList([FromBody] List<MangaRequest>? mangaRequest)
    {
        await mangaService.CreateMangaFromList(mangaRequest!);
        return Ok();
    }

    [HttpPut("{id?}")]
    public async Task<ActionResult<MangaResponse>> UpdateManga([FromRoute] Guid? id,
        [FromBody] MangaRequest? mangaRequest)
    {
        var manga = await mangaService.UpdateManga(id, mangaRequest!);
        if (manga == null) return await CreateManga(mangaRequest);
        return manga;
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
        return NoContent();
    }
}