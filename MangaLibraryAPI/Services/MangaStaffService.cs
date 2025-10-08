using ServiceContracts;
using ServiceContracts.DTO;

namespace Services;

public class MangaStaffService : IMangaStaffService
{
    public Task<MangaStaffResponse?> GetMangaStaffById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<MangaStaffResponse?> CreateMangaStaff(MangaStaffCreateRequest mangaStaffAddRequest)
    {
        throw new NotImplementedException();
    }

    public Task<MangaStaffResponse?> UpdateMangaStaff(Guid id, MangaStaffUpdateRequest mangaStaffUpdateRequest)
    {
        throw new NotImplementedException();
    }

    public Task DeleteMangaStaff(Guid id)
    {
        throw new NotImplementedException();
    }
}