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
    public async Task<ActionResult<UserManga>> UpdateUserManga([FromBody] UserMangaUpdate userMangaUpdate,
        [FromRoute] Guid userId, [FromRoute] Guid mangaId)
    {
        var userManga = userMangaUpdate.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = userId;
        var updatedUserManga = await userMangaService.UpdateUserManga(userManga);

        if (updatedUserManga is not null) return Ok(updatedUserManga);

        if (string.IsNullOrEmpty(userMangaUpdate.Status))
            return Problem("Cannot add rating to a manga not added ot the user.");
        return await AddMangaToUser(
            new UserMangaRequest() { Rating = userMangaUpdate.Rating, Status = userMangaUpdate.Status }, mangaId,
            userId);
    }

    [HttpDelete("{userId}/manga/{mangaId}")]
    public async Task<ActionResult> DeleteReadingStatus([FromRoute] Guid mangaId, [FromRoute] Guid userId)
    {
        await userMangaService.RemoveMangaFromUser(mangaId, userId);
        return NoContent();
    }

    [Authorize]
    [HttpGet("manga")]
    public async Task<ActionResult<IEnumerable<UserMangaReadingStatus>>> GetMangasByUser()
    {
        var mangas =
            await userMangaService.GetMangasFromUser(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));

        return Ok(mangas);
    }

    [Authorize]
    [HttpGet("manga/{mangaId}")]
    public async Task<ActionResult<UserMangaReadingStatus>> GetMangasByUser([FromRoute] Guid mangaId)
    {
        var manga =
            await userMangaService.GetUserManga(mangaId,
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));

        return Ok(manga);
    }

    [Authorize]
    [HttpPost("manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> AddMangaToUser([FromBody] UserMangaRequest userMangaRequest,
        [FromRoute] Guid mangaId)
    {
        var userManga = userMangaRequest.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var createdUserManga = await userMangaService.AddMangaToUser(userManga);

        if (createdUserManga is null) return Problem("Error when adding the manga to the user", statusCode: 400);

        return Created("", createdUserManga);
    }

    [Authorize]
    [HttpPut("manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> UpdateUserManga([FromBody] UserMangaUpdate userMangaUpdate,
        [FromRoute] Guid mangaId)
    {
        var userManga = userMangaUpdate.ToUserManga();
        userManga.MangaId = mangaId;
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        userManga.UserId = userId;
        var updatedUserManga = await userMangaService.UpdateUserManga(userManga);

        if (updatedUserManga is not null) return Ok(updatedUserManga);

        if (string.IsNullOrEmpty(userMangaUpdate.Status))
            return Problem("Cannot add rating to a manga not added ot the user.", statusCode: 400);
        return await AddMangaToUser(
            new UserMangaRequest() { Rating = userMangaUpdate.Rating, Status = userMangaUpdate.Status }, mangaId,
            userId);
    }
}