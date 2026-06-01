using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Interfaces;

public interface IMoveValidator
{
    bool IsInCheck(ChessBoard board, Color color);
    bool IsInMate(ChessBoard board, Color color);
}
