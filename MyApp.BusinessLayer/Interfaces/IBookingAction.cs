using MyApp.Domain.Entities;
using MyApp.Domain.Models.Booking;

namespace MyApp.BusinessLayer.Interfaces;

public interface IBookingAction
{
    Task<IEnumerable<BookingDetailDto>> GetAllBookingsActionAsync(int? userId = null, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> GetBookingByIdActionAsync(int id, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> CreateBookingActionAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> UpdateBookingActionAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<BookingDetailDto?> ChangeBookingStatusActionAsync(int id, BookingStatus status, CancellationToken cancellationToken = default);
    Task<bool> DeleteBookingActionAsync(int id, CancellationToken cancellationToken = default);
}
