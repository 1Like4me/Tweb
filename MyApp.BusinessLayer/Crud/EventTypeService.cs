using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain;

namespace MyApp.BusinessLayer.Crud;

public interface IEventTypeService
{
    Task<IEnumerable<EventType>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EventType?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EventType> CreateAsync(EventType eventType, CancellationToken cancellationToken = default);
    Task<EventType?> UpdateAsync(EventType eventType, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public class EventTypeService : IEventTypeService
{
    private readonly AppDbContext _db;

    public EventTypeService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EventType>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.EventTypes.AsNoTracking().OrderBy(e => e.Name).ToListAsync(cancellationToken);
    }

    public async Task<EventType?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.EventTypes.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<EventType> CreateAsync(EventType eventType, CancellationToken cancellationToken = default)
    {
        _db.EventTypes.Add(eventType);
        await _db.SaveChangesAsync(cancellationToken);
        return eventType;
    }

    public async Task<EventType?> UpdateAsync(EventType eventType, CancellationToken cancellationToken = default)
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
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
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
}
