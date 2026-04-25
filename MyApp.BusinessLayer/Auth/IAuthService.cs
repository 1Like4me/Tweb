namespace MyApp.BusinessLayer.Auth;

public interface IAuthService
{
    Task<TokenResponseDtoBl> RegisterAsync(RegisterDtoBl dto, CancellationToken cancellationToken = default);
    Task<TokenResponseDtoBl> LoginAsync(LoginDtoBl dto, CancellationToken cancellationToken = default);
}

