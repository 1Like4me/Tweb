namespace MyApp.Domain.Entities;

public enum BookingStatus
{
    Pending = 1,
    Confirmed = 2,
    Cancelled = 3
}

public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventTypeId { get; set; }
    public DateOnly EventDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public int Duration { get; set; }
    public int GuestCount { get; set; }
    public string? SpecialRequests { get; set; }
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = default!;
    public EventType EventType { get; set; } = default!;
}
