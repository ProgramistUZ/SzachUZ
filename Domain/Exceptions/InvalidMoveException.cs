namespace Domain.Exceptions;

public class InvalidMoveException : Exception
{
    public InvalidMoveException() : base("Invalid move") { }

    public InvalidMoveException(string message) : base(message)
    {
    }
}
