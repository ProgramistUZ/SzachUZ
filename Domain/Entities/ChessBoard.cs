namespace Domain.Entities;

using Domain.ValueObjects;
using Domain.Interfaces;
using Domain.Entities.Pieces;

public class ChessBoard
{
    private readonly PieceBase?[,] _board;
    private Position _whiteKing;
    private Position _blackKing;

    private readonly IPositionConverter _converter;

    public ChessBoard(PieceBase?[,] board, IPositionConverter converter, Position whiteKing, Position blackKing)
    {
        _converter = converter;
        _board = board;

        _whiteKing = whiteKing;
        _blackKing = blackKing;
    }

    public ChessBoard(IPositionConverter converter)
    {
        _converter = converter;
        _board = new PieceBase[8, 8];

        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                _board[i, j] = null;
            }
        }

        _whiteKing = new Position(1, 5);
        _blackKing = new Position(8, 5);
    }

    public Position WhiteKing
    {
        get { return _whiteKing; }
    }

    public Position BlackKing
    {
        get { return _blackKing; }
    }

    /// <summary>
    /// return Piece in position
    /// </summary>
    /// <param name="position">position to check</param>
    /// <returns>possibly null piece in position</returns>
    public PieceBase? GetPositionPiece(Position position)
    {
        if (position.Row < 1 || position.Row > 8 || position.Col < 1 || position.Col > 8) return null;

        Position convertedPosition = _converter.ConvertToBoardPosition(position);
        return _board[convertedPosition.Row, convertedPosition.Col];
    }

    /// <summary>
    /// moves piece and removes it's current  location
    /// </summary>
    /// <param name="position">position for piece to be moved</param>
    /// <param name="piece">piece that should be moved</param>
    public void PlaceAndRemove(Position position, PieceBase piece)
    {
        Position lastPosition = piece.Position;

        if (piece.Name == PieceType.King)
        {
            if (piece.Color == Color.White)
            {
                _whiteKing = position;
            }
            else
            {
                _blackKing = position;
            }
        }

        piece.Position = position;
        PlacePiece(position, piece);
        RemovePiece(lastPosition);
    }

    /// <summary>
    /// places piece in given position on board
    /// </summary>
    /// <param name="position">position for piece to be placed</param>
    /// <param name="piece">piece that should be placed</param>
    public void PlacePiece(Position position, PieceBase piece)
    {
        Position convertedPosition = _converter.ConvertToBoardPosition(position);
        _board[convertedPosition.Row, convertedPosition.Col] = piece;
    }

    /// <summary>
    /// removes piece in given position
    /// </summary>
    /// <param name="position">position in which piece should be removed</param>
    public void RemovePiece(Position position)
    {
        Position convertedPosition = _converter.ConvertToBoardPosition(position);
        _board[convertedPosition.Row, convertedPosition.Col] = null;
    }

    public IEnumerable<PieceBase?> GetAllPieces()
    {
        foreach (var piece in _board)
        {
            if (piece != null)
            {
                yield return piece;
            }
        }
    }

    public ChessBoard Clone()
    {
        PieceBase?[,] clonedBoard = new PieceBase?[8, 8];

        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                if (_board[i, j] != null)
                {
                    clonedBoard[i, j] = (PieceBase?)(_board[i, j]?.Clone());
                }
                else
                {
                    clonedBoard[i, j] = null;
                }
            }
        }

        return new ChessBoard(clonedBoard, _converter, _whiteKing, _blackKing);
    }

    /// <summary>
    /// Sets up the ChessBoard with the default arrangement of pieces for a new game.
    /// </summary>
    /// <param name="board">The ChessBoard instance to populate with pieces.</param>
    /// <returns>The ChessBoard instance with the default pieces in their initial positions.</returns>
    public ChessBoard SetDefaultBoard(ChessBoard board)
    {
        // black pieces (główne na 8, piony na 7)
        // czarne piony
        for (int col = 1; col <= 8; col++)
        {
            var pos = new Position(7, col);
            board.PlacePiece(pos, new Pawn(pos, Color.Black));
        }
        // czarne główne figury
        board.PlacePiece(new Position(8, 1), new Rook(new Position(8, 1), Color.Black));
        board.PlacePiece(new Position(8, 2), new Knight(new Position(8, 2), Color.Black));
        board.PlacePiece(new Position(8, 3), new Bishop(new Position(8, 3), Color.Black));
        board.PlacePiece(new Position(8, 4), new Queen(new Position(8, 4), Color.Black));
        board.PlacePiece(new Position(8, 5), new King(new Position(8, 5), Color.Black));
        board.PlacePiece(new Position(8, 6), new Bishop(new Position(8, 6), Color.Black));
        board.PlacePiece(new Position(8, 7), new Knight(new Position(8, 7), Color.Black));
        board.PlacePiece(new Position(8, 8), new Rook(new Position(8, 8), Color.Black));

        // białe piony
        for (int col = 1; col <= 8; col++)
        {
            var pos = new Position(2, col);
            board.PlacePiece(pos, new Pawn(pos, Color.White));
        }
        // białe główne figury
        board.PlacePiece(new Position(1, 1), new Rook(new Position(1, 1), Color.White));
        board.PlacePiece(new Position(1, 2), new Knight(new Position(1, 2), Color.White));
        board.PlacePiece(new Position(1, 3), new Bishop(new Position(1, 3), Color.White));
        board.PlacePiece(new Position(1, 4), new Queen(new Position(1, 4), Color.White));
        board.PlacePiece(new Position(1, 5), new King(new Position(1, 5), Color.White));
        board.PlacePiece(new Position(1, 6), new Bishop(new Position(1, 6), Color.White));
        board.PlacePiece(new Position(1, 7), new Knight(new Position(1, 7), Color.White));
        board.PlacePiece(new Position(1, 8), new Rook(new Position(1, 8), Color.White));

        return board;
    }

    public string[,] ToArrayString()
    {
        string[,] board = new string[8,8];
        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                if (_board[i, j] != null)
                {
                    board[i,j] = _board[i, j].ToString();
                }
                else
                {
                    board[i,j] = "";
                }
            }
        }

        return board;
    }

}
