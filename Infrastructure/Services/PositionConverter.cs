using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class PositionConverter : IPositionConverter
{
    public Position ConvertPositionToChess(Position position)
    {
        return new Position(8 - position.Row, position.Col + 1);
    }

    public Position ConvertToBoardPosition(Position position)
    {
        return new Position(8 - position.Row, position.Col - 1);
    }
}
