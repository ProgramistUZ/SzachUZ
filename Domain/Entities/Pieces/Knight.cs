using System.Text;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class Knight : PieceBase
{
    public Knight(Position position, Color color) : base(color, PieceType.Knight, position) { }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        List<Position> moves = new List<Position>();

        Position moveUpRight = new Position(
            Position.Row + 2,
            Position.Col + 1
        );
        moves.Add(moveUpRight);
        Position moveUpLeft = new Position(
            Position.Row + 2,
            Position.Col - 1
        );
        moves.Add(moveUpLeft);
        Position moveLeftUp = new Position(
            Position.Row + 1,
            Position.Col - 2
        );
        moves.Add(moveLeftUp);
        Position moveLeftDown = new Position(
            Position.Row - 1,
            Position.Col - 2
        );
        moves.Add(moveLeftDown);
        Position moveDownLeft = new Position(
            Position.Row - 2,
            Position.Col - 1
        );
        moves.Add(moveDownLeft);
        Position moveDownRight = new Position(
            Position.Row - 2,
            Position.Col + 1
        );
        moves.Add(moveDownRight);
        Position moveRightUp = new Position(
            Position.Row + 1,
            Position.Col + 2
        );
        moves.Add(moveRightUp);
        Position moveRightDown = new Position(
            Position.Row - 1,
            Position.Col + 2
        );
        moves.Add(moveRightDown);

        foreach (Position move in moves.ToList())
        {
            if (board.GetPositionPiece(move) != null && board.GetPositionPiece(move)!.Color == Color || !IsValidPosition(move))
            {
                moves.Remove(move);
            }
        }

        return moves;
    }

    public override bool IsMoveValid(ChessBoard board, Position targetPosition)
    {
        return GetAllPossibleMoves(board).Contains(targetPosition);
    }


    public override object Clone()
    {
        return new Knight(Position, Color);
    }

    public override void MakeMove(ChessBoard board, Position targetPosition)
    {
        if (IsMoveValid(board, targetPosition))
        {
            board.PlaceAndRemove(targetPosition, this);
        }
        else
        {
            throw new InvalidMoveException();
        }
    }
    public override string ToString()
    {
        StringBuilder color;
        if (Color == Color.White) color = new StringBuilder("w");
        else color = new StringBuilder("b");
        return color + "N";

    }
}
