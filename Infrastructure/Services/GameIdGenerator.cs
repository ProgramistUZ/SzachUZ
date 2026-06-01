using System.Security.Cryptography;
using System.Text;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class GameIdGenerator : IGameIdGenerator
{
    private readonly HashSet<string> usedId = new HashSet<string>();

    public string GenerateJoinGameId()
    {
        string gameId;

        do
        {
            gameId = GenerateRandomId();
        } while (usedId.Contains(gameId));

        return gameId;
    }

    private string GenerateRandomId()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder stringBuilder = new StringBuilder(6);

        byte[] randomBytes = new byte[6];

        using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        for (int i = 0; i < 6; i++)
        {
            int randomIndex = randomBytes[i] % chars.Length;
            stringBuilder.Append(chars[randomIndex]);
        }

        return stringBuilder.ToString();
    }
}
