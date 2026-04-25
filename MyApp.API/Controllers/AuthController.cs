using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.Domain.Models.Auth;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;

    public AuthController(IBusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var authAction = _businessLogic.AuthAction();
            var token = await authAction.RegisterActionAsync(dto, cancellationToken);

            return Created(string.Empty, token);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during registration. Please try again later." });
        }
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var authAction = _businessLogic.AuthAction();
            var token = await authAction.LoginActionAsync(dto, cancellationToken);

            return Ok(token);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during login. Please try again later." });
        }
    }
}

