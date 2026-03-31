namespace MyApp.Domain;

public class TaskItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = default!;
}

