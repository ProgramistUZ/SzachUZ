using System.Text;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Entities.Pieces;

public class Pawn : PieceBase
{
    private bool _hasMoved;
    private int _promotionRow;
    public int MoveCount { get; set; }


    public Pawn(Position position, Color color) : base(color, PieceType.Pawn, position)
    {
        _hasMoved = false;
        _promotionRow = Color == Color.White ? 8 : 1;
        MoveCount = 0;
    }

    public Pawn(Position position, Color color, int moveCount) : base(color, PieceType.Pawn, position)
    {
        _hasMoved = false;
        _promotionRow = Color == Color.White ? 8 : 1;
        MoveCount = moveCount;
    }


    public override void MakeMove(ChessBoard board, Position targetPosition)
    {
        Console.WriteLine(
            $"Pawn moving from {Position.Row},{Position.Col} to {targetPosition.Row},{targetPosition.Col}.");

        // Pawn promotion
        Console.WriteLine("BEFORE PROMOTE :" + targetPosition.Row + " : " + _promotionRow);
        if (targetPosition.Row == _promotionRow)
        {
            var promoted = new Queen(targetPosition, Color);
            Console.WriteLine($"Promoting Pawn to Queen at {targetPosition.Row},{targetPosition.Col}");

            board.PlacePiece(targetPosition, promoted);
            board.RemovePiece(Position);

            Console.WriteLine(
                $"Current piece at {targetPosition.Row},{targetPosition.Col}: {board.GetPositionPiece(targetPosition)?.Name}");
            MoveCount++;
            return;
        }

        // En passant
        if (targetPosition.Row == Position.Row + GetDirection())
        {
            if (targetPosition.Col == Position.Col - 1)
            {
                var pawn = board.GetPositionPiece(new Position(Position.Row, Position.Col - 1)) as Pawn;
                if (pawn != null && pawn.Color != Color && pawn.MoveCount == 1)
                {
                    board.RemovePiece(pawn.Position);
                    board.PlaceAndRemove(new Position(Position.Row + GetDirection(), Position.Col - 1), this);
                    MoveCount++;
                    return;
                }
            }

            if (targetPosition.Col == Position.Col + 1)
            {
                var pawn = board.GetPositionPiece(new Position(Position.Row, Position.Col + 1)) as Pawn;
                if (pawn != null && pawn.Color != Color)
                {
                    board.RemovePiece(pawn.Position);
                    board.PlaceAndRemove(new Position(Position.Row + GetDirection(), Position.Col + 1), this);
                    MoveCount++;
                    return;
                }
            }
        }


        //normal move
        if (IsMoveValid(board, targetPosition))
        {
            board.PlaceAndRemove(targetPosition, this);
            _hasMoved = true;
            MoveCount++;
        }
        else
        {
            throw new InvalidMoveException();
        }
    }

    public override List<Position> GetAllPossibleMoves(ChessBoard board)
    {
        List<Position> possibleMoves = new List<Position>();

        // UP MOVES
        Position oneStepMove = new Position( // add one-step move
            Position.Row + GetDirection(),
            Position.Col
        );
        if (board.GetPositionPiece(oneStepMove) == null && IsValidPosition(oneStepMove))
        {
            possibleMoves.Add(oneStepMove);
        }

        if (!_hasMoved)
        {
            Position twoStepMove = new Position( // add two-step move
                Position.Row + 2 * GetDirection(),
                Position.Col
            );

            if (board.GetPositionPiece(twoStepMove) == null &&
                IsValidPosition(twoStepMove) &&
                board.GetPositionPiece(oneStepMove) == null)
            {
                possibleMoves.Add(twoStepMove);
            }
        }

        //EN PASSANT MOVES
        // black pawn moves 2 squares
        var leftPawn = board.GetPositionPiece(new Position(Position.Row, Position.Col - 1)) as Pawn;
        var rightPawn = board.GetPositionPiece(new Position(Position.Row, Position.Col + 1)) as Pawn;
        if (Position.Row == 5 && Color == Color.White)
        {
            if (leftPawn is not null)
            {
                if (leftPawn.Color == Color.Black && leftPawn.MoveCount == 1)
                {
                    possibleMoves.Add(new Position(Position.Row + GetDirection(), leftPawn.Position.Col));
                }
            }

            if (rightPawn is not null)
            {
                if (rightPawn.Color == Color.Black && rightPawn.MoveCount == 1)
                {
                    possibleMoves.Add(new Position(Position.Row + GetDirection(), rightPawn.Position.Col));
                }
            }
        }


        //white moves 2 squares
        if (Position.Row == 4 && Color == Color.Black)
        {
            if (leftPawn is not null)
            {
                if (leftPawn.Color == Color.White && leftPawn.MoveCount == 1)
                {
                    possibleMoves.Add(new Position(Position.Row + GetDirection(), leftPawn.Position.Col));
                }
            }

            if (rightPawn is not null)
            {
                if (rightPawn.Color == Color.White && rightPawn.MoveCount == 1)
                {
                    possibleMoves.Add(new Position(Position.Row + GetDirection(), rightPawn.Position.Col));
                }
            }
        }


        Console.WriteLine("-------------------------------");
        foreach (var possibleMove in possibleMoves)
        {
            Console.WriteLine(possibleMove);
        }

        Console.WriteLine("-------------------------------");

        // PROMOTION MOVE
        if (oneStepMove.Row == _promotionRow
            && IsValidPosition(oneStepMove)
            && board.GetPositionPiece(oneStepMove) == null)
            if (oneStepMove.Row == _promotionRow)
            {
                possibleMoves.Add(oneStepMove);
            }


        // DIAGONAL MOVES
        Position positionLeftDiagonal = new Position( // add left diagonal
            Position.Row + GetDirection(),
            Position.Col - 1
        );

        if (IsValidPosition(positionLeftDiagonal))
        {
            PieceBase? piece = board.GetPositionPiece(positionLeftDiagonal);
            if (piece != null && piece.Color != Color)
            {
                possibleMoves.Add(positionLeftDiagonal);
            }
        }

        Position positionRightDiagonal = new Position( //add right diagonal
            Position.Row + GetDirection(),
            Position.Col + 1
        );

        if (IsValidPosition(positionRightDiagonal))
        {
            PieceBase? piece = board.GetPositionPiece(positionRightDiagonal);
            if (piece != null && piece.Color != Color)
            {
                possibleMoves.Add(positionRightDiagonal);
            }
        }

        return possibleMoves;
    }

    public override bool IsMoveValid(ChessBoard board, Position targetPosition)
    {
        return GetAllPossibleMoves(board).Contains(targetPosition);
    }

    public override object Clone()
    {
        if (Position.Row == _promotionRow)
        {
            return new Queen(Position, Color);
        }

        return new Pawn(Position, Color, MoveCount);
    }

    /// <summary>
    /// defines in which direction Pawn should go
    /// </summary>
    /// <returns>1 for white Pawn, -1 for black Pawn</returns>
    private int GetDirection()
    {
        return Color == Color.White ? 1 : -1;
    }

    public override string ToString()
    {
        StringBuilder color;
        if (Color == Color.White) color = new StringBuilder("w");
        else color = new StringBuilder("b");
        return color + "P";
    }
}
