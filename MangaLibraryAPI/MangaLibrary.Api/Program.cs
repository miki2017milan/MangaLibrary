using Entities;
using MangaLibraryAPI.Entities;
using MangaLibraryAPI.ServiceContracts;
using MangaLibraryAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Add(new ServiceDescriptor(
    typeof(IMangaService),
    typeof(MangaService),
    ServiceLifetime.Transient
));

var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("DbConnection"));
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddSingleton(dataSource);

builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var sharedDataSource = serviceProvider.GetRequiredService<NpgsqlDataSource>();
    options.UseNpgsql(sharedDataSource);
});

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options => { options.Password.RequiredLength = 8; })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders()
    .AddUserStore<UserStore<ApplicationUser, ApplicationRole, ApplicationDbContext, Guid>>()
    .AddRoleStore<RoleStore<ApplicationRole, ApplicationDbContext, Guid>>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "AccessCookie";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(15);
});

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(myAllowSpecificOrigins,
        a => { a.WithOrigins("http://localhost:5173"); });
});

var app = builder.Build();

app.UseHsts();
app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(myAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();