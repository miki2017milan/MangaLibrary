using System.Security.Claims;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Controllers;

[Route("/api/users")]
[ApiController]
public class UserMangaController(IUserMangaService userMangaService) : ControllerBase
{
    [HttpPost("{userId}/manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> AddMangaToUser([FromBody] UserMangaRequest userMangaRequest,
        [FromRoute] Guid userId, [FromRoute] Guid mangaId)
    {
        var userManga = userMangaRequest.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = userId;
        var createdUserManga = await userMangaService.AddMangaToUser(userManga);

        if (createdUserManga is null) return Problem("Error when adding the manga to the user", statusCode: 400);

        return Created("", createdUserManga);
    }

    [HttpPut("{userId}/manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> UpdateUserManga([FromBody] UserMangaRequest userMangaRequest,
        [FromRoute] Guid userId, [FromRoute] Guid mangaId)
    {
        var userManga = userMangaRequest.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = userId;
        var updatedUserManga = await userMangaService.UpdateUserManga(userManga);

        if (updatedUserManga is null) return await AddMangaToUser(userMangaRequest, mangaId, userId);

        return Ok(updatedUserManga);
    }

    [HttpDelete("{userId}/manga/{mangaId}")]
    public async Task<ActionResult> DeleteReadingStatus([FromRoute] Guid mangaId, [FromRoute] Guid userId)
    {
        await userMangaService.RemoveMangaFromUser(mangaId, userId);
        return NoContent();
    }

    [Authorize]
    [HttpGet("manga")]
    public async Task<ActionResult<IEnumerable<MangaReadingStatus>>> GetMangasByUser()
    {
        var mangas =
            await userMangaService.GetMangasFromUser(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));

        return Ok(mangas);
    }
}