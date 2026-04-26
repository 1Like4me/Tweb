using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.User;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;

    public UsersController(IBusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<UserDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var userAction = _businessLogic.UserAction();
            var dtos = await userAction.GetAllUsersActionAsync(cancellationToken);
            return Ok(dtos);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving users." });
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
            {
                return Forbid();
            }

            var userAction = _businessLogic.UserAction();
            var dto = await userAction.GetUserByIdActionAsync(id, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(dto);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the user." });
        }
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user session." });
            }

            var userAction = _businessLogic.UserAction();
            var dto = await userAction.GetUserByIdActionAsync(userId, cancellationToken);
            if (dto is null)
            {
                return NotFound(new { message = "User profile not found." });
            }

            return Ok(dto);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving your profile." });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Username))
            {
                return BadRequest(new { message = "Username is required." });
            }

            var entity = new User
            {
                Username = dto.Username,
                PasswordHash = "external-auth-user",
                Role = dto.Username.Equals("admin@venue.com", StringComparison.OrdinalIgnoreCase)
                    ? UserRole.Admin
                    : UserRole.User
            };

            var userAction = _businessLogic.UserAction();
            var detail = await userAction.CreateUserActionAsync(entity, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the user." });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
            {
                return Forbid();
            }

            if (string.IsNullOrWhiteSpace(dto.Username))
            {
                return BadRequest(new { message = "Username is required." });
            }

            var userAction = _businessLogic.UserAction();
            var existing = await userAction.GetUserByIdActionAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "User not found." });
            }

            var entity = new User
            {
                Id = id,
                Username = dto.Username,
                PasswordHash = existing.Role == "admin" ? "admin" : "user", // Preserve existing hash
                Role = existing.Role == "admin" ? UserRole.Admin : UserRole.User
            };

            var updated = await userAction.UpdateUserActionAsync(entity, cancellationToken);
            if (updated is null)
            {
                return NotFound(new { message = "User not found." });
            }

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the user." });
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
            var userAction = _businessLogic.UserAction();
            var deleted = await userAction.DeleteUserActionAsync(id, cancellationToken);
            if (!deleted)
            {
                return NotFound(new { message = "User not found." });
            }

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the user." });
        }
    }
}




