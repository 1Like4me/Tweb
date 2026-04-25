using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.User;

namespace MyApp.BusinessLayer.Structure;

public class UserActionExecution : UserActions, IUserAction
{
    public UserActionExecution(AppDbContext db) : base(db) { }

    public Task<IEnumerable<UserDetailDto>> GetAllUsersActionAsync(CancellationToken cancellationToken = default)
    {
        return GetAllUsersActionExecution(cancellationToken);
    }

    public Task<UserDetailDto?> GetUserByIdActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return GetUserByIdActionExecution(id, cancellationToken);
    }

    public Task<UserDetailDto> CreateUserActionAsync(User user, CancellationToken cancellationToken = default)
    {
        return CreateUserActionExecution(user, cancellationToken);
    }

    public Task<UserDetailDto?> UpdateUserActionAsync(User user, CancellationToken cancellationToken = default)
    {
        return UpdateUserActionExecution(user, cancellationToken);
    }

    public Task<bool> DeleteUserActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return DeleteUserActionExecution(id, cancellationToken);
    }
}
