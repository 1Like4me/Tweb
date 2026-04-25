## MyApp Backend (.NET 8) Overview

This repo contains a React/Tweb frontend plus a **separate ASP.NET Core Web API backend** scaffolded under the `MyApp.*` projects.

Backend solution layout:
- `MyApp.sln` – solution file
- `MyApp.API` – ASP.NET Core Web API (controllers, DTOs, AutoMapper, DI, Swagger)
- `MyApp.Domain` – entities and enums (pure domain model)
- `MyApp.BusinessLayer` – service interfaces/implementations (currently minimal placeholders)
- `MyApp.DataAccess` – EF Core `DbContext` + configuration and migrations

The backend is intentionally minimal: **no authentication/JWT behavior yet**, only DTOs and health checks.

---

## Tech stack

- **Runtime**: .NET 8
- **Web API**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 8
- **Database**: SQLite (`MyApp.db` file)
- **Docs**: Swagger / OpenAPI (via Swashbuckle)
- **Mapping**: AutoMapper

---

## Projects and dependencies

Project dependency chain:

- `MyApp.API` → `MyApp.BusinessLayer` → `MyApp.DataAccess` → `MyApp.Domain`

Key package references:

- `MyApp.API`
  - `Microsoft.EntityFrameworkCore.Sqlite` 8.0.23
  - `Microsoft.EntityFrameworkCore.SqlServer` 8.0.23 (not currently used; kept for flexibility)
  - `Microsoft.EntityFrameworkCore.Design` 8.0.23
  - `Swashbuckle.AspNetCore` 6.6.2
  - `AutoMapper.Extensions.Microsoft.DependencyInjection` 12.0.1
- `MyApp.DataAccess`
  - `Microsoft.EntityFrameworkCore` 8.0.23
  - `Microsoft.EntityFrameworkCore.Relational` 8.0.23
  - `Microsoft.EntityFrameworkCore.SqlServer` 8.0.23
  - `Microsoft.EntityFrameworkCore.Sqlite` 8.0.23
  - `Microsoft.EntityFrameworkCore.Design` 8.0.23

---

## Domain model (MyApp.Domain)

Entities:

- `User`
  - `Id` (int)
  - `Username` (string, required)
  - `PasswordHash` (string, required)
  - `CreatedAt` (DateTime)
  - `Projects` (`ICollection<Project>`)
- `Project`
  - `Id` (int)
  - `Name` (string, required)
  - `CreatedAt` (DateTime)
  - `UserId` (int, FK → `User`)
  - `User` (nav)
  - `Tasks` (`ICollection<TaskItem>`)
- `TaskItem`
  - `Id` (int)
  - `Name` (string, required)
  - `CreatedAt` (DateTime)
  - `ProjectId` (int, FK → `Project`)
  - `Project` (nav)
- `HealthCheckEntry`
  - `Id` (Guid)
  - `State` (enum `HealthState` – currently only `Ok`)
  - `TimestampUtc` (DateTime)

Relationships (configured in `AppDbContext`):

- `User` 1–many `Project` (cascade delete)
- `Project` 1–many `TaskItem` (cascade delete)

---

## Data access (MyApp.DataAccess)

`AppDbContext`:

- `DbSet<HealthCheckEntry> HealthChecks`
- `DbSet<User> Users`
- `DbSet<Project> Projects`
- `DbSet<TaskItem> Tasks`

Configuration highlights:

- Requires `User.Username` and `User.PasswordHash`
- Requires `Project.Name` and `TaskItem.Name`
- Sets `User` → `Project` and `Project` → `TaskItem` as required FKs with cascade delete.

Database provider:

- Uses **SQLite** with connection string:

  ```csharp
  var connectionString = "Data Source=MyApp.db";
  options.UseSqlite(connectionString);
  ```

---

## API layer (MyApp.API)

### Program.cs

- Registers controllers and Swagger:

  ```csharp
  builder.Services.AddControllers();
  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();
  ```

- Registers AutoMapper:

  ```csharp
  builder.Services.AddAutoMapper(typeof(ApiMappingProfile).Assembly);
  ```

- Registers EF Core DbContext with SQLite:

  ```csharp
  var connectionString = "Data Source=MyApp.db";

  builder.Services.AddDbContext<AppDbContext>(options =>
      options.UseSqlite(connectionString));
  ```

- Always exposes Swagger UI:

  ```csharp
  app.UseSwagger();
  app.UseSwaggerUI();
  app.MapControllers();
  ```

