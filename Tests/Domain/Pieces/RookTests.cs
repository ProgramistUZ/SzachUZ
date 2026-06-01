using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Tests.Domain.Pieces;

public class RookTests
{
    private ChessBoard _board;
    private Rook _rook;

    public RookTests()
    {
        _board = TestHelpers.CreateBoard();
        _rook = new(new(4, 4), Color.White);
        _board.PlacePiece(_rook.Position, _rook);
    }

    [Fact]
    public void RookGetAllMovesNoObstacles()
    {
        var moves = _rook.GetAllPossibleMoves(_board);
        Assert.Equal(14, moves.Count);
    }

    [Fact]
    public void RookGetAllMovesObstacles()
    {
        var obstacle = new Rook(new Position(4, 6), Color.White);
        _board.PlacePiece(obstacle.Position, obstacle);

        var moves = _rook.GetAllPossibleMoves(_board);
        Assert.Equal(11, moves.Count);
    }

    [Fact]
    public void RookAttackOppositeColor()
    {
        var targetPosition = new Position(5, 4);
        var pawn = new Pawn(targetPosition, Color.Black);
        _board.PlacePiece(pawn.Position, pawn);
        Assert.True(_rook.IsMoveValid(_board, targetPosition));
    }

    [Fact]
    public void RookAttackTheSameColor()
    {
        var targetPosition = new Position(5, 4);
        var pawn = new Pawn(targetPosition, Color.White);
        _board.PlacePiece(pawn.Position, pawn);
        Assert.False(_rook.IsMoveValid(_board, targetPosition));
    }

    [Fact]
    public void RookInvalidMove()
    {
        var targetPosition = new Position(5, 6);
        Assert.False(_rook.IsMoveValid(_board, targetPosition));
        Assert.Throws<InvalidMoveException>(() => _rook.MakeMove(_board, targetPosition));
        Assert.Null(_board.GetPositionPiece(targetPosition));
        Assert.NotNull(_board.GetPositionPiece(_rook.Position));
    }
}
