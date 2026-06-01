using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Domain.ValueObjects;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Presentation.Hubs;

public class ChessHub : ChessHubBase
{
    private const int LOBBY_SIZE = 2;

    private readonly IGameService _gameService;
    private readonly IPositionParser _positionParser;
    private readonly IGameTimerNotifer _timerNotifer;
    private readonly ILogger<ChessHub> _logger;

    public ChessHub(IGameService gameService,
        ILogger<ChessHub> logger,
        IPositionParser positionParser,
        IGameTimerNotifer timerNotifer)
    {
        _gameService = gameService;
        _logger = logger;
        _positionParser = positionParser;
        _timerNotifer = timerNotifer;
    }

    public async Task JoinGame(string joinGameId)
    {
        try
        {
            var game = await _gameService.GetGameByJoinID(joinGameId);
            if (game == null)
            {
                _logger.LogWarning("[{Method}]: Game defined by {joinGameId} does not exists", nameof(JoinGame),
                    joinGameId);
                await Clients.Caller.SendAsync("Error", "joinGameId does not exits");
                return;
            }

            var players = await _gameService.GetPlayers(game.GameId);

            if (players == null)
            {
                _logger.LogWarning("[{Method}]: Game {gameId} has no players record", nameof(JoinGame), game.GameId);
                await Clients.Caller.SendAsync("Error", "Game state is invalid");
                return;
            }

            if (players.Count() >= LOBBY_SIZE && !players.ContainsKey(Context.ConnectionId.ToString()))
            {
                _logger.LogDebug("[{Method}]: Game {gameId} is full, caller {id}", nameof(JoinGame), game.GameId,
                    Context.ConnectionId);
                await Clients.Caller.SendAsync("Error", "Game is full");
                return;
            }

            await _gameService.AddToGame(game.GameId, Context.ConnectionId);
            var color = await _gameService.CheckPlayerColor(game.GameId, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, game.GameId.ToString());
            await Clients.Group(game.GameId.ToString()).SendAsync("PlayerJoined", Context.ConnectionId);
            await Clients.Caller.SendAsync("Joined", new
            {
                gameId = game.GameId,
                color = color.ToString().ToLower()
            });

            _logger.LogInformation("[{Method}]: Game {gameId} joined by player {id}", nameof(JoinGame), game.GameId,
                Context.ConnectionId);

            await CheckForStart(game, players);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }


    public async Task MakeMove(Guid gameId, PositionDto from, PositionDto to)
    {
        var game = await _gameService.GetGameByGuid(gameId);
        if (game == null)
        {
            await Clients.Caller.SendAsync("Error", "Game does not exists");
            return;
        }

        var isTurn = await _gameService.CheckPlayerTurn(gameId, Context.ConnectionId);
        if (!isTurn)
        {
            await Clients.Caller.SendAsync("Error", "its not your turn");
            return;
        }

        var fromPosition = new Position(from.Row + 1, from.Col + 1);
        var toPosition = new Position(to.Row + 1, to.Col + 1);

        var isMoveMade = await _gameService.MakeMove(gameId, fromPosition, toPosition);

        if (isMoveMade)
        {
            await Clients.Group(gameId.ToString()).SendAsync("MoveMade", game.GetBoard());
        }
        else
        {
            await Clients.Caller.SendAsync("Error", "WRONG MOVE");
        }
    }

    public async Task GetAllMoves(Guid gameId, PositionDto fromDto)
    {
        var from = new Position(fromDto.Row + 1, fromDto.Col + 1);

        var moves = await _gameService.GetAllPossibleMoves(gameId, from, Context.ConnectionId);

        var returnMoves = moves
            .Select(pos => new PositionDto(pos.Row - 1, pos.Col - 1))
            .ToList();
        await Clients.Caller.SendAsync("ReciveMoves", returnMoves);
    }

    public async Task CreateGame(string color, int gameLength)
    {
        try
        {
            if (!Enum.TryParse<Color>(color, ignoreCase: true, out var parsedColor))
            {
                return;
            }

            _logger.LogDebug("[{Method}]: Game inovked with color {color}", nameof(CreateGame), color);

            var game = await _gameService.CreateGame(Context.ConnectionId, parsedColor,
                TimeSpan.FromSeconds(gameLength));

            _logger.LogInformation("[{Method}]: Created game {game}, JoinCode {joinCode}, Color {color}",
                nameof(CreateGame), game.GameId, game.JoinGameId, parsedColor);

            await Groups.AddToGroupAsync(Context.ConnectionId, game.GameId.ToString());
            await Clients.Caller.SendAsync("GameCreated", new
            {
                gameId = game.GameId,
                joinCode = game.JoinGameId,
                yourColor = color.ToString().ToLower(),
            });
        }
        catch (Exception ex)
        {
            _logger.LogWarning("[{Method}]: failed to create game {message}", nameof(CreateGame), ex.ToString());
            await Clients.Caller.SendAsync("Error", "Internal server error: " + ex.Message);
        }
    }

    public async Task SendMessage(Guid gameId, string message)
    {
        var connId = Context.ConnectionId ?? string.Empty;
        var suffix = connId.Length >= 5 ? connId.Substring(0, 5) : connId;
        await Clients.Group(gameId.ToString()).SendAsync("ReciveMessage",
            $"Guest{suffix}: {message}");
    }


    private async Task CheckForStart(ChessGame game, Dictionary<string, Color> players)
    {
        if (players.Count() == LOBBY_SIZE)
        {
            game.StartGame();
            _logger.LogInformation("[{Method}]: Game {gameId} started", nameof(JoinGame), game.GameId);

            await game.StartTimers(_timerNotifer);
        }
    }
}
