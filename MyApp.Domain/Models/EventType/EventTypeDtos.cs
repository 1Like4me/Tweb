using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.EventType;

public class EventTypeCreateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(0.01, 100000, ErrorMessage = "BasePrice must be between 0.01 and 100000.")]
    public decimal BasePrice { get; set; }

    [Required(ErrorMessage = "MaxCapacity is required.")]
    [Range(1, 10000, ErrorMessage = "MaxCapacity must be between 1 and 10000.")]
    public int MaxCapacity { get; set; }
}

public class EventTypeUpdateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(0.01, 100000, ErrorMessage = "BasePrice must be between 0.01 and 100000.")]
    public decimal BasePrice { get; set; }

    [Required(ErrorMessage = "MaxCapacity is required.")]
    [Range(1, 10000, ErrorMessage = "MaxCapacity must be between 1 and 10000.")]
    public int MaxCapacity { get; set; }
}

public class EventTypeDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public int MaxCapacity { get; set; }
}
