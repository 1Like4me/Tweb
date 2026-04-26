using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Booking;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;

    public BookingsController(IBusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BookingDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll([FromQuery] int? userId, CancellationToken cancellationToken)
    {
        try
        {
            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            var callerUserId = int.TryParse(callerUserIdClaim, out var parsedUserId) ? parsedUserId : (int?)null;

            if (!isAdmin && !callerUserId.HasValue)
            {
                return Unauthorized(new { message = "Invalid user session." });
            }

            var effectiveUserId = isAdmin ? userId : callerUserId;
            var bookingAction = _businessLogic.BookingAction();
            var dtos = await bookingAction.GetAllBookingsActionAsync(effectiveUserId, cancellationToken);
            return Ok(dtos);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving bookings." });
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var bookingAction = _businessLogic.BookingAction();
            var dto = await bookingAction.GetBookingByIdActionAsync(id, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != dto.UserId))
            {
                return Forbid();
            }

            return Ok(dto);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the booking." });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] BookingCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            if (!DateOnly.TryParse(dto.EventDate, out var eventDate) || !TimeOnly.TryParse(dto.StartTime, out var startTime))
            {
                return BadRequest(new { message = "Invalid event date or start time format." });
            }

            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != dto.UserId))
            {
                return Forbid();
            }

            var entity = new Booking
            {
                UserId = dto.UserId,
                EventTypeId = dto.EventTypeId,
                EventDate = eventDate,
                StartTime = startTime,
                Duration = dto.Duration,
                GuestCount = dto.GuestCount,
                SpecialRequests = dto.SpecialRequests
            };

            var bookingAction = _businessLogic.BookingAction();
            var detail = await bookingAction.CreateBookingActionAsync(entity, cancellationToken);
            if (detail is null)
            {
                return BadRequest(new { message = "Invalid user or event type for booking." });
            }

            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the booking." });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] BookingUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            if (!DateOnly.TryParse(dto.EventDate, out var eventDate) || !TimeOnly.TryParse(dto.StartTime, out var startTime))
            {
                return BadRequest(new { message = "Invalid event date or start time format." });
            }

            var bookingAction = _businessLogic.BookingAction();
            var existing = await bookingAction.GetBookingByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != existing.UserId))
            {
                return Forbid();
            }

            var entity = new Booking
            {
                Id = id,
                UserId = existing.UserId,
                EventTypeId = dto.EventTypeId,
                EventDate = eventDate,
                StartTime = startTime,
                Duration = dto.Duration,
                GuestCount = dto.GuestCount,
                SpecialRequests = dto.SpecialRequests
            };

            var updated = await bookingAction.UpdateBookingActionAsync(entity, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            return Ok(updated);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the booking." });
        }
    }

    [HttpPut("{id:int}/status")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] BookingStatusUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var bookingAction = _businessLogic.BookingAction();
            var existing = await bookingAction.GetBookingByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != existing.UserId))
            {
                return Forbid();
            }

            var status = dto.Status.ToLower() switch
            {
                "pending" => BookingStatus.Pending,
                "confirmed" => BookingStatus.Confirmed,
                "cancelled" => BookingStatus.Cancelled,
                _ => BookingStatus.Pending
            };

            var updated = await bookingAction.ChangeBookingStatusActionAsync(id, status, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            return Ok(updated);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating booking status." });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        try
        {
            var bookingAction = _businessLogic.BookingAction();
            var existing = await bookingAction.GetBookingByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            var isAdmin = User.IsInRole("Admin");
            var callerUserIdClaim = User.FindFirst("userId")?.Value;
            if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != existing.UserId))
            {
                return Forbid();
            }

            var deleted = await bookingAction.DeleteBookingActionAsync(id, cancellationToken);
            if (!deleted)
            {
                return NotFound(new { message = "Booking not found." });
            }

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the booking." });
        }
    }
}



