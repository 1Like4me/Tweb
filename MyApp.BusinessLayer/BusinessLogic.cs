using Microsoft.Extensions.Configuration;
using MyApp.BusinessLayer.Interfaces;
using MyApp.BusinessLayer.Structure;
using MyApp.DataAccess;

namespace MyApp.BusinessLayer;

public class BusinessLogic
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public BusinessLogic(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public IAuthAction AuthAction()
    {
        return new AuthActionExecution(_db, _configuration);
    }

    public IUserAction UserAction()
    {
        return new UserActionExecution(_db);
    }

    public IProjectAction ProjectAction()
    {
        return new ProjectActionExecution(_db);
    }

    public ITaskItemAction TaskItemAction()
    {
        return new TaskItemActionExecution(_db);
    }

    public IEventTypeAction EventTypeAction()
    {
        return new EventTypeActionExecution(_db);
    }

    public IBookingAction BookingAction()
    {
        return new BookingActionExecution(_db);
    }
}
