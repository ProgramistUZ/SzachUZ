using Domain.ValueObjects;

namespace Domain.Interfaces;

public interface IGameTimerNotifer
{
    Task NotifyTimerUpdateAsync(Guid gameId, Color player, TimeSpan timeLeft);
    Task NotifyTimeoutAsync(Guid gameId, Color player);
    Task NotifyGameStartedAsync(Guid gameId, Color currentPlayer);
}
