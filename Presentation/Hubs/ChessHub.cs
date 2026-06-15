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

            var isRejoin = players.ContainsKey(Context.ConnectionId);
            if (players.Count >= LOBBY_SIZE && !isRejoin)
            {
                _logger.LogDebug("[{Method}]: Game {gameId} is full, caller {id}", nameof(JoinGame), game.GameId,
                    Context.ConnectionId);
                await Clients.Caller.SendAsync("Error", "Game is full");
                return;
            }

            await _gameService.AddToGame(game.GameId, Context.ConnectionId);
            var color = await _gameService.CheckPlayerColor(game.GameId, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, game.GameId.ToString());
            await Clients.Caller.SendAsync("Joined", new
            {
                gameId = game.GameId,
                color = color.ToString().ToLower()
            });

            if (isRejoin)
            {
                _logger.LogInformation("[{Method}]: Player {id} rejoined game {gameId}", nameof(JoinGame), Context.ConnectionId, game.GameId);
                await SendGameState(game, color);
                return;
            }

            await Clients.Group(game.GameId.ToString()).SendAsync("PlayerJoined", Context.ConnectionId);

            _logger.LogInformation("[{Method}]: Game {gameId} joined by player {id}", nameof(JoinGame), game.GameId,
                Context.ConnectionId);

            var currentPlayers = await _gameService.GetPlayers(game.GameId);
            if (currentPlayers != null)
            {
                await CheckForStart(game, currentPlayers);
            }
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

        var fromPosition = UiToChess(from);
        var toPosition = UiToChess(to);

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
        var from = UiToChess(fromDto);

        var moves = await _gameService.GetAllPossibleMoves(gameId, from, Context.ConnectionId);

        var returnMoves = moves
            .Select(ChessToUi)
            .ToList();
        await Clients.Caller.SendAsync("ReciveMoves", returnMoves);
    }

    private static Position UiToChess(PositionDto dto) => new Position(8 - dto.Row, dto.Col + 1);

    private static PositionDto ChessToUi(Position pos) => new PositionDto(8 - pos.Row, pos.Col - 1);

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


    public async Task PlayerUnready(Guid gameId)
    {
        var game = await _gameService.GetGameByGuid(gameId);
        if (game == null)
        {
            await Clients.Caller.SendAsync("Error", "Game does not exist");
            return;
        }

        await _gameService.UnsetPlayerReady(gameId, Context.ConnectionId);
        await Clients.OthersInGroup(gameId.ToString()).SendAsync("PlayerUnready", Context.ConnectionId);
        _logger.LogInformation("[{Method}]: Player {id} unready in game {gameId}", nameof(PlayerUnready), Context.ConnectionId, gameId);
    }

    public async Task PlayerReady(Guid gameId)
    {
        var game = await _gameService.GetGameByGuid(gameId);
        if (game == null)
        {
            await Clients.Caller.SendAsync("Error", "Game does not exist");
            return;
        }

        var allReady = await _gameService.SetPlayerReady(gameId, Context.ConnectionId);

        await Clients.OthersInGroup(gameId.ToString()).SendAsync("PlayerReady", Context.ConnectionId);
        _logger.LogInformation("[{Method}]: Player {id} ready in game {gameId}", nameof(PlayerReady), Context.ConnectionId, gameId);

        if (allReady)
        {
            game.StartGame();
            _logger.LogInformation("[{Method}]: Game {gameId} started", nameof(PlayerReady), gameId);
            _ = game.StartTimers(_timerNotifer);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var gameId = await _gameService.GetGameIdByConnection(Context.ConnectionId);
        if (gameId.HasValue)
        {
            await _timerNotifer.NotifyPlayerDisconnectedAsync(gameId.Value);
            _logger.LogInformation("[{Method}]: Player {id} disconnected from game {gameId}", nameof(OnDisconnectedAsync), Context.ConnectionId, gameId.Value);
        }
        await base.OnDisconnectedAsync(exception);
    }

    private async Task CheckForStart(ChessGame game, Dictionary<string, Color> players)
    {
        if (players.Count == LOBBY_SIZE)
        {
            await Clients.Group(game.GameId.ToString()).SendAsync("LobbyFull");
        }
    }

    private async Task SendGameState(ChessGame game, Color playerColor)
    {
        var gameIdStr = game.GameId.ToString();
        await Clients.Caller.SendAsync("GameState", new
        {
            gameId = game.GameId,
            color = playerColor.ToString().ToLower(),
            isActive = game.IsActive,
            isFinished = game.IsFinished,
            gameLength = (int)game.GameLength.TotalSeconds,
            whiteTime = (int)game.WhiteTimeLeft.TotalSeconds,
            blackTime = (int)game.BlackTimeLeft.TotalSeconds,
            currentPlayer = game.CurrentPlayer.ToString().ToLower(),
            board = game.GetBoard(),
        });
        await _timerNotifer.NotifyPlayerReconnectedAsync(game.GameId);
        _logger.LogInformation("[{Method}]: Sent game state to reconnected player in game {gameId}", nameof(SendGameState), game.GameId);
    }
}
