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

    public async Task NotifyGameStartedAsync(Guid gameId, Color currentPlayer)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("GameStarted", new
        {
            currentPlayer = currentPlayer.ToString().ToLower()
        });
    }

    public async Task NotifyTimeoutAsync(Guid gameId, Color player)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("Error", $"{player} run out of Time");
    }

    public async Task NotifyTimerUpdateAsync(Guid gameId, Color player, TimeSpan timeLeft)
    {
        await _hubContext.Clients.Group(gameId.ToString()).SendAsync("UpdateTimer", new
        {
            Player = player.ToString().ToLower(),
            TimeLeft = (int)timeLeft.TotalSeconds
        });
    }
}
