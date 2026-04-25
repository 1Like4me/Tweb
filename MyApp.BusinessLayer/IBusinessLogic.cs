using MyApp.BusinessLayer.Interfaces;

namespace MyApp.BusinessLayer;

/// <summary>
/// Defines the contract for the business logic factory.
/// This allows for proper dependency injection and testing.
/// </summary>
public interface IBusinessLogic
{
    IAuthAction AuthAction();
    IUserAction UserAction();
    IProjectAction ProjectAction();
    ITaskItemAction TaskItemAction();
    IEventTypeAction EventTypeAction();
    IBookingAction BookingAction();
}
