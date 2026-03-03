using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.ServiceContracts;

public interface IJwtService
{
    public Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user);
}