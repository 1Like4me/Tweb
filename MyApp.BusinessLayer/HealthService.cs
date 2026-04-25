namespace MyApp.BusinessLayer;

public interface IHealthService
{
    string GetStatus();
}

public class HealthService : IHealthService
{
    public string GetStatus() => "OK";
}