### Health endpoint

- `Controllers/HealthController.cs`
- Route: `GET /api/health`
- Response shape:

  ```json
  {
    "status": "OK",
    "timestamp": "<current UTC timestamp>"
  }
  ```

Swagger:

- Health endpoint appears automatically in Swagger at `/swagger`.

---

## DTO conventions and mapping

**Important:** The API is designed to **never return raw EF entities**.

### DTOs (MyApp.API/DTOs)

- User:
  - `UserCreateDto`: `Username`
  - `UserUpdateDto`: `Username`
  - `UserDetailDto`: `Id`, `Username`, `CreatedAt`
- Project:
  - `ProjectCreateDto`: `Name`, `UserId`
  - `ProjectUpdateDto`: `Name`
  - `ProjectDetailDto`: `Id`, `Name`, `CreatedAt`, `UserId`
- TaskItem:
  - `TaskItemCreateDto`: `Name`, `ProjectId`
  - `TaskItemUpdateDto`: `Name`
  - `TaskItemDetailDto`: `Id`, `Name`, `CreatedAt`, `ProjectId`
- Auth:
  - `RegisterDto`: `Username`, `Password`
  - `LoginDto`: `Username`, `Password`
  - `TokenResponseDto`: `Token`, `ExpiresAt`

### AutoMapper profile (MyApp.API/Mappings/ApiMappingProfile.cs)

Maps between entities and DTOs:

- User:
  - `User` → `UserDetailDto`
  - `UserCreateDto` → `User`
  - `UserUpdateDto` → `User`
- Project:
  - `Project` → `ProjectDetailDto`
  - `ProjectCreateDto` → `Project`
  - `ProjectUpdateDto` → `Project`
- TaskItem:
  - `TaskItem` → `TaskItemDetailDto`
  - `TaskItemCreateDto` → `TaskItem`
  - `TaskItemUpdateDto` → `TaskItem`

Usage hint (for future controllers):

```csharp
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ProjectsController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    // Example:
    // var detail = _mapper.Map<ProjectDetailDto>(projectEntity);
}
```

---

## Authentication status

Current state:

- `User` entity has `Username` and `PasswordHash` prepared for auth.
- DTOs for auth (`RegisterDto`, `LoginDto`, `TokenResponseDto`) exist.
- **No JWT or auth middleware is configured yet.**
  - No `AddAuthentication`, `AddJwtBearer`, or `[Authorize]` attributes.
  - No login/register endpoints.

This makes it easy to add JWT later without changing the domain model or DTO contracts.

---

## How to build and run the backend

From the repo root (`D:\GitHub\Tweb`):

```bash
dotnet restore
dotnet build "MyApp.sln"
dotnet run --project "MyApp.API/MyApp.API.csproj" --launch-profile http
```

Default URLs (from launch settings):

- Swagger UI: `http://localhost:5085/swagger`
- Health endpoint: `http://localhost:5085/api/health`

---

## Database and migrations (SQLite)

Provider:

- SQLite database file `MyApp.db` created in the API working directory.

When the model changes (entities/relationships):

1. **Add a migration**:

   ```bash
   dotnet ef migrations add SomeDescriptiveName --context AppDbContext --project MyApp.DataAccess --startup-project MyApp.API
   ```

2. **Apply migrations to the database**:

   ```bash
   dotnet ef database update --context AppDbContext --project MyApp.DataAccess --startup-project MyApp.API
   ```

If you ever need to revert a migration before applying:

```bash
dotnet ef migrations remove --project MyApp.DataAccess --startup-project MyApp.API
```

---

## Summary of key backend changes (for tracking)

- Created solution `MyApp.sln` and projects `MyApp.API`, `MyApp.Domain`, `MyApp.BusinessLayer`, `MyApp.DataAccess`.
- Configured EF Core with **SQLite** and `AppDbContext` (`User`, `Project`, `TaskItem`, `HealthCheckEntry`).
- Defined domain entities in `MyApp.Domain` and relationships in `MyApp.DataAccess`.
- Added **DTOs** for `User`, `Project`, `TaskItem`, and auth operations (register/login/token).
- Integrated **AutoMapper** via `ApiMappingProfile` and service registration in `Program.cs`.
- Added a minimal `HealthController` (`GET /api/health`) and Swagger docs.
- Ensured the API design is DTO-first; controllers should **not expose raw entities**.

