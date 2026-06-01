using Application.Interfaces;
using Domain.Interfaces;
using Infrastructure.Notifers;
using Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Configuration;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IGameRepository, InMemoryGameRepository>();
        services.AddSingleton<IGameTimerNotifer, SignalRGameTimerNotifer>();
        services.AddSingleton<IGameNotifier, GameNotifier>();
        services.AddScoped<IMoveValidator, MoveValidator>();
        services.AddScoped<IPositionConverter, PositionConverter>();
        services.AddSingleton<IGameIdGenerator, GameIdGenerator>();
        services.AddScoped<IPositionParser, PositionParser>();
        return services;
    }
}
