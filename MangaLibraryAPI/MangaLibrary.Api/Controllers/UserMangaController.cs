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
    [Authorize]
    [HttpGet("manga")]
    public async Task<ActionResult<IEnumerable<MangaLibraryResponse>>> GetMangasByUser()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var mangas =
            await userMangaService.GetMangasFromUser(userId);

        return Ok(mangas);
    }

    [Authorize]
    [HttpGet("manga/{mangaId}")]
    public async Task<ActionResult<UserMangaResponse>> GetUserManga([FromRoute] Guid mangaId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var manga =
            await userMangaService.GetUserManga(mangaId, userId);

        if (manga == null)
        {
            return NotFound();
        }

        return Ok(manga?.ToUserMangaResponse());
    }

    [Authorize]
    [HttpPost("manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> AddUserManga([FromBody] UserMangaRequest userMangaRequest,
        [FromRoute] Guid mangaId)
    {
        var userManga = userMangaRequest.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var createdUserManga = await userMangaService.AddMangaToUser(userManga);

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

        if (!string.IsNullOrEmpty(userMangaUpdate.Status))
        {
            return await AddUserManga(
                new UserMangaRequest() { Rating = userMangaUpdate.Rating, Status = userMangaUpdate.Status }, mangaId,
                userId);
        }

        return Problem("Cannot add rating to a manga not added ot the user.", statusCode: 400);
    }

    [Authorize]
    [HttpDelete("manga/{mangaId}")]
    public async Task<ActionResult> DeleteUserManga([FromRoute] Guid mangaId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await userMangaService.RemoveMangaFromUser(mangaId, userId);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{userId}/manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> AddUserManga([FromBody] UserMangaRequest userMangaRequest,
        [FromRoute] Guid userId, [FromRoute] Guid mangaId)
    {
        var userManga = userMangaRequest.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = userId;
        var createdUserManga = await userMangaService.AddMangaToUser(userManga);

        if (createdUserManga is null) return Problem("Error when adding the manga to the user", statusCode: 400);

        return Created("", createdUserManga);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{userId}/manga/{mangaId}")]
    public async Task<ActionResult<UserManga>> UpdateUserManga([FromBody] UserMangaUpdate userMangaUpdate,
        [FromRoute] Guid userId, [FromRoute] Guid mangaId)
    {
        var userManga = userMangaUpdate.ToUserManga();
        userManga.MangaId = mangaId;
        userManga.UserId = userId;
        var updatedUserManga = await userMangaService.UpdateUserManga(userManga);

        if (updatedUserManga is not null) return Ok(updatedUserManga);

        if (!string.IsNullOrEmpty(userMangaUpdate.Status))
        {
            return await AddUserManga(
                new UserMangaRequest() { Rating = userMangaUpdate.Rating, Status = userMangaUpdate.Status }, mangaId,
                userId);
        }

        return Problem("Cannot add rating to a manga not added ot the user.", statusCode: 400);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{userId}/manga/{mangaId}")]
    public async Task<ActionResult> DeleteUserManga([FromRoute] Guid mangaId, [FromRoute] Guid userId)
    {
        await userMangaService.RemoveMangaFromUser(mangaId, userId);
        return NoContent();
    }
}