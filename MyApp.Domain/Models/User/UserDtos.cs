using System.ComponentModel.DataAnnotations;

namespace MyApp.Domain.Models.User;

public class UserCreateDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
}

public class UserUpdateDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
}

public class UserDetailDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public bool IsEmailVerified { get; set; }
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
}

public class UserRoleUpdateDto
{
    [Required]
    [RegularExpression("^(User|Admin)$", ErrorMessage = "Role must be 'User' or 'Admin'")]
    public string Role { get; set; } = "User";
}

public class EmailVerificationDto
{
    [Required]
    public string Code { get; set; } = string.Empty;
}
