using Application.DTOs;
using Domain.Entities;
using Domain.ValueObjects;

namespace Application.Interfaces;
public interface IGameService
{
    // Game Lifecycle
    Task<ChessGame> CreateGame(string callerConnectionId, Color color, TimeSpan gameLength);
    Task<bool> DeleteGame(Guid gameId);
    Task<ChessGame?> GetGameByGuid(Guid gameId);
    Task<ChessGame?> GetGameByJoinID(string joinId);

    // Player Managment
    Task<Color?> AddToGame(Guid gameId, string calllerConnectionId);
    Task<Dictionary<string, Color>?> GetPlayers(Guid gameId);
    Task<bool> CheckPlayerTurn(Guid gameId, string ConnectionId);
    Task<Color> CheckPlayerColor(Guid gameId, string connectionId);
    Task<bool> SetPlayerReady(Guid gameId, string connectionId);
    Task<bool> UnsetPlayerReady(Guid gameId, string connectionId);
    Task<Guid?> GetGameIdByConnection(string connectionId);

    // Gameplay
    Task<bool> MakeMove(Guid gameId, Position from, Position to);
    Task<List<Position>> GetAllPossibleMoves(Guid gameId, Position from, string connectionId);
}
