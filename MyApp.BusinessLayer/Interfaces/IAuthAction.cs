using MyApp.Domain.Models.Auth;

namespace MyApp.BusinessLayer.Interfaces;

public interface IAuthAction
{
    Task<TokenResponseDto> RegisterActionAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<TokenResponseDto> LoginActionAsync(LoginDto dto, CancellationToken cancellationToken = default);
}
