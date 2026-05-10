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
    IEventTypeAction EventTypeAction();
    IBookingAction BookingAction();
}
