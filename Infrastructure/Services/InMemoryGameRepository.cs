using Application.Interfaces;
using Domain.Entities;
using Domain.ValueObjects;
using System.Collections.Concurrent;

namespace Infrastructure.Services;
public class InMemoryGameRepository : IGameRepository
{
    private readonly ConcurrentDictionary<Guid, ChessGame> _games = new();
    private readonly ConcurrentDictionary<string, Guid> _joinCodesGames = new();
    private readonly ConcurrentDictionary<Guid, Dictionary<string, Color>> _gamesPlayers = new();
    private readonly ConcurrentDictionary<Guid, HashSet<string>> _readyPlayers = new();

    public Task<ChessGame?> GetGamesByIdAsync(Guid id)
    {
        _games.TryGetValue(id, out var game);
        return Task.FromResult(game);
    }

    public Task<Guid> GetGameByJoinCodesAsync(string id)
    {
        _joinCodesGames.TryGetValue(id, out var gameId);

        return Task.FromResult(gameId);
    }

    public Task<Dictionary<string, Color>?> GetPlayersAsync(Guid id)
    {
        _gamesPlayers.TryGetValue(id, out var players);
        return Task.FromResult(players);
    }

    public Task SaveNewGameAync(ChessGame game, string connectionId, Color playerColor)
    {
        if (!_games.TryAdd(game.GameId, game))
        {
            throw new InvalidOperationException("[CREATE GAME] Failed to add new game to _games.");
        }
        if (!_joinCodesGames.TryAdd(game.JoinGameId, game.GameId))
        {
            throw new InvalidOperationException("[CREATE GAME] Failed to add join code to _joincodesGames");
        }
        var players = new Dictionary<string, Color>
        {
            [connectionId] = playerColor
        };

        if (!_gamesPlayers.TryAdd(game.GameId, players))
        {
            throw new InvalidOperationException("Could not initialize player list");
        }

        _readyPlayers.TryAdd(game.GameId, new HashSet<string>());
        return Task.CompletedTask;
    }

    public Task<bool> SetPlayerReadyAsync(Guid gameId, string connectionId)
    {
        if (!_readyPlayers.TryGetValue(gameId, out var ready))
            return Task.FromResult(false);

        lock (ready)
        {
            ready.Add(connectionId);
            if (!_gamesPlayers.TryGetValue(gameId, out var players))
                return Task.FromResult(false);
            return Task.FromResult(ready.Count >= players.Count && players.Count >= 2);
        }
    }

    public Task<Guid?> GetGameIdByConnectionAsync(string connectionId)
    {
        foreach (var (gameId, players) in _gamesPlayers)
        {
            if (players.ContainsKey(connectionId))
                return Task.FromResult<Guid?>(gameId);
        }
        return Task.FromResult<Guid?>(null);
    }

    public Task<bool> UnsetPlayerReadyAsync(Guid gameId, string connectionId)
    {
        if (!_readyPlayers.TryGetValue(gameId, out var ready))
            return Task.FromResult(false);

        lock (ready)
        {
            return Task.FromResult(ready.Remove(connectionId));
        }
    }

    public Task<bool> RemoveAsync(Guid id)
    {
        if(!_games.TryRemove(id, out _))
        {
            return Task.FromResult(false);
        } else
        {
            return Task.FromResult(true);
        }
    }

    public Task<Color?> SavePlayerAsync(Guid gameId, string connectionId)
    {
        if (!_games.ContainsKey(gameId))
            return Task.FromResult<Color?>(null);

        if (!_gamesPlayers.TryGetValue(gameId, out var players))
            return Task.FromResult<Color?>(null);

        lock (players)
        {
            if (players.TryGetValue(connectionId, out var existing))
                return Task.FromResult<Color?>(existing);

            // Twórca już zajął jeden kolor — dołączający dostaje przeciwny.
            var taken = players.Values.ToHashSet();
            Color? assigned = null;
            if (!taken.Contains(Color.White)) assigned = Color.White;
            else if (!taken.Contains(Color.Black)) assigned = Color.Black;

            if (assigned == null)
                return Task.FromResult<Color?>(null);

            players[connectionId] = assigned.Value;
            return Task.FromResult<Color?>(assigned);
        }
    }

    public Task<bool> CheckPlayerTurn(Guid gameId, string connectionId)
    {
        if (!_games.TryGetValue(gameId, out var joinedGame))
            throw new KeyNotFoundException("Game does not exitsts");

        if (!_gamesPlayers.TryGetValue(gameId, out var playerColors))
            throw new KeyNotFoundException("Player is not in game");


        playerColors.TryGetValue(connectionId, out var color);
        if (!joinedGame.CurrentPlayer.Equals(color))
        {
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    public Task<Color> CheckPlayerColor(Guid gameId, string connectionId)
    {
        if (!_gamesPlayers.TryGetValue(gameId, out var playerColors))
        {
              throw new KeyNotFoundException("game not found");
        }

        if (!playerColors.TryGetValue(connectionId, out var color))
        {
            throw new KeyNotFoundException($"Player: {connectionId}not found");
        }

        return Task.FromResult(color);
    }
}
