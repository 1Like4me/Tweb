using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MyApp.API.Mappings;
using MyApp.BusinessLayer;
using MyApp.DataAccess;
using MyApp.Domain;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "MyApp API", Version = "v1" });

    var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    };

    options.AddSecurityDefinition("Bearer", securityScheme);
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            securityScheme,
            Array.Empty<string>()
        }
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(ApiMappingProfile).Assembly);

// EF Core - SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=MyApp.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Business-layer services
builder.Services.AddBusinessLayer();

// CORS policy (frontend React app)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured.");
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = true
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.EventTypes.Any())
    {
        db.EventTypes.AddRange(
            new EventType { Name = "Wedding", Description = "Elegant wedding celebrations with full-service coordination.", BasePrice = 3000m, MaxCapacity = 200 },
            new EventType { Name = "Birthday Party", Description = "Intimate or grand birthday parties with custom decor.", BasePrice = 500m, MaxCapacity = 50 },
            new EventType { Name = "Corporate Event", Description = "Professional conferences, product launches, and team buildings.", BasePrice = 2000m, MaxCapacity = 100 },
            new EventType { Name = "Anniversary", Description = "Celebrate milestones with style and unforgettable ambiance.", BasePrice = 1500m, MaxCapacity = 80 },
            new EventType { Name = "Holiday Party", Description = "Festive gatherings for Christmas, New Year, and more.", BasePrice = 1000m, MaxCapacity = 60 },
            new EventType { Name = "Graduation", Description = "Mark the next chapter with a memorable celebration.", BasePrice = 800m, MaxCapacity = 70 }
        );
        db.SaveChanges();
    }

    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User
            {
                Username = "admin@venue.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Username = "user@venue.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            }
        );
        db.SaveChanges();
    }
    else
    {
        var usersNeedingRoleFix = db.Users.Where(u => (int)u.Role == 0).ToList();
        foreach (var user in usersNeedingRoleFix)
        {
            user.Role = user.Username.Equals("admin@venue.com", StringComparison.OrdinalIgnoreCase)
                ? UserRole.Admin
                : UserRole.User;
        }

        if (usersNeedingRoleFix.Count > 0)
        {
            db.SaveChanges();
        }
    }
}

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
