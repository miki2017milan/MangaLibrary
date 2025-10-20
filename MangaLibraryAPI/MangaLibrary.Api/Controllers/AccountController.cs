using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AccountController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IJwtService jwtService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterRequest userDetails)
    {
        var user = new ApplicationUser
            { Email = userDetails.Email, UserName = userDetails.Email, DisplayName = userDetails.DisplayName! };

        var result = await userManager.CreateAsync(user, userDetails.Password!);

        if (!result.Succeeded) return BadRequest(result.Errors);

        await signInManager.SignInAsync(user, false);

        var jwtToken = jwtService.CreateJwtToken(user);

        return Ok(jwtToken);
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginUser(LoginRequest userDetails)
    {
        var result = await signInManager.PasswordSignInAsync(userDetails.Email!, userDetails.Password!,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded) return Problem("Login failed: Email or password are incorrect", statusCode: 401);

        var user = await userManager.FindByEmailAsync(userDetails.Email!);
        if (user == null) return NotFound("User not found");

        var jwtToken = jwtService.CreateJwtToken(user);

        return Ok(jwtToken);
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ApplicationUserResponse>> GetUserProfile()
    {
        return null;
    }

    [HttpGet]
    public async Task<ActionResult> LogoutUser()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }
}