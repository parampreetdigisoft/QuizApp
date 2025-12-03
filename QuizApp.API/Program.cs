using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------
// Add services to the container
// -----------------------------


// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ Register EF Core DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Register Generic Repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// ✅ Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Allow CORS (for UI / JS clients)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// -----------------------------
// Configure the HTTP pipeline
// -----------------------------
if (app.Environment.IsDevelopment())
{
    // ✅ Enable Swagger only in Development
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<QuizApp.API.Middleware.ErrorHandlingMiddleware>();

// ✅ Use CORS
app.UseCors("AllowAll");

// ✅ Use Routing and Controllers
app.UseRouting();
app.MapControllers();

// ✅ Optional root endpoint
app.MapGet("/", () => "QuizApp API is running...");

// ✅ Run the app
app.Run();
