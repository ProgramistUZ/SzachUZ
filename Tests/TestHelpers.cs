using Domain.Entities;
using Infrastructure.Services;

namespace Tests;

internal static class TestHelpers
{
    public static ChessBoard CreateBoard() => new ChessBoard(new PositionConverter());
}
