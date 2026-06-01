using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class GameIdGenerator : IGameIdGenerator
{
    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private const int IdLength = 6;

    private readonly ConcurrentDictionary<string, byte> _usedIds = new();

    public string GenerateJoinGameId()
    {
        while (true)
        {
            var candidate = GenerateRandomId();
            if (_usedIds.TryAdd(candidate, 0))
                return candidate;
        }
    }

    private static string GenerateRandomId()
    {
        var stringBuilder = new StringBuilder(IdLength);
        Span<byte> randomBytes = stackalloc byte[IdLength];
        RandomNumberGenerator.Fill(randomBytes);

        for (int i = 0; i < IdLength; i++)
        {
            int randomIndex = randomBytes[i] % Chars.Length;
            stringBuilder.Append(Chars[randomIndex]);
        }

        return stringBuilder.ToString();
    }
}
