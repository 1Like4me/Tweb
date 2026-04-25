namespace MyApp.Domain.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public int AssignedUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateOnly? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Project Project { get; set; } = default!;
    public User User { get; set; } = default!;
}
