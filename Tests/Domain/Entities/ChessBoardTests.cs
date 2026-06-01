using Domain.Entities;
using Domain.Entities.Pieces;
using Domain.ValueObjects;

namespace Tests.Domain.Entities;

public class ChessBoardTests
{
    [Fact]
    public void PlacePiece_ValidPosition_PiecePlaced()
    {
        var position = new Position(4, 5);

        var pawn = new Pawn(position, Color.White);
        var chessBoard = TestHelpers.CreateBoard();

        chessBoard.PlacePiece(position, pawn);

        var pieceAtPosition = chessBoard.GetPositionPiece(position);
        Assert.NotNull(pieceAtPosition);
        Assert.Equal(pawn, pieceAtPosition);
    }

    [Fact]
    public void PlacePiece_Limits_PiecePlaced()
    {
        var position1 = new Position(1, 1);
        var position2 = new Position(8, 8);

        var pawn1 = new Pawn(position1, Color.White);
        var pawn2 = new Pawn(position2, Color.Black);

        var chessBoard = TestHelpers.CreateBoard();

        chessBoard.PlacePiece(position1, pawn1);
        chessBoard.PlacePiece(position2, pawn2);

        var pieceAtPosition1 = chessBoard.GetPositionPiece(position1);
        var pieceAtPosition2 = chessBoard.GetPositionPiece(position2);

        Assert.NotNull(pieceAtPosition1);
        Assert.Equal(pawn1, pieceAtPosition1);
        Assert.NotNull(pieceAtPosition2);
        Assert.Equal(pawn2, pieceAtPosition2);
    }
}
