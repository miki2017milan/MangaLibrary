using System.ComponentModel.DataAnnotations;

namespace MangaLibraryAPI.Entities;

public class ReadingStatus
{
    [Required] public required Guid MangaId { get; set; }
    [Required] public required Guid UserId { get; set; }
    [Required] public required string Status { get; set; }
}