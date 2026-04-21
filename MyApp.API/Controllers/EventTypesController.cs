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
public class EventTypesController : ControllerBase
{
    private readonly IEventTypeService _service;
    private readonly IMapper _mapper;

    public EventTypesController(IEventTypeService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventTypeDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var entities = await _service.GetAllAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<EventTypeDetailDto>>(entities);
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EventTypeDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var entity = await _service.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<EventTypeDetailDto>(entity);
        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(EventTypeDetailDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] EventTypeCreateDto dto, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<EventType>(dto);
        var created = await _service.CreateAsync(entity, cancellationToken);
        var detail = _mapper.Map<EventTypeDetailDto>(created);
        return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] EventTypeUpdateDto dto, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<EventType>(dto);
        entity.Id = id;

        var updated = await _service.UpdateAsync(entity, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        return NoContent();
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
