using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;

namespace MyApp.BusinessLayer.Crud;

public interface IBookingService
{
    Task<IEnumerable<Booking>> GetAllAsync(int? userId = null, CancellationToken cancellationToken = default);
    Task<Booking?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Booking?> CreateAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<Booking?> UpdateAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<Booking?> ChangeStatusAsync(int id, BookingStatus status, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;

    public BookingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync(int? userId = null, CancellationToken cancellationToken = default)
    {
        var query = _db.Bookings
            .AsNoTracking()
            .Include(b => b.EventType)
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(b => b.UserId == userId.Value);
        }

        return await query.OrderByDescending(b => b.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<Booking?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Bookings
            .AsNoTracking()
            .Include(b => b.EventType)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<Booking?> CreateAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        var userExists = await _db.Users.AnyAsync(u => u.Id == booking.UserId, cancellationToken);
        var eventType = await _db.EventTypes.FirstOrDefaultAsync(e => e.Id == booking.EventTypeId, cancellationToken);
        if (!userExists || eventType is null)
        {
            return null;
        }

        booking.Status = BookingStatus.Pending;
        booking.CreatedAt = DateTime.UtcNow;
        booking.TotalPrice = CalculateTotalPrice(eventType.BasePrice, booking.Duration, booking.GuestCount);

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(booking.Id, cancellationToken);
    }

    public async Task<Booking?> UpdateAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == booking.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var eventType = await _db.EventTypes.FirstOrDefaultAsync(e => e.Id == booking.EventTypeId, cancellationToken);
        if (eventType is null)
        {
            return null;
        }

        existing.EventTypeId = booking.EventTypeId;
        existing.EventDate = booking.EventDate;
        existing.StartTime = booking.StartTime;
        existing.Duration = booking.Duration;
        existing.GuestCount = booking.GuestCount;
        existing.SpecialRequests = booking.SpecialRequests;
        existing.TotalPrice = CalculateTotalPrice(eventType.BasePrice, existing.Duration, existing.GuestCount);

        await _db.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(existing.Id, cancellationToken);
    }

    public async Task<Booking?> ChangeStatusAsync(int id, BookingStatus status, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Status = status;
        await _db.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        _db.Bookings.Remove(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static decimal CalculateTotalPrice(decimal basePrice, int duration, int guestCount)
    {
        return basePrice + (duration * 150m) + (guestCount * 10m);
    }
}
