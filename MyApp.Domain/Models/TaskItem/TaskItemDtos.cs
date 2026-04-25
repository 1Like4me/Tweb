using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.TaskItem;

public class TaskItemCreateDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Priority is required.")]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Status is required.")]
    public string Status { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    [Required(ErrorMessage = "AssignedUserId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "AssignedUserId must be a positive number.")]
    public int AssignedUserId { get; set; }

    [Required(ErrorMessage = "ProjectId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a positive number.")]
    public int ProjectId { get; set; }
}

public class TaskItemUpdateDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Priority is required.")]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Status is required.")]
    public string Status { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }
}

public class TaskItemDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public int AssignedUserId { get; set; }
    public int ProjectId { get; set; }
}

