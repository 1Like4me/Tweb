using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.BusinessLayer;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.User;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _db;

    public UsersController(IBusinessLogic businessLogic, IWebHostEnvironment env, AppDbContext db)
    {
        _businessLogic = businessLogic;
        _env = env;
        _db = db;
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
                Email = string.IsNullOrWhiteSpace(dto.Email) ? dto.Username : dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                ProfilePictureUrl = dto.ProfilePictureUrl,
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

            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            if (existing is null)
            {
                return NotFound(new { message = "User not found." });
            }

            // If email is changed, they must verify again
            if (existing.Email != dto.Email)
            {
                existing.IsEmailVerified = false;
                existing.EmailVerificationCode = null;
            }

            existing.Username = dto.Username;
            existing.Email = dto.Email;
            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.ProfilePictureUrl = dto.ProfilePictureUrl;

            await _db.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the user." });
        }
    }

    [HttpPut("{id:int}/role")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UserRoleUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.Role = dto.Role.ToLower() == "admin" ? UserRole.Admin : UserRole.User;
            await _db.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the user role." });
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

    [HttpPost("{id:int}/upload-picture")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadProfilePicture(int id, IFormFile file, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
        {
            return Forbid();
        }

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound(new { message = "User not found." });

        var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "users");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileExtension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"user_{id}_{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
        var fileUrl = $"{baseUrl}/uploads/users/{uniqueFileName}";

        user.ProfilePictureUrl = fileUrl;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new { url = fileUrl });
    }

    [HttpPost("{id:int}/send-verification")]
    public async Task<IActionResult> SendVerificationEmail(int id, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
        {
            return Forbid();
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound(new { message = "User not found." });

        if (user.IsEmailVerified)
            return BadRequest(new { message = "Email is already verified." });

        // Generate a 6-digit code
        var code = new Random().Next(100000, 999999).ToString();
        user.EmailVerificationCode = code;
        await _db.SaveChangesAsync(cancellationToken);

        // Simulate sending email by writing to console
        Console.WriteLine($"[EMAIL MOCK] To: {user.Email}, Subject: Verify your email, Body: Your verification code is: {code}");

        return Ok(new { message = "Verification code sent.", mockCode = code }); // Included mockCode for easier frontend demo purposes
    }

    [HttpPost("{id:int}/verify-email")]
    public async Task<IActionResult> VerifyEmail(int id, [FromBody] EmailVerificationDto dto, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && (!int.TryParse(userIdClaim, out var callerId) || callerId != id))
        {
            return Forbid();
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound(new { message = "User not found." });

        if (user.IsEmailVerified)
            return BadRequest(new { message = "Email is already verified." });

        if (user.EmailVerificationCode != dto.Code)
            return BadRequest(new { message = "Invalid verification code." });

        user.IsEmailVerified = true;
        user.EmailVerificationCode = null;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Email verified successfully." });
    }
}





