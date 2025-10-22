using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using MangaLibraryAPI.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

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

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options => { options.Password.RequiredLength = 8; })
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