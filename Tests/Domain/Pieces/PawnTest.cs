using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;
using Xunit.Abstractions;

namespace Tests.Domain.Pieces;

public class PawnTest
{
    private readonly ITestOutputHelper _testOutputHelper;

    private ChessBoard _board;
    private Pawn _whitePawn;
    private Pawn _blackPawn;

    public PawnTest(ITestOutputHelper testOutputHelper)
    {
        _testOutputHelper = testOutputHelper;
        _board = TestHelpers.CreateBoard();
        _whitePawn = new Pawn(new Position(2, 2), Color.White);
        _blackPawn = new Pawn(new Position(7, 4), Color.Black);

        _board.PlacePiece(_whitePawn.Position, _whitePawn);
        _board.PlacePiece(_blackPawn.Position, _blackPawn);
    }

    [Fact]
    public void PawnWhite_MoveUp_CorrectMove()
    {
        var targetPosition = new Position(3, 2);
        var startPosition = _whitePawn.Position;

        _whitePawn.MakeMove(_board, targetPosition);

        Assert.Equal(targetPosition, _whitePawn.Position);
        Assert.Null(_board.GetPositionPiece(startPosition));
    }

    [Fact]
    public void PawnWhite_IncorrectMove_ThrowsException()
    {
        var targetPosition = new Position(5, 2);
        var startPosition = _whitePawn.Position;

        Assert.Throws<InvalidMoveException>(() => _whitePawn.MakeMove(_board, targetPosition));
        Assert.Equal(startPosition, _whitePawn.Position);
        Assert.Null(_board.GetPositionPiece(targetPosition));
    }

    [Fact]
    public void PawnWhite_MoveTwoSteps_CorrectMove()
    {
        var targetPosition = new Position(4, 2);
        var startPosition = _whitePawn.Position;

        _whitePawn.MakeMove(_board, targetPosition);

        Assert.Equal(targetPosition, _whitePawn.Position);
        Assert.Null(_board.GetPositionPiece(startPosition));
    }

    [Fact]
    public void PawnWhite_CanAttackOppositeColor_CorrectMove()
    {
        var oppositeColorPiece = new Pawn(new Position(3, 3), Color.Black);
        _board.PlacePiece(oppositeColorPiece.Position, oppositeColorPiece);

        var targetPosition = new Position(3, 3);
        var startPosition = _whitePawn.Position;
        _whitePawn.MakeMove(_board, targetPosition);
        Assert.Equal(targetPosition, _whitePawn.Position);
        Assert.Null(_board.GetPositionPiece(startPosition));
    }

    [Fact]
    public void PawnWhite_AttackOppositeColor_IncorrectMove_ThrowsException()
    {
        var oppositeColorPiece = new Pawn(new Position(4, 3), Color.White);
        _board.PlacePiece(oppositeColorPiece.Position, oppositeColorPiece);

        var targetPosition = new Position(3, 3);
        var startPosition = _whitePawn.Position;

        Assert.Throws<InvalidMoveException>(() => _whitePawn.MakeMove(_board, targetPosition));
        Assert.Equal(startPosition, _whitePawn.Position);
        Assert.Null(_board.GetPositionPiece(targetPosition));
    }

    [Fact]
    public void PawnBlack_MoveDown_CorrectMove()
    {
        var targetPosition = new Position(6, 4);
        var startPosition = _blackPawn.Position;

        _blackPawn.MakeMove(_board, targetPosition);

        Assert.Equal(targetPosition, _blackPawn.Position);
        Assert.Null(_board.GetPositionPiece(startPosition));
    }

    [Fact]
    public void PawnBlack_IncorrectMove_ThrowsException()
    {
        var targetPosition = new Position(4, 4);
        var startPosition = _blackPawn.Position;

        Assert.Throws<InvalidMoveException>(() => _blackPawn.MakeMove(_board, targetPosition));
        Assert.Equal(startPosition, _blackPawn.Position);
        Assert.Null(_board.GetPositionPiece(targetPosition));
    }

    [Fact]
    public void PawnBlack_MoveTwoStepsDown_CorrectMove()
    {
        var targetPosition = new Position(5, 4);
        var startPosition = _blackPawn.Position;

        _blackPawn.MakeMove(_board, targetPosition);

        Assert.Equal(targetPosition, _blackPawn.Position);
        Assert.Null(_board.GetPositionPiece(startPosition));
    }

    [Fact]
    public void Pawn_GetAllMoves_ShouldReturn2Moves()
    {
        var moves = _whitePawn.GetAllPossibleMoves(_board);
        Assert.Equal(2, moves.Count);
    }

    [Fact]
    public void PawnEnPassantTest()
    {
        _blackPawn.Position = new Position(4, 3);
        _board.PlaceAndRemove(new Position(4, 3), _blackPawn);
        _whitePawn.MakeMove(_board, new Position(4, 2));
        var enPassantPosition = new Position(3, 2);
        Assert.Contains(enPassantPosition, _blackPawn.GetAllPossibleMoves(_board));
    }

    [Fact]
    public void PawnPromotionTest()
    {
        _whitePawn.Position = new Position(7, 2);
        _board.PlaceAndRemove(new Position(7, 2), _whitePawn);

        _whitePawn.MakeMove(_board, new Position(8, 2));
        var promotedPiece = _board.GetPositionPiece(new Position(8, 2));
        _testOutputHelper.WriteLine($"Promoted piece at (8, 2): {promotedPiece?.Name} ({promotedPiece?.Color})");
        Assert.Equal(PieceType.Queen, promotedPiece!.Name);
    }
}
