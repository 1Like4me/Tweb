using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.User;

public class UserCreateDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
    public string Username { get; set; } = string.Empty;
}

public class UserUpdateDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
    public string Username { get; set; } = string.Empty;
}

public class UserDetailDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
}
