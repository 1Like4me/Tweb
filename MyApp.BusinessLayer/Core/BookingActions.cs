using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Booking;

namespace MyApp.BusinessLayer.Core;

public class BookingActions
{
    private readonly AppDbContext _db;

    public BookingActions(AppDbContext db)
    {
        _db = db;
    }

    internal async Task<IEnumerable<BookingDetailDto>> GetAllBookingsActionExecution(int? userId = null, CancellationToken cancellationToken = default)
    {
        var query = _db.Bookings
            .AsNoTracking()
            .Include(b => b.EventType)
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(b => b.UserId == userId.Value);
        }

        var bookings = await query.OrderByDescending(b => b.CreatedAt).ToListAsync(cancellationToken);
        return bookings.Select(MapBookingToDetailDto);
    }

    internal async Task<BookingDetailDto?> GetBookingByIdActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var booking = await _db.Bookings
            .AsNoTracking()
            .Include(b => b.EventType)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        return booking is null ? null : MapBookingToDetailDto(booking);
    }

    internal async Task<BookingDetailDto?> CreateBookingActionExecution(Booking booking, CancellationToken cancellationToken = default)
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
        return await GetBookingByIdActionExecution(booking.Id, cancellationToken);
    }

    internal async Task<BookingDetailDto?> UpdateBookingActionExecution(Booking booking, CancellationToken cancellationToken = default)
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
        existing.CustomMenu = booking.CustomMenu;
        existing.TotalPrice = CalculateTotalPrice(eventType.BasePrice, existing.Duration, existing.GuestCount);

        await _db.SaveChangesAsync(cancellationToken);
        return await GetBookingByIdActionExecution(existing.Id, cancellationToken);
    }

    internal async Task<BookingDetailDto?> ChangeBookingStatusActionExecution(int id, BookingStatus status, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Status = status;
        await _db.SaveChangesAsync(cancellationToken);
        return await GetBookingByIdActionExecution(id, cancellationToken);
    }

    internal async Task<bool> DeleteBookingActionExecution(int id, CancellationToken cancellationToken = default)
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

    private static BookingDetailDto MapBookingToDetailDto(Booking booking)
    {
        return new BookingDetailDto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            EventTypeId = booking.EventTypeId,
            EventTypeName = booking.EventType?.Name ?? string.Empty,
            EventDate = booking.EventDate.ToString("yyyy-MM-dd"),
            StartTime = booking.StartTime.ToString("HH:mm"),
            Duration = booking.Duration,
            GuestCount = booking.GuestCount,
            SpecialRequests = booking.SpecialRequests,
            CustomMenu = booking.CustomMenu,
            Status = booking.Status.ToString().ToLower(),
            TotalPrice = booking.TotalPrice,
            CreatedAt = booking.CreatedAt
        };
    }
}
