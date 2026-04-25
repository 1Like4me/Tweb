using MyApp.Domain.Entities;
using MyApp.Domain.Models.User;

namespace MyApp.BusinessLayer.Interfaces;

public interface IUserAction
{
    Task<IEnumerable<UserDetailDto>> GetAllUsersActionAsync(CancellationToken cancellationToken = default);
    Task<UserDetailDto?> GetUserByIdActionAsync(int id, CancellationToken cancellationToken = default);
    Task<UserDetailDto> CreateUserActionAsync(User user, CancellationToken cancellationToken = default);
    Task<UserDetailDto?> UpdateUserActionAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> DeleteUserActionAsync(int id, CancellationToken cancellationToken = default);
}
