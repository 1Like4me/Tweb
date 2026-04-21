using Microsoft.Extensions.DependencyInjection;
using MyApp.BusinessLayer.Auth;
using MyApp.BusinessLayer.Crud;

namespace MyApp.BusinessLayer;

public static class BusinessLogic
{
    public static IServiceCollection AddBusinessLayer(this IServiceCollection services)
    {
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<ITaskItemService, TaskItemService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEventTypeService, EventTypeService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IHealthService, HealthService>();

        return services;
    }
}
