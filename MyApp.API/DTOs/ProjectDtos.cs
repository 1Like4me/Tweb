namespace MyApp.API.DTOs;

public class ProjectCreateDto
{
    public string Name { get; set; } = string.Empty;
    public int UserId { get; set; }
}

public class ProjectUpdateDto
{
    public string Name { get; set; } = string.Empty;
}

public class ProjectDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
}

