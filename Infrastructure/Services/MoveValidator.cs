using Domain.Entities;
using Domain.Interfaces;
using Domain.ValueObjects;

namespace Infrastructure.Services;

public class MoveValidator : IMoveValidator
{
    public bool IsInCheck(ChessBoard board, Color color)
    {
        Position kingPos = color == Color.White ? board.WhiteKing : board.BlackKing;

        foreach (var piece in board.GetAllPieces())
        {
            if (piece == null || piece.Color == color)
                continue;

            if (piece.GetAllPossibleMoves(board).Contains(kingPos))
                return true;
        }

        return false;
    }

    public bool IsInMate(ChessBoard board, Color color)
    {
        if (!IsInCheck(board, color))
            return false;

        return !HasAnyLegalMove(board, color);
    }

    private bool HasAnyLegalMove(ChessBoard board, Color color)
    {
        foreach (var piece in board.GetAllPieces().ToList())
        {
            if (piece == null || piece.Color != color)
                continue;

            var from = piece.Position;
            foreach (var to in piece.GetAllPossibleMoves(board))
            {
                var clone = board.Clone();
                var clonedPiece = clone.GetPositionPiece(from);
                if (clonedPiece == null)
                    continue;

                try
                {
                    clonedPiece.MakeMove(clone, to);
                }
                catch
                {
                    continue;
                }

                if (!IsInCheck(clone, color))
                    return true;
            }
        }

        return false;
    }
}
