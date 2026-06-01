using Application.Interfaces;
using Domain.Entities;

namespace Infrastructure.Services;

public class PositionParser : IPositionParser
{
    public string Parse(Position position)
    {
        char col = (char)('A' + position.Col - 1);

        return $"{col}{position.Row}";

    }

    public Position ParseNumeric(Position position)
    {
        position.Col = position.Col - 1;
        position.Row = position.Row - 1;

        return position;
    }

    public Position Parse(string position)
    {
        var chars = position.ToCharArray();

        int row = int.Parse(position.Substring(1));
        int col = (chars[0] - 'A') + 1;

        return new Position(row, col);
    }
}
