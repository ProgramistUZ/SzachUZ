namespace Domain.Extensions;

public static class EnumExtensions
{
    public static T Next<T>(this T enumValue) where T : Enum
    {
        var values = Enum.GetValues(typeof(T));
        int index = Array.IndexOf(values, enumValue);

        return (T)values.GetValue((index + 1) % values.Length)!;
    }
}
