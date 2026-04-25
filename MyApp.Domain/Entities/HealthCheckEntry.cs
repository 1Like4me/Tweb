namespace MyApp.Domain.Entities;

public enum HealthState
{
    Ok = 1
}

public class HealthCheckEntry
{
    public Guid Id { get; set; }
    public HealthState State { get; set; }
    public DateTime TimestampUtc { get; set; }
}
