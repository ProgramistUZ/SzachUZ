using Domain.Entities;

namespace Application.Interfaces;
public interface IPositionParser
{
    string Parse(Position position);
    Position Parse(string position);
    Position ParseNumeric(Position position);

}
