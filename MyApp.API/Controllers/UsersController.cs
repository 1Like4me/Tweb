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
public class UsersController : ControllerBase
{
    private readonly IUserService _service;
    private readonly IMapper _mapper;

    public UsersController(IUserService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<UserDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var entities = await _service.GetAllAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<UserDetailDto>>(entities);
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
        {
            return Forbid();
        }

        var entity = await _service.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<UserDetailDto>(entity);
        return Ok(dto);
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var entity = await _service.GetByIdAsync(userId, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<UserDetailDto>(entity);
        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto, CancellationToken cancellationToken)
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

        var created = await _service.CreateAsync(entity, cancellationToken);
        var detail = _mapper.Map<UserDetailDto>(created);
        return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto, CancellationToken cancellationToken)
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

        var entity = new User
        {
            Id = id,
            Username = dto.Username
        };

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

