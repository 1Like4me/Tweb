using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;
using MyApp.Domain.Entities;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly IBusinessLogic _businessLogic;
    private readonly IHealthService _healthService;

    public HealthController(IBusinessLogic businessLogic, IHealthService healthService)
    {
        _businessLogic = businessLogic;
        _healthService = healthService;
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
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Health check failed." });
        }
    }
}




