using System.Text;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class Queen : PieceBase
{
    public Queen(Position position, Color color) : base(color, PieceType.Queen, position)
    {
    }

    public override object Clone()
    {
        return new Queen(Position, Color);
    }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        var possibleMoves = new List<Position>();

        possibleMoves.AddRange(GetPossibleMoves(board, 1, 0));  // up
        possibleMoves.AddRange(GetPossibleMoves(board, 0, 1));  // right
        possibleMoves.AddRange(GetPossibleMoves(board, -1, 0));  // down
        possibleMoves.AddRange(GetPossibleMoves(board, 0, -1));  // left
        possibleMoves.AddRange(GetPossibleMoves(board, 1, 1));  // up right
        possibleMoves.AddRange(GetPossibleMoves(board, -1, 1));  // up left
        possibleMoves.AddRange(GetPossibleMoves(board, 1, -1));  // down right
        possibleMoves.AddRange(GetPossibleMoves(board, -1, -1));  // down left
        return possibleMoves;
    }

    public List<Position> GetPossibleMoves(ChessBoard board, int rowDirection, int colDirection)
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
        return color + "Q";

    }
}
