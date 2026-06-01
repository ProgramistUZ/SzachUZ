namespace Domain.Entities;

using Domain.Exceptions;
using Domain.Extensions;
using Domain.Interfaces;
using Domain.ValueObjects;

public class ChessGame
{
    private readonly ChessBoard _board;
    private readonly IMoveValidator _moveValidator;
    private readonly IGameIdGenerator _gameIdGenerator;
    private readonly IGameNotifier _gameNotifier;
    private GameStatus _status;

    PlayerTimer WhiteTimer { get; }
    PlayerTimer BlackTimer { get; }

    public Color CurrentPlayer { get; private set; } = Color.White;
    public string JoinGameId { get; } // 6 characters
    public Guid GameId { get; } = Guid.NewGuid();

    public ChessGame(IMoveValidator moveValidator,
        IGameIdGenerator gameIdGenerator,
        IPositionConverter converter,
        IGameNotifier gameNotifier,
        TimeSpan gameLenght)
    {
        _board = new ChessBoard(converter);
        _board.SetDefaultBoard(_board);
        _status = GameStatus.Waiting;
        _moveValidator = moveValidator;
        _gameIdGenerator = gameIdGenerator;
        _gameNotifier = gameNotifier;

        JoinGameId = _gameIdGenerator.GenerateJoinGameId();

        WhiteTimer = new PlayerTimer(gameLenght);
        BlackTimer = new PlayerTimer(gameLenght);
    }

    public async Task MoveAsync(Position from, Position to)
    {
        if (_status == GameStatus.Waiting || _status == GameStatus.Finished)
            throw new InvalidMoveException("wait for game start");
        var piece = _board.GetPositionPiece(from)
                    ?? throw new InvalidMoveException("Brak figury na polu źródłowym.");
        if (piece.Color != CurrentPlayer)
            throw new InvalidMoveException("To nie Twoja figura.");
        if (!piece.GetAllPossibleMoves(_board).Contains(to))
            throw new InvalidMoveException("Niedozwolony ruch.");

        var boardClone = _board.Clone();
        var clonedPiece = boardClone.GetPositionPiece(from)!;
        clonedPiece.MakeMove(boardClone, to);

        if (_moveValidator.IsInCheck(boardClone, piece.Color))
            throw new InvalidMoveException("Ruch pozostawia Twojego króla w szachu.");

        piece.MakeMove(_board, to);
        SwapTimersAndTurn();

        await SendTurnAsync();

        var opponent = piece.Color == Color.White ? Color.Black : Color.White;
        if (_moveValidator.IsInMate(_board, opponent))
        {
            await SendEventAsync();
            EndGame();
        }
        else if (_moveValidator.IsInCheck(_board, opponent))
        {
            await SendEventAsync();
        }
    }

    public List<Position> GetAllPossibleMoves(Position from, Color requesterColor)
    {
        var piece = _board.GetPositionPiece(from);

        if (piece == null)
            throw new InvalidMoveException();

        if (piece.Color != requesterColor)
            throw new InvalidMoveException("To nie Twoja figura.");

        return piece.GetAllPossibleMoves(_board);
    }

    private void SwapTimersAndTurn()
    {
        if (CurrentPlayer == Color.White)
        {
            WhiteTimer.EndTurn();
            BlackTimer.StartTurn();
        }
        else
        {
            BlackTimer.EndTurn();
            WhiteTimer.StartTurn();
        }

        CurrentPlayer = CurrentPlayer.Next();
    }

    public void StartGame()
    {
        _status = GameStatus.Active;
    }

    public void EndGame()
    {
        if (_status == GameStatus.Finished)
            return;
        BlackTimer.EndTurn();
        WhiteTimer.EndTurn();
        _status = GameStatus.Finished;
    }

    public async Task StartTimers(IGameTimerNotifer timerNotifier)
    {
        WhiteTimer.OnTick = async (timeLeft) =>
        {
            await timerNotifier.NotifyTimerUpdateAsync(GameId, Color.White, timeLeft);

            if (timeLeft <= TimeSpan.Zero)
            {
                await timerNotifier.NotifyTimeoutAsync(GameId, Color.White);
                await _gameNotifier.NotifyGameEvent(GameId, Color.White, "Koniec czasu! Czarny wygrywa!");
                EndGame();
            }
        };

        BlackTimer.OnTick = async (timeLeft) =>
        {
            await timerNotifier.NotifyTimerUpdateAsync(GameId, Color.Black, timeLeft);

            if (timeLeft <= TimeSpan.Zero)
            {
                await timerNotifier.NotifyTimeoutAsync(GameId, Color.Black);
                await _gameNotifier.NotifyGameEvent(GameId, Color.Black, "Koniec czasu! Bialy wygrywa!");
                EndGame();
            }
        };

        WhiteTimer.StartTurn();

        await timerNotifier.NotifyGameStartedAsync(GameId, Color.White);
    }

    private async Task SendEventAsync()
    {
        if (_moveValidator.IsInCheck(_board, Color.White))
        {
            if (_moveValidator.IsInMate(_board, Color.White))
                await _gameNotifier.NotifyGameEvent(GameId, Color.Black, "Szach Mat! Czarny wygrywa!");
            else
                await _gameNotifier.NotifyGameEvent(GameId, Color.White, "Szach!");
        }
        if (_moveValidator.IsInCheck(_board, Color.Black))
        {
            if (_moveValidator.IsInMate(_board, Color.Black))
                await _gameNotifier.NotifyGameEvent(GameId, Color.White, "Szach Mat! Biały wygrywa!");
            else
                await _gameNotifier.NotifyGameEvent(GameId, Color.Black, "Szach!");
        }
    }

    private async Task SendTurnAsync()
    {
        if (CurrentPlayer == Color.White)
            await _gameNotifier.NotifyGameEvent(GameId, Color.White, "Ruch Białych.");
        else
            await _gameNotifier.NotifyGameEvent(GameId, Color.Black, "Ruch Czarnych.");
    }

    public string[][] GetBoard()
    {
        var array = _board.ToArrayString();

        int rows = array.GetLength(0);
        int cols = array.GetLength(1);

        string[][] jagged = new string[rows][];

        for (int i = 0; i < rows; i++)
        {
            jagged[i] = new string[cols];
            for (int j = 0; j < cols; j++)
            {
                jagged[i][j] = array[i, j];
            }
        }

        return jagged;
    }
}
