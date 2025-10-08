using System.ComponentModel.DataAnnotations;

namespace Entities;

public class MangaStaff
{
    [Key] public Guid Id { get; set; }
    [StringLength(256)] public required string Name { get; set; }
    [StringLength(256)] public required string Role { get; set; }
}