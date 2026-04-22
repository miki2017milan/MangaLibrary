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
    public async Task<ActionResult<AuthenticationResponse>> RegisterUser([FromBody] RegisterRequest userDetails)
    {
        var user = new ApplicationUser
            { Email = userDetails.Email, UserName = userDetails.Email, DisplayName = userDetails.DisplayName! };

        var result = await userManager.CreateAsync(user, userDetails.Password!);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await userManager.AddToRoleAsync(user, "User");

        var authenticationResponse = await jwtService.CreateJwtToken(user);
        user.RefreshToken = authenticationResponse.RefreshToken;
        user.RefreshTokenExpiration = authenticationResponse.RefreshTokenExpiration;
        await userManager.UpdateAsync(user);

        return Ok(authenticationResponse);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResponse>> LoginUser([FromBody] LoginRequest userDetails)
    {
        var user = await userManager.FindByEmailAsync(userDetails.Email);
        if (user == null) return Problem("Email or Password are wrong", statusCode: 401);

        var isPasswordValid = await userManager.CheckPasswordAsync(user, userDetails.Password);
        if (!isPasswordValid) return Problem("Email or Password are wrong", statusCode: 401);

        var authenticationResponse = await jwtService.CreateJwtToken(user);
        user.RefreshToken = authenticationResponse.RefreshToken;
        user.RefreshTokenExpiration = authenticationResponse.RefreshTokenExpiration;
        await userManager.UpdateAsync(user);

        return Ok(authenticationResponse);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> GenerateJwtToken([FromBody] RefreshTokenRequest refreshTokenRequest)
    {
        var jwtToken = refreshTokenRequest.Token;
        var refreshToken = refreshTokenRequest.RefreshToken;

        if (string.IsNullOrEmpty(jwtToken) || string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest();
        }

        var claims = jwtService.GetClaimsPrincipleFromJwtToken(jwtToken);

        if (claims is null) return BadRequest();

        var userId = claims.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;
        var user = await userManager.FindByIdAsync(userId);

        if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiration < DateTime.UtcNow)
        {
            return BadRequest();
        }

        var authenticationResponse = await jwtService.CreateJwtToken(user);
        user.RefreshToken = authenticationResponse.RefreshToken;
        user.RefreshTokenExpiration = authenticationResponse.RefreshTokenExpiration;
        await userManager.UpdateAsync(user);

        return Ok(authenticationResponse);
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