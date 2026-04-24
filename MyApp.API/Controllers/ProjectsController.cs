using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Project;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public ProjectsController(AppDbContext db, IConfiguration configuration)
    {
        _businessLogic = new BusinessLogic(db, configuration);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProjectDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var projectAction = _businessLogic.ProjectAction();
            var dtos = await projectAction.GetAllProjectsActionAsync(cancellationToken);
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving projects." });
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProjectDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var projectAction = _businessLogic.ProjectAction();
            var dto = await projectAction.GetProjectByIdActionAsync(id, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "Project not found." });
            }

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the project." });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProjectDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var entity = new Project
            {
                Name = dto.Name,
                UserId = dto.UserId
            };

            var projectAction = _businessLogic.ProjectAction();
            var detail = await projectAction.CreateProjectActionAsync(entity, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the project." });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var projectAction = _businessLogic.ProjectAction();
            var existing = await projectAction.GetProjectByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Project not found." });
            }

            // Authorization: Only admin or the project owner can update
            var userIdClaim = User.FindFirst("userId")?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != existing.UserId))
            {
                return Forbid();
            }

            var entity = new Project
            {
                Id = id,
                Name = dto.Name,
                UserId = existing.UserId
            };

            var updated = await projectAction.UpdateProjectActionAsync(entity, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "Project not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the project." });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        try
        {
            var projectAction = _businessLogic.ProjectAction();
            var existing = await projectAction.GetProjectByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "Project not found." });
            }

            // Authorization: Only admin or the project owner can delete
            var userIdClaim = User.FindFirst("userId")?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != existing.UserId))
            {
                return Forbid();
            }

            var deleted = await projectAction.DeleteProjectActionAsync(id, cancellationToken);
            if (!deleted)
            {
                return NotFound(new { message = "Project not found." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the project." });
        }
    }
}

