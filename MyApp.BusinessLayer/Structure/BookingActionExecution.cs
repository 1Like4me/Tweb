using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Booking;

namespace MyApp.BusinessLayer.Structure;

public class BookingActionExecution : BookingActions, IBookingAction
{
    public BookingActionExecution(AppDbContext db) : base(db) { }

    public Task<IEnumerable<BookingDetailDto>> GetAllBookingsActionAsync(int? userId = null, CancellationToken cancellationToken = default)
    {
        return GetAllBookingsActionExecution(userId, cancellationToken);
    }

    public Task<BookingDetailDto?> GetBookingByIdActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return GetBookingByIdActionExecution(id, cancellationToken);
    }

    public Task<BookingDetailDto?> CreateBookingActionAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        return CreateBookingActionExecution(booking, cancellationToken);
    }

    public Task<BookingDetailDto?> UpdateBookingActionAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        return UpdateBookingActionExecution(booking, cancellationToken);
    }

    public Task<BookingDetailDto?> ChangeBookingStatusActionAsync(int id, BookingStatus status, CancellationToken cancellationToken = default)
    {
        return ChangeBookingStatusActionExecution(id, status, cancellationToken);
    }

    public Task<bool> DeleteBookingActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return DeleteBookingActionExecution(id, cancellationToken);
    }
}
