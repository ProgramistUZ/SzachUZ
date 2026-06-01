using Domain.Entities;

namespace Domain.Interfaces;

public interface IPositionConverter
{
    Position ConvertPositionToChess(Position position);
    Position ConvertToBoardPosition(Position position);
}
