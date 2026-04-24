using MyApp.Domain.Entities;
using MyApp.Domain.Models.EventType;

namespace MyApp.BusinessLayer.Interfaces;

public interface IEventTypeAction
{
    Task<IEnumerable<EventTypeDetailDto>> GetAllEventTypesActionAsync(CancellationToken cancellationToken = default);
    Task<EventTypeDetailDto?> GetEventTypeByIdActionAsync(int id, CancellationToken cancellationToken = default);
    Task<EventTypeDetailDto> CreateEventTypeActionAsync(EventType eventType, CancellationToken cancellationToken = default);
    Task<EventTypeDetailDto?> UpdateEventTypeActionAsync(EventType eventType, CancellationToken cancellationToken = default);
    Task<bool> DeleteEventTypeActionAsync(int id, CancellationToken cancellationToken = default);
}
