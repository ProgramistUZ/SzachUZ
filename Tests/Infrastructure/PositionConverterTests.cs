using Domain.Entities;
using Infrastructure.Services;

namespace Tests.Infrastructure;

public class PositionConverterTests
{
    [Fact]
    public void ConvertToBoardPosition_ValidChessPosition_ReturnsCorrectBoardPosition()
    {
        var converter = new PositionConverter();
        var chessPosition = new Position(5, 8);
        var expectedBoardPosition = new Position(3, 7);

        var convertedPosition = converter.ConvertToBoardPosition(chessPosition);

        Assert.Equal(expectedBoardPosition, convertedPosition);
    }

    [Fact]
    public void ConvertToChessPosition_ValidBoardPosition_ReturnsCorrectChessPosition()
    {
        var converter = new PositionConverter();
        var boardPosition = new Position(3, 7);
        var expectedChessPosition = new Position(5, 8);

        var convertedPosition = converter.ConvertPositionToChess(boardPosition);

        Assert.Equal(expectedChessPosition, convertedPosition);
    }
}
