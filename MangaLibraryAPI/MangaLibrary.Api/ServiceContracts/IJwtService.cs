using Entities;
using MangaLibraryAPI.DTO;
using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.ServiceContracts;

public interface IJwtService
{
    public AuthenticationResponse CreateJwtToken(ApplicationUser user);
}