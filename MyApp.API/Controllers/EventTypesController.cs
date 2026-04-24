using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.EventType;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventTypesController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public EventTypesController(AppDbContext db, IConfiguration configuration)
    {
        _businessLogic = new BusinessLogic(db, configuration);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventTypeDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var eventTypeAction = _businessLogic.EventTypeAction();
            var dtos = await eventTypeAction.GetAllEventTypesActionAsync(cancellationToken);
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving event types." });
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EventTypeDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var eventTypeAction = _businessLogic.EventTypeAction();
            var dto = await eventTypeAction.GetEventTypeByIdActionAsync(id, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "Event type not found." });
            }

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the event type." });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(EventTypeDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] EventTypeCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var entity = new EventType
            {
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                MaxCapacity = dto.MaxCapacity
            };

            var eventTypeAction = _businessLogic.EventTypeAction();
            var detail = await eventTypeAction.CreateEventTypeActionAsync(entity, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the event type." });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] EventTypeUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var eventTypeAction = _businessLogic.EventTypeAction();
            var existing = await eventTypeAction.GetEventTypeByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Event type not found." });
            }

            var entity = new EventType
            {
                Id = id,
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                MaxCapacity = dto.MaxCapacity
            };

            var updated = await eventTypeAction.UpdateEventTypeActionAsync(entity, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "Event type not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the event type." });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        try
        {
            var eventTypeAction = _businessLogic.EventTypeAction();
            var deleted = await eventTypeAction.DeleteEventTypeActionAsync(id, cancellationToken);
            if (!deleted)
            {
                return NotFound(new { message = "Event type not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the event type." });
        }
    }
}
