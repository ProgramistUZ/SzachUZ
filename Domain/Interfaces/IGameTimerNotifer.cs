using Domain.ValueObjects;

namespace Domain.Interfaces;

public interface IGameTimerNotifer
{
    Task NotifyTimerUpdateAsync(Guid gameId, Color player, TimeSpan timeLeft);
    Task NotifyGameStartedAsync(Guid gameId, Color currentPlayer, TimeSpan gameLength);
    Task NotifyGameOverAsync(Guid gameId, Color winner, string reason);
    Task NotifyCountdownAsync(Guid gameId, int secondsLeft);
    Task NotifyPlayerDisconnectedAsync(Guid gameId);
    Task NotifyPlayerReconnectedAsync(Guid gameId);
}
