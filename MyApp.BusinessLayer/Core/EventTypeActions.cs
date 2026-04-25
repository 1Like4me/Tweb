using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.EventType;

namespace MyApp.BusinessLayer.Core;

public class EventTypeActions
{
    private readonly AppDbContext _db;

    public EventTypeActions(AppDbContext db)
    {
        _db = db;
    }

    internal async Task<IEnumerable<EventTypeDetailDto>> GetAllEventTypesActionExecution(CancellationToken cancellationToken = default)
    {
        var eventTypes = await _db.EventTypes.AsNoTracking().OrderBy(e => e.Name).ToListAsync(cancellationToken);
        return eventTypes.Select(MapEventTypeToDetailDto);
    }

    internal async Task<EventTypeDetailDto?> GetEventTypeByIdActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var eventType = await _db.EventTypes.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        return eventType is null ? null : MapEventTypeToDetailDto(eventType);
    }

    internal async Task<EventTypeDetailDto> CreateEventTypeActionExecution(EventType eventType, CancellationToken cancellationToken = default)
    {
        _db.EventTypes.Add(eventType);
        await _db.SaveChangesAsync(cancellationToken);
        return MapEventTypeToDetailDto(eventType);
    }

    internal async Task<EventTypeDetailDto?> UpdateEventTypeActionExecution(EventType eventType, CancellationToken cancellationToken = default)
    {
        var existing = await _db.EventTypes.FirstOrDefaultAsync(e => e.Id == eventType.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Name = eventType.Name;
        existing.Description = eventType.Description;
        existing.BasePrice = eventType.BasePrice;
        existing.MaxCapacity = eventType.MaxCapacity;

        await _db.SaveChangesAsync(cancellationToken);
        return MapEventTypeToDetailDto(existing);
    }

    internal async Task<bool> DeleteEventTypeActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _db.EventTypes.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        _db.EventTypes.Remove(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static EventTypeDetailDto MapEventTypeToDetailDto(EventType eventType)
    {
        return new EventTypeDetailDto
        {
            Id = eventType.Id,
            Name = eventType.Name,
            Description = eventType.Description,
            BasePrice = eventType.BasePrice,
            MaxCapacity = eventType.MaxCapacity
        };
    }
}
