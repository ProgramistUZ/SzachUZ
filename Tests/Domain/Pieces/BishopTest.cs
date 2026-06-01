using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Tests.Domain.Pieces;

public class BishopTest
{
    private ChessBoard _board;
    private Bishop _bishop;

    public BishopTest()
    {
        _board = TestHelpers.CreateBoard();
        _bishop = new Bishop(new Position(4, 4), Color.White);
        _board.PlacePiece(_bishop.Position, _bishop);
    }

    [Fact]
    public void Bishop_GetAllMoves_EmptyBoard()
    {
        var moves = _bishop.GetAllPossibleMoves(_board);
        Assert.Equal(13, moves.Count);
    }

    [Fact]
    public void Bishop_GetAllMoves_Obstacle()
    {
        var obstacle = new Bishop(new Position(5, 5), Color.White);
        _board.PlacePiece(obstacle.Position, obstacle);

        var moves = _bishop.GetAllPossibleMoves(_board);
        Assert.Equal(9, moves.Count);
    }

    [Fact]
    public void Bishop_CanAttack_OppositeColor()
    {
        var targetPosition = new Position(5, 5);
        var oppositeColorPiece = new Bishop(targetPosition, Color.Black);

        _board.PlacePiece(oppositeColorPiece.Position, oppositeColorPiece);

        Assert.True(_bishop.IsMoveValid(_board, targetPosition));
    }

    [Fact]
    public void Bishop_MakeMove_IncorrectPosition()
    {
        var incorrectPosition = new Position(5, 6);

        Assert.Throws<InvalidMoveException>(() => _bishop.MakeMove(_board, incorrectPosition));
        Assert.Null(_board.GetPositionPiece(incorrectPosition));
        Assert.NotNull(_board.GetPositionPiece(_bishop.Position));
    }
}
