using AutoMapper;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Auth;
using MyApp.Domain.Models.Booking;
using MyApp.Domain.Models.EventType;
using MyApp.Domain.Models.Project;
using MyApp.Domain.Models.TaskItem;
using MyApp.Domain.Models.User;

namespace MyApp.API.Mappings;

public class ApiMappingProfile : Profile
{
    public ApiMappingProfile()
    {
        // User
        CreateMap<User, UserDetailDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString().ToLowerInvariant()));
        CreateMap<UserCreateDto, User>();
        CreateMap<UserUpdateDto, User>();

        // Project
        CreateMap<Project, ProjectDetailDto>();
        CreateMap<ProjectCreateDto, Project>();
        CreateMap<ProjectUpdateDto, Project>();

        // TaskItem
        CreateMap<TaskItem, TaskItemDetailDto>();
        CreateMap<TaskItemCreateDto, TaskItem>();
        CreateMap<TaskItemUpdateDto, TaskItem>();

        // EventType
        CreateMap<EventType, EventTypeDetailDto>();
        CreateMap<EventTypeCreateDto, EventType>();
        CreateMap<EventTypeUpdateDto, EventType>();

        // Booking
        CreateMap<BookingCreateDto, Booking>();
        CreateMap<BookingUpdateDto, Booking>();
        CreateMap<Booking, BookingDetailDto>()
            .ForMember(dest => dest.EventTypeName, opt => opt.MapFrom(src => src.EventType.Name))
            .ForMember(dest => dest.EventDate, opt => opt.MapFrom(src => src.EventDate.ToString("yyyy-MM-dd")))
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString("HH:mm")))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLowerInvariant()));
    }
}

