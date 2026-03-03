using Microsoft.AspNetCore.Mvc;

namespace MangaLibraryAPI.Utility;

public static class CustomModelStateResponse
{
    public static ActionResult Factory(ActionContext context)
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(e =>
                {
                    if (e.ErrorMessage.Contains("JSON") || e.ErrorMessage.Contains("System."))
                        return $"'Invalid format or type.";

                    return e.ErrorMessage; // keeps your DataAnnotation messages (e.g. [Required])
                }).ToArray()
            );

        return new BadRequestObjectResult(new
        {
            status = 400,
            message = "One or more validation errors occurred.",
            errors
        });
    }
}