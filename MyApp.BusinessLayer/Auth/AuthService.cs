using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyApp.DataAccess;
using MyApp.Domain.Entities;

namespace MyApp.BusinessLayer.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<TokenResponseDtoBl> RegisterAsync(RegisterDtoBl dto, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == dto.Username, cancellationToken);

        if (existing is not null)
        {
            throw new InvalidOperationException("Username is already taken.");
        }

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Username.Equals("admin@venue.com", StringComparison.OrdinalIgnoreCase)
                ? UserRole.Admin
                : UserRole.User,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return GenerateToken(user);
    }

    public async Task<TokenResponseDtoBl> LoginAsync(LoginDtoBl dto, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username, cancellationToken);
        if (user is null)
        {
            throw new InvalidOperationException("Invalid username or password.");
        }

        var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!valid)
        {
            throw new InvalidOperationException("Invalid username or password.");
        }

        return GenerateToken(user);
    }

    private TokenResponseDtoBl GenerateToken(User user)
    {
        var key = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException("JWT configuration is missing (Jwt:Key / Jwt:Issuer / Jwt:Audience).");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddHours(1);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Username),
            new Claim("email", user.Username),
            new Claim("username", user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        var handler = new JwtSecurityTokenHandler();

        return new TokenResponseDtoBl
        {
            Token = handler.WriteToken(token),
            ExpiresAt = expires
        };
    }
}

