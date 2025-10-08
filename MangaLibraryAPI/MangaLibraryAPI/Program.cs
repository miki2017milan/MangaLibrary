using Entities;
using Microsoft.EntityFrameworkCore;
using ServiceContracts;
using Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.Add(new ServiceDescriptor(
    typeof(IMangaService),
    typeof(MangaService),
    ServiceLifetime.Transient
));
builder.Services.AddDbContext<MangaLibraryDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DbConnection"));
});

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(myAllowSpecificOrigins,
        a => { a.WithOrigins("http://localhost:5173", "http://192.168.0.47:5173"); });
});

var app = builder.Build();

app.UseCors(myAllowSpecificOrigins);
app.MapControllers();

app.Run();