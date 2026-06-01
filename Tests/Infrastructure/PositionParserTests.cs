using Domain.Entities;
using Infrastructure.Services;

namespace Tests.Infrastructure;

public class PositionParserTests
{
    [Theory]
    [InlineData(2, 1, "A2")]
    [InlineData(8, 1, "A8")]
    [InlineData(1, 8, "H1")]
    [InlineData(4, 4, "D4")]
    public void Parse_PositionToString_ReturnsCorrectChessNotation(int row, int col, string expected)
    {
        var parser = new PositionParser();
        var position = new Position(row, col);

        var result = parser.Parse(position);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("A2", 2, 1)]
    [InlineData("A8", 8, 1)]
    [InlineData("H1", 1, 8)]
    [InlineData("D4", 4, 4)]
    public void Parse_StringToPosition_ReturnsCorrectPosition(string input, int expectedRow, int expectedCol)
    {
        var parser = new PositionParser();
        var result = parser.Parse(input);

        Assert.Equal(expectedRow, result.Row);
        Assert.Equal(expectedCol, result.Col);
    }
}
