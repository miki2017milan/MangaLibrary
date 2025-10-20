using MangaLibraryAPI.Entities;

namespace MangaLibraryAPI.DTO;

public class ApplicationUserResponse
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? DisplayName { get; set; }
}

public static class ApplicationUserResponseExtension
{
    public static ApplicationUserResponse ToApplicationUserResponse(this ApplicationUser user)
    {
        return new ApplicationUserResponse() { Id = user.Id, Email = user.Email, DisplayName = user.DisplayName };
    }
}