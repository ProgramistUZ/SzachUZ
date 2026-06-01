using System.Diagnostics;
using Infrastructure.Services;

namespace Tests.Infrastructure;

public class GameIdGeneratorTest
{
    [Fact]
    public void TestGenerateGuid()
    {
        var generator = new GameIdGenerator();
        var gameId = generator.GenerateJoinGameId();
        Debug.WriteLine($"Generated Game ID: {gameId}");
        Assert.False(string.IsNullOrEmpty(gameId));
    }

    [Fact]
    public void GenerateGameId_ShouldBeUniqueFor100_000()
    {
        var generator = new GameIdGenerator();
        var generatedIds = new HashSet<string>();
        const int numberOfIds = 100_000;

        for (int i = 0; i < numberOfIds; i++)
        {
            var gameId = generator.GenerateJoinGameId();
            generatedIds.Add(gameId);
        }

        Assert.Equal(numberOfIds, generatedIds.Count);
    }
}
