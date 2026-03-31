using AutoMapper;
using MyApp.API.DTOs;
using MyApp.Domain;

namespace MyApp.API.Mappings;

public class ApiMappingProfile : Profile
{
    public ApiMappingProfile()
    {
        // User
        CreateMap<User, UserDetailDto>();
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
    }
}

