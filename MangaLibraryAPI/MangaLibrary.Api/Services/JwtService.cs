using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace MangaLibraryAPI.Services;

public class JwtService(IConfiguration configuration) : IJwtService
{
    public AuthenticationResponse CreateJwtToken(ApplicationUser user)
    {
        if (string.IsNullOrEmpty(configuration["Jwt:ExpirationMinutes"]))
        {
            throw new Exception("ExpirationMinutes must be set");
        }

        var expiration = DateTime.UtcNow.Date.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpirationMinutes"]));

        var claims = new Claim[]
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Subject identifier
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Jwt Token unique id
            new(JwtRegisteredClaimNames.Iat,
                DateTime.UtcNow.ToString(CultureInfo.CurrentCulture)), // Created at timestamp
        };

        if (string.IsNullOrEmpty(configuration["Jwt:Key"]))
        {
            throw new Exception("Key must be set");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var issuer = configuration["Issuer"];
        var audience = configuration["Audience"];
        var tokenGenerator = new JwtSecurityToken(issuer, audience, claims, expires: expiration,
            signingCredentials: signingCredentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenGenerator);

        return new AuthenticationResponse()
        {
            Token = token,
            Expiration = expiration
        };
    }
}