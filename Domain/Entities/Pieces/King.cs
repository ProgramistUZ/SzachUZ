using System.Text;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class King : PieceBase
{
    public bool HasMoved { get; set; }

    public King(Position position, Color color) : base(color, PieceType.King, position)
    {
        HasMoved = false;
    }

    public override void MakeMove(ChessBoard board, Position targetPosition)
    {
        if (IsMoveValid(board, targetPosition))
        {
            int row = Position.Row;
            if (!HasMoved && Position.Col == 5)
            {
                if (targetPosition.Col == 7)
                {
                    var rook = board.GetPositionPiece(new Position(row, 8)) as Rook;
                    if (rook != null)
                    {
                        board.PlaceAndRemove(new Position(row, 6), rook);
                        rook.HasMoved = true;
                    }
                }
                else if (targetPosition.Col == 3)
                {
                    var rook = board.GetPositionPiece(new Position(row, 1)) as Rook;
                    if (rook != null)
                    {
                        board.PlaceAndRemove(new Position(row, 4), rook);
                        rook.HasMoved = true;
                    }
                }
            }

            board.PlaceAndRemove(targetPosition, this);
            HasMoved = true;
        }
        else
        {
            throw new InvalidMoveException();
        }
    }

    private bool IsPathSafe(ChessBoard board, List<Position> path, Color kingColor)
    {
        foreach (var piece in board.GetAllPieces())
        {
            if (piece == null || piece.Color == kingColor)
                continue;

            var possibleMoves = piece.GetAllPossibleMoves(board);


            foreach (var position in path)
            {
                if (possibleMoves.Contains(position))
                {
                    return false;
                }
            }
        }

        return true;
    }

    private void AddCastlingMoves(List<Position> possibleMoves, ChessBoard board)
    {
        if (HasMoved) return;

        int row = Position.Row;

        // Right side castling
        var kingsideRookPos = new Position(row, 8);
        var kingsideRook = board.GetPositionPiece(kingsideRookPos) as Rook;

        if (kingsideRook != null && !kingsideRook.HasMoved)
        {
            var between1 = board.GetPositionPiece(new Position(row, 6));
            var between2 = board.GetPositionPiece(new Position(row, 7));

            if (between1 == null && between2 == null)
            {
                var path = new List<Position> { Position, new Position(row,6) };

                if (IsPathSafe(board, path, Color))
                {
                    possibleMoves.Add(new Position(row, 7));
                }
            }
        }

        // Left side castling
        var queensideRookPos = new Position(row, 1);
        var queensideRook = board.GetPositionPiece(queensideRookPos) as Rook;

        if (queensideRook != null && !queensideRook.HasMoved)
        {
            var between1 = board.GetPositionPiece(new Position(row, 2));
            var between2 = board.GetPositionPiece(new Position(row, 3));
            var between3 = board.GetPositionPiece(new Position(row, 4));

            if (between1 == null && between2 == null && between3 == null)
            {
                var path = new List<Position> { Position, new Position(row,4),new Position(row,3) };

                if (IsPathSafe(board, path, Color))
                {
                    possibleMoves.Add(new Position(row, 3));
                }
            }
        }
    }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        var moveUp = new Position(
            Position.Row + 1,
            Position.Col
        );

        var moveDown = new Position(
            Position.Row - 1,
            Position.Col
        );

        var moveLeft = new Position(
            Position.Row,
            Position.Col - 1
        );

        var moveRight = new Position(
            Position.Row,
            Position.Col + 1
        );

        var moveUpLeft = new Position(
            Position.Row + 1,
            Position.Col - 1
        );

        var moveUpRight = new Position(
            Position.Row + 1,
            Position.Col + 1
        );

        var moveDownLeft = new Position(
            Position.Row - 1,
            Position.Col - 1
        );

        var moveDownRight = new Position(
            Position.Row - 1,
            Position.Col + 1
        );

        var possibleMoves = new List<Position>()
                { moveUp, moveDown, moveLeft, moveRight, moveUpLeft, moveUpRight, moveDownLeft, moveDownRight };

        foreach (var move in possibleMoves.ToList())
        {
            if (board.GetPositionPiece(move) != null && board.GetPositionPiece(move)!.Color == Color || !IsValidPosition(move))
            {
                possibleMoves.Remove(move);
            }
        }

        AddCastlingMoves(possibleMoves, board); ;
        return possibleMoves;
    }

    public override object Clone()
    {
        return new King(Position, Color);
    }

    public override bool IsMoveValid(ChessBoard board, Position targetPosition)
    {
        return GetAllPossibleMoves(board).Contains(targetPosition) &&
               IsValidPosition(targetPosition);
    }

    public override string ToString()
    {
        StringBuilder color;
        if (Color == Color.White) color = new StringBuilder("w");
        else color = new StringBuilder("b");
        return color+"K";
    }
}
