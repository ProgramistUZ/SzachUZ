using System.Text;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class Rook : PieceBase
{
    public bool HasMoved { get; set; }
    public Rook(Position position, Color color) : base(color, PieceType.Rook, position)
    {
        HasMoved = false;
    }

    public override object Clone()
    {
        return new Rook(new Position(Position.Row, Position.Col), Color) { HasMoved = HasMoved };
    }

    public override void MakeMove(ChessBoard board, Position targetPosition)
    {
        if (IsMoveValid(board, targetPosition))
        {
            board.PlaceAndRemove(targetPosition, this);
            HasMoved = true;
        }
        else
        {
            throw new InvalidMoveException();
        }
    }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        var possibleMoves = new List<Position>();

        possibleMoves.AddRange(GetVertHorMoves(board, 1, 0));  // up
        possibleMoves.AddRange(GetVertHorMoves(board, 0, 1));  // right
        possibleMoves.AddRange(GetVertHorMoves(board, -1, 0));  // down
        possibleMoves.AddRange(GetVertHorMoves(board, 0, -1));  // left

        return possibleMoves;
    }

    public List<Position> GetVertHorMoves(ChessBoard board, int rowDirection, int colDirection)
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
        return color + "R";

    }

}
