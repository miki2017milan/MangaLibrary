using System.Text;
using Dapper;
using MangaLibraryAPI.Database;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using MangaLibraryAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
DefaultTypeMap.MatchNamesWithUnderscores = true;

builder.Services.AddControllers();

// Configure custom services
builder.Services.AddTransient<IMangaService, MangaService>();
builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddTransient<IReadingStatusService, ReadingStatusService>();

// Configure Npgsql data source connection pool to share between EF Core for Identity Core
// and Dapper for business logic
var dataSource = new NpgsqlDataSourceBuilder(builder.Configuration["PostgresDbConnection"])
    .EnableDynamicJson()
    .Build();

builder.Services.AddSingleton(dataSource);

// Add DbContext so that EF Core can access the database unsing the shared Datasource
builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
{
    options.UseNpgsql(sp.GetRequiredService<NpgsqlDataSource>());
});

// Add DbConnectionFactory so that Dapper can access the database using the shared Datasource
builder.Services.AddSingleton<IDbConnectionFactory>(sp =>
    new DbConnectionFactory(sp.GetRequiredService<NpgsqlDataSource>()));

// Register Dapper JSON type handlers
SqlMapper.AddTypeHandler(new JsonTypeHandler<List<MangaStaff>>());

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Auth failed: " + context.Exception.Message);
            Console.WriteLine("Raw Authorization header: " + context.Request.Headers["Authorization"]);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        },
    };
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddAuthorization();

// Configure Identity
builder.Services.AddIdentityCore<ApplicationUser>(options => { options.Password.RequiredLength = 8; })
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddUserStore<UserStore<ApplicationUser, ApplicationRole, ApplicationDbContext, Guid>>()
    .AddRoleStore<RoleStore<ApplicationRole, ApplicationDbContext, Guid>>();

// Configure Cors
const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var allowedOrigins = builder.Configuration["AllowedOrigin"] ?? "";
builder.Services.AddCors(options =>
{
    options.AddPolicy(myAllowSpecificOrigins,
        a =>
        {
            a.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

var app = builder.Build();

app.UseHsts();
app.UseHttpsRedirection();

app.UseRouting();
if (app.Environment.IsDevelopment())
{
    app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
}
else
{
    app.UseCors(myAllowSpecificOrigins);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();