using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.ValueObjects;
using Microsoft.Extensions.Logging;


namespace Application.UseCases;

public class GameService : IGameService
{
    private readonly ILogger<GameService> _logger;
    private readonly IMoveValidator _validator;
    private readonly IGameTimerNotifer _notifer;
    private readonly IGameIdGenerator _idGenerator;
    private readonly IPositionParser _parser;
    private readonly IPositionConverter _converter;
    private readonly IGameRepository _gameRepository;
    private readonly IGameNotifier _gameNotifier;

    public GameService(
        ILogger<GameService> logger,
        IMoveValidator validator,
        IGameTimerNotifer notifer,
        IGameIdGenerator idGenerator,
        IPositionParser parser,
        IPositionConverter converter,
        IGameRepository gameRepository,
        IGameNotifier gameNotifier)
    {
        _gameNotifier = gameNotifier;
        _logger = logger;
        _validator = validator;
        _notifer = notifer;
        _idGenerator = idGenerator;
        _parser = parser;
        _converter = converter;
        _gameRepository = gameRepository;
    }

    // Game Lifecycle
    public async Task<ChessGame> CreateGame(string callerConnectionId, Color color, TimeSpan gameLength)
    {
        var newGame = new ChessGame(_validator, _idGenerator, _converter, _gameNotifier, gameLength);
        await _gameRepository.SaveNewGameAync(newGame, callerConnectionId, color);

        return newGame;
    }

    public async Task<bool> DeleteGame(Guid gameId)
    {
        var removed = await _gameRepository.RemoveAsync(gameId);
        return removed;
    }

    public async Task<ChessGame?> GetGameByGuid(Guid gameId)
    {
        var game = await _gameRepository.GetGamesByIdAsync(gameId);

        return game;
    }

    public async Task<ChessGame?> GetGameByJoinID(string joinId)
    {
        var gameGuidId = await _gameRepository.GetGameByJoinCodesAsync(joinId);

        return await GetGameByGuid(gameGuidId);
    }


    // Player Managment
    public async Task<Color?> AddToGame(Guid gameId, string calllerConnectionId)
    {
        var added = await _gameRepository.SavePlayerAsync(gameId, calllerConnectionId);

        return added;
    }

    public async Task<Dictionary<string, Color>?> GetPlayers(Guid gameId)
    {
        var players = await _gameRepository.GetPlayersAsync(gameId);

        return players;
    }

    public async Task<bool> CheckPlayerTurn(Guid gameId, string connectionId)
    {
        return await _gameRepository.CheckPlayerTurn(gameId, connectionId);
    }

    public async Task<Color> CheckPlayerColor(Guid gameId, string connectionId)
    {
        return await _gameRepository.CheckPlayerColor(gameId, connectionId);
    }


    // Gameplay
    public async Task<bool> MakeMove(Guid gameId, Position from, Position to)
    {
        var game = await GetGameByGuid(gameId);
        if (game == null)
        {
            return false;
        }

        var fromPosition = new Position(from.Row, from.Col);
        var toPosition = new Position(to.Row, to.Col);
        try
        {
            await game.MoveAsync(fromPosition, toPosition);
        }
        catch (InvalidMoveException e)
        {
            _logger.LogInformation(e.Message);
            return false;
        }

        _logger.LogDebug("[{Method}]: Move made in game {gameId}[ {from}->{to}]", nameof(MakeMove), gameId, from, to);

        return true;
    }

    public async Task<List<Position>> GetAllPossibleMoves(Guid gameId, Position from, string connectionId)
    {
        var game = await _gameRepository.GetGamesByIdAsync(gameId);
        if (game == null)
        {
            return new List<Position>();
        }

        try
        {
            var color = await CheckPlayerColor(gameId, connectionId);
            var positions = game.GetAllPossibleMoves(from, color);
            _logger.LogDebug("[{Method}] Positions returned from game {GameId}", nameof(GetAllPossibleMoves), gameId);
            return positions;
        }
        catch (InvalidMoveException e)
        {
            _logger.LogInformation("Invalid move exception: {Message}", e.Message);
            return new List<Position>();
        }
        catch (KeyNotFoundException e)
        {
            _logger.LogInformation("Player not in game: {Message}", e.Message);
            return new List<Position>();
        }
    }
}
