using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ServiceContracts.DTO;

namespace MangaLibraryAPI.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
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
        return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginUser(LoginRequest userDetails)
    {
        var result = await signInManager.PasswordSignInAsync(userDetails.Email!, userDetails.Password!,
            isPersistent: false,
            lockoutOnFailure: false);

        return !result.Succeeded
            ? Problem("Login failed: Email or password are incorrect", statusCode: 401)
            : NoContent();
    }

    [HttpGet]
    public async Task<ActionResult> LogoutUser()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }
}