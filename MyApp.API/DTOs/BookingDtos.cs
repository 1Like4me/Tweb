namespace MyApp.API.DTOs;

public class BookingCreateDto
{
    public int UserId { get; set; }
    public int EventTypeId { get; set; }
    public string EventDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int GuestCount { get; set; }
    public string? SpecialRequests { get; set; }
}

public class BookingUpdateDto
{
    public int EventTypeId { get; set; }
    public string EventDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int GuestCount { get; set; }
    public string? SpecialRequests { get; set; }
}

public class BookingStatusUpdateDto
{
    public string Status { get; set; } = "pending";
}

public class BookingDetailDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventTypeId { get; set; }
    public string EventTypeName { get; set; } = string.Empty;
    public string EventDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int GuestCount { get; set; }
    public string? SpecialRequests { get; set; }
    public string Status { get; set; } = "pending";
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
}
