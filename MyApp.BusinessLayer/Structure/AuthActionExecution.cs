using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Models.Auth;

namespace MyApp.BusinessLayer.Structure;

public class AuthActionExecution : AuthActions, IAuthAction
{
    public AuthActionExecution(AppDbContext db, Microsoft.Extensions.Configuration.IConfiguration configuration) 
        : base(db, configuration) { }

    public Task<TokenResponseDto> RegisterActionAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        return RegisterActionExecution(dto, cancellationToken);
    }

    public Task<TokenResponseDto> LoginActionAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        return LoginActionExecution(dto, cancellationToken);
    }
}
