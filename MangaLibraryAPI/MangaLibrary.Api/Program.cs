using System.Text;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using MangaLibraryAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
IdentityModelEventSource.ShowPII = true;
builder.Services.AddControllers();

// Configure custom services
builder.Services.AddTransient<IMangaService, MangaService>();
builder.Services.AddTransient<IJwtService, JwtService>();

// Configure postgres connection
var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration["PostgresDbConnection"]);
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddSingleton(dataSource);

builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var sharedDataSource = serviceProvider.GetRequiredService<NpgsqlDataSource>();
    options.UseNpgsql(sharedDataSource);
});

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