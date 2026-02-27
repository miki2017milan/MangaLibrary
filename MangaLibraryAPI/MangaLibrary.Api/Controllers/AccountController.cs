using System.Security.Claims;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AccountController(
    UserManager<ApplicationUser> userManager,
    IJwtService jwtService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterRequest userDetails)
    {
        var user = new ApplicationUser
            { Email = userDetails.Email, UserName = userDetails.Email, DisplayName = userDetails.DisplayName! };

        var result = await userManager.CreateAsync(user, userDetails.Password!);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(jwtService.CreateJwtToken(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginUser([FromBody] LoginRequest userDetails)
    {
        var user = await userManager.FindByEmailAsync(userDetails.Email!);
        if (user == null) return Problem("Email or Password are wrong", statusCode: 401);

        var isPasswordValid = await userManager.CheckPasswordAsync(user, userDetails.Password!);
        if (!isPasswordValid) return Problem("Email or Password are wrong", statusCode: 401);

        return Ok(jwtService.CreateJwtToken(user));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<ApplicationUserResponse>> GetUserProfile()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null) return NotFound();
        return Ok(user.ToApplicationUserResponse());
    }
}