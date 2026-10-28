using AutoMapper;
using backend.Models;

namespace backend.Profiles;

public class ApiMappingProfile : Profile
{
    public ApiMappingProfile()
    {
        CreateMap<User, OwnerSummaryDto>();
        CreateMap<User, UserReadDto>();
        CreateMap<RegisterRequestCreateDto, RequestRegister>();
        CreateMap<RequestRegister, RegisterRequestReadDto>();
        CreateMap<MotelRoom, MotelRoomReadDto>();
        CreateMap<MotelRoomUpsertDto, MotelRoom>();
    }
}
