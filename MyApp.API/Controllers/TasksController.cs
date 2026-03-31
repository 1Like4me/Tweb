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
public class TasksController : ControllerBase
{
    private readonly ITaskItemService _service;
    private readonly IMapper _mapper;

    public TasksController(ITaskItemService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskItemDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var entities = await _service.GetAllAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<TaskItemDetailDto>>(entities);
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TaskItemDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var entity = await _service.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<TaskItemDetailDto>(entity);
        return Ok(dto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TaskItemDetailDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] TaskItemCreateDto dto, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<TaskItem>(dto);
        var created = await _service.CreateAsync(entity, cancellationToken);
        var detail = _mapper.Map<TaskItemDetailDto>(created);
        return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] TaskItemUpdateDto dto, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<TaskItem>(dto);
        entity.Id = id;

        var updated = await _service.UpdateAsync(entity, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
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

