using ServiceContracts.DTO;

namespace ServiceContracts;

public interface IMangaStaffService
{
    Task<MangaStaffResponse?> GetMangaStaffById(Guid id);
    Task<MangaStaffResponse?> CreateMangaStaff(MangaStaffCreateRequest mangaStaffAddRequest);
    Task<MangaStaffResponse?> UpdateMangaStaff(Guid id, MangaStaffUpdateRequest mangaStaffUpdateRequest);
    Task DeleteMangaStaff(Guid id);
}