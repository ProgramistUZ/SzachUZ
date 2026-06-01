using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Entities;

public abstract class PieceBase : ICloneable
{
    private readonly Color _color;
    private readonly PieceType _name;
    private Position _position;

    public Position Position
    {
        get { return _position; }
        set { _position = value; }
    }

    public Color Color
    {
        get { return _color; }
    }

    public PieceType Name
    {
        get { return _name; }
    }

    protected PieceBase(Color color, PieceType name, Position position)
    {
        _color = color;
        _name = name;
        _position = position;
    }

    public abstract object Clone();

    /// <summary>
    /// moves piece to given position
    /// </summary>
    /// <param name="board">our actual chessboard</param>
    /// <param name="targetPosition">position where piece will be placed</param>
    public virtual void MakeMove(ChessBoard board, Position targetPosition)
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

    /// <summary>
    /// checks if position is valid
    /// </summary>
    /// <param name="position">given position</param>
    /// <returns>true/false</returns>
    public bool IsValidPosition(Position position)
    {
        return position.Row >= 1 && position.Row <= 8 && position.Col >= 1 && position.Col <= 8;
    }

    /// <summary>
    /// gets all possible moves
    /// </summary>
    /// <param name="board">current board state</param>
    /// <returns>list of all possible moves</returns>
    public abstract List<Position> GetAllPossibleMoves(ChessBoard board);

    /// <summary>
    /// checks if move is valid
    /// </summary>
    /// <param name="board">current board state</param>
    /// <param name="targetPosition">position to which piece is supposed to be moved</param>
    /// <returns>true/false</returns>
    public abstract bool IsMoveValid(ChessBoard board, Position targetPosition);

    public override abstract string ToString();
}
