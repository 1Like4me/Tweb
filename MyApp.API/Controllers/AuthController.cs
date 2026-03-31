using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApp.API.DTOs;
using MyApp.BusinessLayer.Auth;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;

    public AuthController(IAuthService authService, IMapper mapper)
    {
        _authService = authService;
        _mapper = mapper;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var blDto = new RegisterDtoBl
            {
                Username = dto.Username,
                Password = dto.Password
            };

            var tokenBl = await _authService.RegisterAsync(blDto, cancellationToken);
            var tokenApi = new TokenResponseDto
            {
                Token = tokenBl.Token,
                ExpiresAt = tokenBl.ExpiresAt
            };

            return Created(string.Empty, tokenApi);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var blDto = new LoginDtoBl
            {
                Username = dto.Username,
                Password = dto.Password
            };

            var tokenBl = await _authService.LoginAsync(blDto, cancellationToken);
            var tokenApi = new TokenResponseDto
            {
                Token = tokenBl.Token,
                ExpiresAt = tokenBl.ExpiresAt
            };

            return Ok(tokenApi);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}

