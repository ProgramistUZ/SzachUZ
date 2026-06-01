using Domain.ValueObjects;

namespace Domain.Interfaces;

public interface IGameNotifier
{
    Task NotifyGameEvent(Guid gameId, Color player, string reason);
}
