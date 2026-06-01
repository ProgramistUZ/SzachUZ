using System.Text;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class Bishop : PieceBase
{
    public Bishop(Position position, Color color) : base(color, PieceType.Bishop, position)
    {
    }

    public override object Clone()
    {
        return new Bishop(Position, Color);
    }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        var possibleMoves = new List<Position>();

        possibleMoves.AddRange(GetDiagonalMoves(board, 1, 1));  // up right
        possibleMoves.AddRange(GetDiagonalMoves(board, -1, 1));  // up left
        possibleMoves.AddRange(GetDiagonalMoves(board, 1, -1));  // down right
        possibleMoves.AddRange(GetDiagonalMoves(board, -1, -1));  // down left

        return possibleMoves;
    }

    private List<Position> GetDiagonalMoves(ChessBoard board, int rowDirection, int colDirection)
    {
        Position next = new Position(Position.Row + rowDirection, Position.Col + colDirection);
        var possibleMoves = new List<Position>();

        while (IsValidPosition(next))
        {
            var piece = board.GetPositionPiece(next);

            if (piece != null)
            {
                if (piece.Color == Color)
                {
                    break;
                }
                else
                {
                    possibleMoves.Add(next);
                    break;
                }
            }
            else
            {
                possibleMoves.Add(next);
            }
            next = new Position(next.Row + rowDirection, next.Col + colDirection);
        }
        return possibleMoves;
    }

    public override bool IsMoveValid(ChessBoard board, Position targetPosition)
    {
        return GetAllPossibleMoves(board).Contains(targetPosition);
    }
    public override string ToString()
    {
        StringBuilder color;
        if (Color == Color.White) color = new StringBuilder("w");
        else color = new StringBuilder("b");
        return color + "B";

    }
}
