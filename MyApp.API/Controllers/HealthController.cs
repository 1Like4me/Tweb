using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.DataAccess;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;
    private readonly IHealthService _healthService;

    public HealthController(AppDbContext db, IConfiguration configuration)
    {
        _businessLogic = new BusinessLogic(db, configuration);
        _healthService = new HealthService();
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult Get()
    {
        try
        {
            return Ok(new
            {
                status = _healthService.GetStatus(),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Health check failed." });
        }
    }
}

