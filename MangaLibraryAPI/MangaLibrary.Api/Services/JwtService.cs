using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace MangaLibraryAPI.Services;

public class JwtService(IConfiguration configuration, UserManager<ApplicationUser> userManager) : IJwtService
{
    public async Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user)
    {
        if (string.IsNullOrEmpty(configuration["Jwt:ExpirationMinutes"]))
        {
            throw new Exception("JWT ExpirationMinutes must be set");
        }

        var expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpirationMinutes"]));

        var claims = new Claim[]
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Subject identifier
            new(JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()), // Jwt Token unique id
            new(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64), // Created at timestamp
        };

        var roles = await userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            claims = claims.Append(new Claim(ClaimTypes.Role, role)).ToArray();
        }


        if (string.IsNullOrEmpty(configuration["Jwt:Key"]))
        {
            throw new Exception("Key must be set");
        }

        var securityKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        if (string.IsNullOrEmpty(configuration["Jwt:Issuer"]))
        {
            throw new Exception("Issuer must be set");
        }

        if (string.IsNullOrEmpty(configuration["Jwt:Audience"]))
        {
            throw new Exception("Audience must be set");
        }

        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];
        var tokenGenerator = new JwtSecurityToken(issuer, audience, claims, expires: expiration,
            signingCredentials: signingCredentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenGenerator);

        if (string.IsNullOrEmpty(configuration["RefreshToken:ExpirationMinutes"]))
        {
            throw new Exception("RefreshToken ExpirationMinutes must be set");
        }

        var refreshTokenExpiration =
            DateTime.UtcNow.AddMinutes(Convert.ToDouble(configuration["RefreshToken:ExpirationMinutes"]));

        return new AuthenticationResponse()
        {
            Token = token,
            Expiration = expiration,
            RefreshToken = GenerateRefreshToken(),
            RefreshTokenExpiration = refreshTokenExpiration
        };
    }

    private static string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    public ClaimsPrincipal? GetClaimsPrincipleFromJwtToken(string token)
    {
        var tokenValidationParams = new TokenValidationParameters()
        {
            ValidateAudience = true,
            ValidAudience = configuration["Jwt:Audience"],
            ValidateIssuer = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidateIssuerSigningKey = true,
            ValidateLifetime = false,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
        };

        var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        var claims = jwtSecurityTokenHandler.ValidateToken(token, tokenValidationParams, out var securityToken);

        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return claims;
    }
}