using ServiceContracts;
using Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDbService>();
builder.Services.Add(new ServiceDescriptor(
    typeof(IMangaService),
    typeof(MangaService),
    ServiceLifetime.Transient
));

var app = builder.Build();

app.MapControllers();
app.Run();