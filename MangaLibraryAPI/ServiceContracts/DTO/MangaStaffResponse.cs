using Entities;

namespace ServiceContracts.DTO;

public class MangaStaffResponse
{
    public Guid? Id { get; set; }
    public string? Name { get; set; }
    public string? Role { get; set; }
}

public static class StaffResponseExtension
{
    public static MangaStaffResponse ToMangaStaffResponse(this MangaStaff staff)
    {
        return new MangaStaffResponse()
        {
            Id = staff.Id,
            Name = staff.Name,
            Role = staff.Role,
        };
    }
}