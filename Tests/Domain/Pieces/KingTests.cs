using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Tests.Domain.Pieces;

public class KingTests
{
    private ChessBoard _board;
    private King _king;

    public KingTests()
    {
        _board = TestHelpers.CreateBoard();
        _king = new(new(4, 4), Color.White);
        _board.PlacePiece(_king.Position, _king);
    }

    [Fact]
    public void KingGetPossibleMovesNoObstacles()
    {
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.Equal(8, moves.Count);
    }

    [Fact]
    public void KingGetPossibleMovesObstacles()
    {
        var obstacle1 = new Pawn(new(4, 5), Color.White);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.Equal(7, moves.Count);
    }

    [Fact]
    public void KingAttackOppositeColor()
    {
        var obstacle1 = new Pawn(new(4, 5), Color.Black);
        _board.PlacePiece(obstacle1.Position, obstacle1);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.Equal(8, moves.Count);
    }

    [Fact]
    public void KingInvalidMove()
    {
        var targetPosition = new Position(8, 8);
        Assert.False(_king.IsMoveValid(_board, targetPosition));
        Assert.Throws<InvalidMoveException>(() => _king.MakeMove(_board, targetPosition));
        Assert.Null(_board.GetPositionPiece(targetPosition));
        Assert.NotNull(_board.GetPositionPiece(_king.Position));
    }

    [Fact]
    public void LeftSideCastling()
    {
        _king.Position = new Position(1, 5);
        _board.PlaceAndRemove(new Position(1, 5), _king);
        var rook = new Rook(new Position(1, 1), Color.White);
        _board.PlacePiece(rook.Position, rook);
        var targetPosition = new Position(1, 3);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.Contains(targetPosition, moves);
        _king.MakeMove(_board, targetPosition);
        Assert.Equal(_king, _board.GetPositionPiece(targetPosition));
        Assert.Equal(rook, _board.GetPositionPiece(new Position(1, 4)));
    }

    [Fact]
    public void RightSideCastling()
    {
        _king.Position = new Position(1, 5);
        _board.PlaceAndRemove(new Position(1, 5), _king);
        var rook = new Rook(new Position(1, 8), Color.White);
        _board.PlacePiece(rook.Position, rook);
        var targetPosition = new Position(1, 7);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.Contains(targetPosition, moves);
        _king.MakeMove(_board, targetPosition);
        Assert.Equal(_king, _board.GetPositionPiece(targetPosition));
        Assert.Equal(rook, _board.GetPositionPiece(new Position(1, 6)));
    }

    [Fact]
    public void LeftSideCastlingWithObstacles()
    {
        _king.Position = new Position(1, 5);
        _board.PlaceAndRemove(new Position(1, 5), _king);
        var rook = new Rook(new Position(1, 1), Color.White);
        _board.PlacePiece(rook.Position, rook);
        var pawn = new Pawn(new Position(1, 2), Color.White);
        _board.PlacePiece(pawn.Position, pawn);
        var targetPosition = new Position(1, 3);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.DoesNotContain(targetPosition, moves);
    }

    [Fact]
    public void LeftSideCastlingWithMate()
    {
        _king.Position = new Position(1, 5);
        _board.PlaceAndRemove(new Position(1, 5), _king);
        var rook = new Rook(new Position(1, 1), Color.White);
        _board.PlacePiece(rook.Position, rook);
        var enemyRook = new Rook(new Position(4, 4), Color.Black);
        _board.PlacePiece(enemyRook.Position, enemyRook);
        var targetPosition = new Position(1, 3);
        var moves = _king.GetAllPossibleMoves(_board);
        Assert.DoesNotContain(targetPosition, moves);
    }
}
