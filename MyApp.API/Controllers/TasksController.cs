using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.Domain.Models.TaskItem;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;

    public TasksController(IBusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskItemDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var taskAction = _businessLogic.TaskItemAction();
            var dtos = await taskAction.GetAllTaskItemsActionAsync(cancellationToken);
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving tasks." });
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TaskItemDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var taskAction = _businessLogic.TaskItemAction();
            var dto = await taskAction.GetTaskItemByIdActionAsync(id, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "Task not found." });
            }

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the task." });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(TaskItemDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] TaskItemCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var entity = new TaskItem
            {
                ProjectId = dto.ProjectId,
                AssignedUserId = dto.AssignedUserId,
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = dto.Status,
                DueDate = dto.DueDate.HasValue ? DateOnly.Parse(dto.DueDate.Value.ToString("yyyy-MM-dd")) : null
            };

            var taskAction = _businessLogic.TaskItemAction();
            var detail = await taskAction.CreateTaskItemActionAsync(entity, cancellationToken);
            if (detail is null)
            {
                return BadRequest(new { message = "Invalid project or assigned user for task." });
            }

            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the task." });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] TaskItemUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var taskAction = _businessLogic.TaskItemAction();
            var existing = await taskAction.GetTaskItemByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Task not found." });
            }

            var entity = new TaskItem
            {
                Id = id,
                ProjectId = existing.ProjectId,
                AssignedUserId = existing.AssignedUserId,
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = dto.Status,
                DueDate = dto.DueDate.HasValue ? DateOnly.Parse(dto.DueDate.Value.ToString("yyyy-MM-dd")) : null
            };

            var updated = await taskAction.UpdateTaskItemActionAsync(entity, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "Task not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the task." });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        try
        {
            var taskAction = _businessLogic.TaskItemAction();
            var deleted = await taskAction.DeleteTaskItemActionAsync(id, cancellationToken);
            if (!deleted)
            {
                return NotFound(new { message = "Task not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the task." });
        }
    }
}

