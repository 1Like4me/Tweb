namespace MyApp.Domain.Entities;

public enum UserRole
{
    User = 1,
    Admin = 2
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; }

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}
