using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.Project;

public class ProjectCreateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 200 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "UserId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive number.")]
    public int UserId { get; set; }
}

public class ProjectUpdateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 200 characters.")]
    public string Name { get; set; } = string.Empty;
}

public class ProjectDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
}
