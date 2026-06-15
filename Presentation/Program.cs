using Application.Configuration;
using Infrastructure.Configuration;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Presentation.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IHubContext<ChessHubBase>, ChessHubContextBridge>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors();
app.UseRouting();

app.MapHub<ChessHub>("/chesshub");

app.Run();
