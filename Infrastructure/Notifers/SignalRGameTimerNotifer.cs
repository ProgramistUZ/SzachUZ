using Domain.Interfaces;
using Domain.ValueObjects;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Notifers;
public class SignalRGameTimerNotifer : IGameTimerNotifer
{
    private readonly IHubContext<ChessHubBase> _hubContext;

    public SignalRGameTimerNotifer(IHubContext<ChessHubBase> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyGameStartedAsync(Guid gameId, Color currentPlayer, TimeSpan gameLength)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("GameStarted", new
        {
            currentPlayer = currentPlayer.ToString().ToLower(),
            gameLength = (int)gameLength.TotalSeconds
        });
    }

    public async Task NotifyGameOverAsync(Guid gameId, Color winner, string reason)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("GameOver", new
        {
            winner = winner.ToString().ToLower(),
            reason
        });
    }

    public async Task NotifyCountdownAsync(Guid gameId, int secondsLeft)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("Countdown", secondsLeft);
    }

    public async Task NotifyPlayerDisconnectedAsync(Guid gameId)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("PlayerDisconnected");
    }

    public async Task NotifyPlayerReconnectedAsync(Guid gameId)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("PlayerReconnected");
    }

    public async Task NotifyTimerUpdateAsync(Guid gameId, Color player, TimeSpan timeLeft)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("UpdateTimer", new
        {
            player = player.ToString().ToLower(),
            timeLeft = (int)timeLeft.TotalSeconds
        });
    }
}
