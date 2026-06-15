using Domain.Entities;
using Domain.ValueObjects;

namespace Application.Interfaces;
public interface IGameRepository
{
    Task SaveNewGameAync(ChessGame game, string connectionId, Color playerColor);
    Task<ChessGame?> GetGamesByIdAsync(Guid id);
    Task<Guid> GetGameByJoinCodesAsync(string id);
    Task<Color?> SavePlayerAsync(Guid gameId, string connectionId);
    Task<Dictionary<string, Color>?> GetPlayersAsync(Guid id);
    Task<bool> RemoveAsync(Guid id);
    Task<bool> CheckPlayerTurn(Guid gameId, string connectionId);
    Task<Color> CheckPlayerColor(Guid gameId, string connectionId);
    Task<bool> SetPlayerReadyAsync(Guid gameId, string connectionId);
    Task<bool> UnsetPlayerReadyAsync(Guid gameId, string connectionId);
    Task<Guid?> GetGameIdByConnectionAsync(string connectionId);
}
