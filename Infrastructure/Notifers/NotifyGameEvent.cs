using Domain.Interfaces;
using Domain.ValueObjects;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Notifers;

public class GameNotifier : IGameNotifier
{
    private readonly IHubContext<ChessHubBase> _hubContext;
    private readonly ILogger<GameNotifier> _logger;

    public GameNotifier(IHubContext<ChessHubBase> hubContext, ILogger<GameNotifier> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task NotifyGameEvent(Guid gameId, Color player, string reason)
    {
        try
        {
            await _hubContext.Clients.Group(gameId.ToString())
                .SendAsync("GameEvent", $"Server: {reason}");

            _logger.LogInformation(
                "Game event sent for game {GameId}. Player: {Player}, Reason: {Reason}",
                gameId, player, reason);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error sending game event for game {GameId}. Player: {Player}, Reason: {Reason}",
                gameId, player, reason);
        }
    }
}
