using Domain.Entities;
using Domain.Interfaces;
using Domain.ValueObjects;

namespace Infrastructure.Services;

public class MoveValidator : IMoveValidator
{
    public bool IsInCheck(ChessBoard board, Color color)
    {
        Position kingPos = color == Color.White ? board.WhiteKing : board.BlackKing;
        Console.WriteLine($"KING POS: {kingPos} CHECKING FOR CHECK COLOR : {color}");


        foreach (var piece in board.GetAllPieces())
        {
            if (piece == null)
            {
                continue;
            }

            if (piece.Color != color && piece.GetAllPossibleMoves(board).Contains(kingPos))
            {
                Console.WriteLine($"{piece.Name} AT {piece.Position} ATAKUJE KROLA? with POSSIBLE MOVES" );
                foreach(var move in piece.GetAllPossibleMoves(board))
                {
                    Console.WriteLine(move);
                }

                Console.WriteLine($"CZY TO PRAWDA {piece.GetAllPossibleMoves(board).Contains(kingPos)}");
                Console.Write(kingPos.ToString());
                return true;
            }
        }

        return false;
    }

    public bool IsInMate(ChessBoard board, Color color)
    {
        Position kingPos = color == Color.White ? board.WhiteKing : board.BlackKing;
        var king = board.GetPositionPiece(kingPos);


        List<Position> possibleMoves = king.GetAllPossibleMoves(board);

        if (IsInCheck(board, color))
        {
            ChessBoard copyBoard = board.Clone();


            // check if king can move out of check if yes false
            if (possibleMoves.Count == 0)
            {
                foreach (var move in possibleMoves)
                {
                    copyBoard = board.Clone();

                    PieceBase? piece = copyBoard.GetPositionPiece(kingPos);

                    if (piece == null)
                    {
                        continue;
                    }

                    piece.MakeMove(copyBoard, move);

                    if (!IsInCheck(copyBoard, color))
                    {
                        return false;
                    }
                }
            }

            // check if any piece can block if yes false
            foreach (var move in possibleMoves)
            {
                copyBoard = board.Clone();
                foreach (var piece in copyBoard.GetAllPieces())
                {
                    if (piece != null && piece.Color == color && piece.GetAllPossibleMoves(copyBoard).Contains(move))
                    {
                        var originalPosition = piece.Position;
                        piece.MakeMove(copyBoard, move);

                        if (!IsInCheck(copyBoard, color))
                        {
                            return false;
                        }
                    }
                }
            }

            copyBoard = board.Clone();

            //check if we can capture attacking piece
            foreach (var piece in copyBoard.GetAllPieces())
            {
                if(piece != null && piece.Color != color && piece.GetAllPossibleMoves(copyBoard).Contains(kingPos))
                {
                    var originalPosition = piece.Position;

                    foreach(var p in copyBoard.GetAllPieces())
                    {
                        if(p != null && p.Color == color && p.GetAllPossibleMoves(copyBoard).Contains(originalPosition))
                        {
                            p.MakeMove(copyBoard, originalPosition);
                            if (!IsInCheck(copyBoard, color)) { return false; }
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }
}
