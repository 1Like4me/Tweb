using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.Booking;

public class BookingCreateDto
{
    [Required(ErrorMessage = "UserId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive number.")]
    public int UserId { get; set; }

    [Required(ErrorMessage = "EventTypeId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "EventTypeId must be a positive number.")]
    public int EventTypeId { get; set; }

    [Required(ErrorMessage = "EventDate is required.")]
    [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "EventDate must be in format YYYY-MM-DD.")]
    public string EventDate { get; set; } = string.Empty;

    [Required(ErrorMessage = "StartTime is required.")]
    [RegularExpression(@"^\d{2}:\d{2}(:\d{2})?$", ErrorMessage = "StartTime must be in format HH:MM or HH:MM:SS.")]
    public string StartTime { get; set; } = string.Empty;

    [Required(ErrorMessage = "Duration is required.")]
    [Range(1, 720, ErrorMessage = "Duration must be between 1 and 720 minutes.")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "GuestCount is required.")]
    [Range(1, 1000, ErrorMessage = "GuestCount must be between 1 and 1000.")]
    public int GuestCount { get; set; }

    [StringLength(500, ErrorMessage = "SpecialRequests cannot exceed 500 characters.")]
    public string? SpecialRequests { get; set; }
}

public class BookingUpdateDto
{
    [Required(ErrorMessage = "EventTypeId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "EventTypeId must be a positive number.")]
    public int EventTypeId { get; set; }

    [Required(ErrorMessage = "EventDate is required.")]
    [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "EventDate must be in format YYYY-MM-DD.")]
    public string EventDate { get; set; } = string.Empty;

    [Required(ErrorMessage = "StartTime is required.")]
    [RegularExpression(@"^\d{2}:\d{2}(:\d{2})?$", ErrorMessage = "StartTime must be in format HH:MM or HH:MM:SS.")]
    public string StartTime { get; set; } = string.Empty;

    [Required(ErrorMessage = "Duration is required.")]
    [Range(1, 720, ErrorMessage = "Duration must be between 1 and 720 minutes.")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "GuestCount is required.")]
    [Range(1, 1000, ErrorMessage = "GuestCount must be between 1 and 1000.")]
    public int GuestCount { get; set; }

    [StringLength(500, ErrorMessage = "SpecialRequests cannot exceed 500 characters.")]
    public string? SpecialRequests { get; set; }
}

public class BookingStatusUpdateDto
{
    [Required(ErrorMessage = "Status is required.")]
    [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
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
