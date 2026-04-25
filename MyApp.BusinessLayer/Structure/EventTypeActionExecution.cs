using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.EventType;

namespace MyApp.BusinessLayer.Structure;

public class EventTypeActionExecution : EventTypeActions, IEventTypeAction
{
    public EventTypeActionExecution(AppDbContext db) : base(db) { }

    public Task<IEnumerable<EventTypeDetailDto>> GetAllEventTypesActionAsync(CancellationToken cancellationToken = default)
    {
        return GetAllEventTypesActionExecution(cancellationToken);
    }

    public Task<EventTypeDetailDto?> GetEventTypeByIdActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return GetEventTypeByIdActionExecution(id, cancellationToken);
    }

    public Task<EventTypeDetailDto> CreateEventTypeActionAsync(EventType eventType, CancellationToken cancellationToken = default)
    {
        return CreateEventTypeActionExecution(eventType, cancellationToken);
    }

    public Task<EventTypeDetailDto?> UpdateEventTypeActionAsync(EventType eventType, CancellationToken cancellationToken = default)
    {
        return UpdateEventTypeActionExecution(eventType, cancellationToken);
    }

    public Task<bool> DeleteEventTypeActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return DeleteEventTypeActionExecution(id, cancellationToken);
    }
}
