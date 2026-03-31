namespace MyApp.BusinessLayer.Auth;

public class RegisterDtoBl
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginDtoBl
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class TokenResponseDtoBl
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

