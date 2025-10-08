using System.ComponentModel.DataAnnotations;
using Entities;

namespace ServiceContracts.DTO;

public class MangaStaffCreateRequest
{
    [Required] public required string Name { get; set; }
    [Required] public required string Role { get; set; }

    public MangaStaff ToMangaStaff()
    {
        return new MangaStaff() { Name = Name, Role = Role };
    }
}