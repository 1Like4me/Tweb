using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.User;

namespace MyApp.BusinessLayer.Core;

public class UserActions
{
    private readonly AppDbContext _db;

    public UserActions(AppDbContext db)
    {
        _db = db;
    }

    internal async Task<IEnumerable<UserDetailDto>> GetAllUsersActionExecution(CancellationToken cancellationToken = default)
    {
        var users = await _db.Users.AsNoTracking().ToListAsync(cancellationToken);
        return users.Select(MapUserToDetailDto);
    }

    internal async Task<UserDetailDto?> GetUserByIdActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        return user is null ? null : MapUserToDetailDto(user);
    }

    internal async Task<UserDetailDto> CreateUserActionExecution(User user, CancellationToken cancellationToken = default)
    {
        user.CreatedAt = DateTime.UtcNow;
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);
        return MapUserToDetailDto(user);
    }

    internal async Task<UserDetailDto?> UpdateUserActionExecution(User user, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id == user.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Username = user.Username;
        await _db.SaveChangesAsync(cancellationToken);
        return MapUserToDetailDto(existing);
    }

    internal async Task<bool> DeleteUserActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        _db.Users.Remove(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static UserDetailDto MapUserToDetailDto(User user)
    {
        return new UserDetailDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt
        };
    }
}
