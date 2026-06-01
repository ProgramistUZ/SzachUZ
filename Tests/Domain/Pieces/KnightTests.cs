using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Tests.Domain.Pieces;

public class KnightTests
{
    private Knight _knight;
    private ChessBoard _board;

    public KnightTests()
    {
        _knight = new(new(4, 4), Color.White);
        _board = TestHelpers.CreateBoard();
        _board.PlacePiece(_knight.Position, _knight);
    }

    [Fact]
    public void KnightGetPossibleMovesNoObstacles()
    {
        var moves = _knight.GetAllPossibleMoves(_board);
        Assert.Equal(8, moves.Count);
    }

    [Fact]
    public void KnightGetPossibleMovesObstacles()
    {
        var obstacle1 = new Pawn(new(6, 5), Color.White);
        var obstacle2 = new Pawn(new(3, 2), Color.White);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        _board.PlacePiece(obstacle2.Position, obstacle2);
        var moves = _knight.GetAllPossibleMoves(_board);
        Assert.Equal(6, moves.Count);
    }

    [Fact]
    public void KnightAttackOppositeColor()
    {
        var obstacle1 = new Pawn(new(6, 5), Color.Black);
        var obstacle2 = new Pawn(new(3, 2), Color.Black);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        _board.PlacePiece(obstacle2.Position, obstacle2);
        var moves = _knight.GetAllPossibleMoves(_board);
        Assert.Equal(8, moves.Count);
    }

    [Fact]
    public void KnightInvalidMove()
    {
        var targetPosition = new Position(8, 8);
        Assert.False(_knight.IsMoveValid(_board, targetPosition));
        Assert.Throws<InvalidMoveException>(() => _knight.MakeMove(_board, targetPosition));
        Assert.Null(_board.GetPositionPiece(targetPosition));
        Assert.NotNull(_board.GetPositionPiece(_knight.Position));
    }
}
