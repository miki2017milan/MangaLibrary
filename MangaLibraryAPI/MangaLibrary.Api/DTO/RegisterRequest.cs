using System.ComponentModel.DataAnnotations;

namespace ServiceContracts.DTO;

public class RegisterRequest
{
    [Required, EmailAddress] public string? Email { get; set; }
    [Required] public string? Password { get; set; }
    [Required] public string? DisplayName { get; set; }

    [Required, Compare("Password", ErrorMessage = "Password and confirm password do not match.")]
    public string? ConfirmPassword { get; set; }
}