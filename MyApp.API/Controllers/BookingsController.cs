using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.API.DTOs;
using MyApp.BusinessLayer.Crud;
using MyApp.Domain;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _service;
    private readonly IMapper _mapper;

    public BookingsController(IBookingService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BookingDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int? userId, CancellationToken cancellationToken)
    {
        var isAdmin = User.IsInRole("Admin");
        var callerUserIdClaim = User.FindFirst("userId")?.Value;
        var callerUserId = int.TryParse(callerUserIdClaim, out var parsedUserId) ? parsedUserId : (int?)null;

        if (!isAdmin && !callerUserId.HasValue)
        {
            return Unauthorized();
        }

        var effectiveUserId = isAdmin ? userId : callerUserId;
        var entities = await _service.GetAllAsync(effectiveUserId, cancellationToken);
        var dtos = _mapper.Map<IEnumerable<BookingDetailDto>>(entities);
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var entity = await _service.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var isAdmin = User.IsInRole("Admin");
        var callerUserIdClaim = User.FindFirst("userId")?.Value;
        if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != entity.UserId))
        {
            return Forbid();
        }

        var dto = _mapper.Map<BookingDetailDto>(entity);
        return Ok(dto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] BookingCreateDto dto, CancellationToken cancellationToken)
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

        var entity = _mapper.Map<Booking>(dto);
        entity.EventDate = eventDate;
        entity.StartTime = startTime;

        var created = await _service.CreateAsync(entity, cancellationToken);
        if (created is null)
        {
            return BadRequest(new { message = "Invalid user or event type for booking." });
        }

        var detail = _mapper.Map<BookingDetailDto>(created);
        return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] BookingUpdateDto dto, CancellationToken cancellationToken)
    {
        if (!DateOnly.TryParse(dto.EventDate, out var eventDate) || !TimeOnly.TryParse(dto.StartTime, out var startTime))
        {
            return BadRequest(new { message = "Invalid event date or start time format." });
        }

        var existing = await _service.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var isAdmin = User.IsInRole("Admin");
        var callerUserIdClaim = User.FindFirst("userId")?.Value;
        if (!isAdmin && (!int.TryParse(callerUserIdClaim, out var callerUserId) || callerUserId != existing.UserId))
        {
            return Forbid();
        }

        var entity = _mapper.Map<Booking>(dto);
        entity.Id = id;
        entity.UserId = existing.UserId;
        entity.EventDate = eventDate;
        entity.StartTime = startTime;

        var updated = await _service.UpdateAsync(entity, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        var detail = _mapper.Map<BookingDetailDto>(updated);
        return Ok(detail);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] BookingStatusUpdateDto dto, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<BookingStatus>(dto.Status, true, out var status))
        {
            return BadRequest(new { message = "Invalid booking status." });
        }

        var updated = await _service.ChangeStatusAsync(id, status, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        var detail = _mapper.Map<BookingDetailDto>(updated);
        return Ok(detail);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
