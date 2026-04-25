namespace MyApp.API.DTOs;

public class UserCreateDto
{
    public string Username { get; set; } = string.Empty;
}

public class UserUpdateDto
{
    public string Username { get; set; } = string.Empty;
}

public class UserDetailDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
}

