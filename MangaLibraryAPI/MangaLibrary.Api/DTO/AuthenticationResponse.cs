namespace MangaLibraryAPI.DTO;

public class AuthenticationResponse
{
    public string? Token { get; set; }
    public DateTime Expiration { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiration { get; set; }
}