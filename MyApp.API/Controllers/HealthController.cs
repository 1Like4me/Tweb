using Microsoft.AspNetCore.Mvc;
using MyApp.BusinessLayer;

namespace MyApp.API.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly IHealthService _healthService;

    public HealthController(IHealthService healthService)
    {
        _healthService = healthService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = _healthService.GetStatus(),
            timestamp = DateTime.UtcNow
        });
    }
}

