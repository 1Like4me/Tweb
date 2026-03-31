namespace MyApp.API.DTOs;

public class TaskItemCreateDto
{
    public string Name { get; set; } = string.Empty;
    public int ProjectId { get; set; }
}

public class TaskItemUpdateDto
{
    public string Name { get; set; } = string.Empty;
}

public class TaskItemDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ProjectId { get; set; }
}

