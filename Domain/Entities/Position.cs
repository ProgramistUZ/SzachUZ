namespace Domain.Entities;

public class Position
{
    private int _row;
    private int _col;

    public Position(int row, int col)
    {
        _row = row;
        _col = col;
    }

    public int Row
    {
        get { return _row; }
        set { _row = value; }
    }

    public int Col
    {
        get { return _col; }
        set { _col = value; }
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Row, Col);
    }

    public override bool Equals(object? obj)
    {
        if (this == obj) return true;
        if (obj == null || GetType() != obj.GetType()) return false;
        Position position = (Position)obj;
        return Row == position.Row && Col == position.Col;
    }

    public override string ToString()
    {
        return $"{Row},{Col}";
    }

}
