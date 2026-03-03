using MangaLibraryAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MangaLibraryAPI.Filters;

public class MangaExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var result = context.Exception switch
        {
            MangaNotFoundException ex => new BadRequestObjectResult(new { error = ex.Message }),
            _ => null
        };

        if (result is null) return;

        context.Result = result;
        context.ExceptionHandled = true;
    }
}