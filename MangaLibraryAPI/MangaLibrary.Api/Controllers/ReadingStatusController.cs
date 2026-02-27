using System.Security.Claims;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Controllers;

[Route("/api/status")]
[ApiController]
public class ReadingStatusController(IReadingStatusService readingStatusService) : ControllerBase
{
    [HttpGet("get")]
    public async Task<ActionResult<ReadingStatus>> GetReadingStatus([FromQuery] Guid mangaId, [FromQuery] Guid userId)
    {
        var readingStatus = await readingStatusService.GetReadingStatus(mangaId, userId);

        if (readingStatus is null) return NotFound();

        return Ok(readingStatus);
    }

    [HttpGet("{mangaId}")]
    public async Task<ActionResult<IEnumerable<string>>> GetReadingStatusByManga([FromRoute] Guid mangaId)
    {
        var stati = await readingStatusService.GetReadingStatusByManga(mangaId);

        return Ok(stati);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MangaReadingStatus>>> GetMangasByUser()
    {
        var mangas =
            await readingStatusService.GetReadingStatusByUser(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));

        return Ok(mangas);
    }

    [HttpPost]
    public async Task<ActionResult<ReadingStatus>> CreateReadingStatus([FromBody] ReadingStatus readingStatus)
    {
        var createdReadingStatus = await readingStatusService.AddReadingStatus(readingStatus);

        if (createdReadingStatus is null) return Problem("Error when creating ReadingStatus");

        return CreatedAtAction(nameof(GetReadingStatus),
            new { mangaId = createdReadingStatus.MangaId, userId = createdReadingStatus.UserId }, createdReadingStatus);
    }

    [HttpPut]
    public async Task<ActionResult<ReadingStatus>> UpdateReadingStatus([FromBody] ReadingStatus readingStatus)
    {
        var updatedReadingStatus = await readingStatusService.UpdateReadingStatus(readingStatus);

        if (updatedReadingStatus is null) return await CreateReadingStatus(readingStatus);

        return Ok(updatedReadingStatus);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteReadingStatus([FromQuery] Guid mangaId, [FromQuery] Guid userId)
    {
        await readingStatusService.DeleteReadingStatus(mangaId, userId);
        return NoContent();
    }
}