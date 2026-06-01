using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Tests.Domain.Pieces;

public class QueenTests
{
    private Queen _queen;
    private ChessBoard _board;

    public QueenTests()
    {
        _board = TestHelpers.CreateBoard();
        _queen = new(new(4, 4), Color.White);
        _board.PlacePiece(_queen.Position, _queen);
    }

    [Fact]
    public void QueenGetPossibleMovesNoObstacles()
    {
        var moves = _queen.GetAllPossibleMoves(_board);
        Assert.Equal(27, moves.Count);
    }

    [Fact]
    public void QueenGetPossibleMovesObstacles()
    {
        var obstacle1 = new Pawn(new(3, 5), Color.White);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        var moves = _queen.GetAllPossibleMoves(_board);
        Assert.Equal(24, moves.Count);
    }

    [Fact]
    public void QueenAttackOppositeColor()
    {
        var obstacle1 = new Pawn(new(3, 5), Color.Black);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        var moves = _queen.GetAllPossibleMoves(_board);
        Assert.Equal(25, moves.Count);
    }

    [Fact]
    public void QueenInvalidMove()
    {
        var targetPosition = new Position(5, 1);
        Assert.False(_queen.IsMoveValid(_board, targetPosition));
        Assert.Throws<InvalidMoveException>(() => _queen.MakeMove(_board, targetPosition));
        Assert.Null(_board.GetPositionPiece(targetPosition));
        Assert.NotNull(_board.GetPositionPiece(_queen.Position));
    }
}
