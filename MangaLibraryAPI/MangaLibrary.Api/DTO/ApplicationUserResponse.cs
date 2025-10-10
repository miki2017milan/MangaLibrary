using Entities;

namespace ServiceContracts.DTO;

public class ApplicationUserResponse
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
}

public static class ApplicationUserResponseExtension
{
    public static ApplicationUserResponse ToApplicationUserResponse(ApplicationUser user)
    {
        return new ApplicationUserResponse() { Id = user.Id, Email = user.Email };
    }
}