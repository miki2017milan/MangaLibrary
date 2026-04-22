using System.Security.Claims;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.ServiceContracts;

public interface IJwtService
{
    public Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user);
    public ClaimsPrincipal? GetClaimsPrincipleFromJwtToken(string token);
}