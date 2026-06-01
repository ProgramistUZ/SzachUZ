using Domain.Extensions;
using Domain.ValueObjects;

namespace Tests.Domain.Extensions;

public class EnumExtensionTest
{
    [Fact]
    public void Next_EnumValue_ReturnsNextValue()
    {
        Color currentColor = Color.Black;

        Color nextColor = currentColor.Next();

        Assert.Equal(Color.White, nextColor);
    }

    [Fact]
    public void Next_LastEnumValue_ReturnsFirstValue()
    {
        Color currentColor = Color.White;

        Color nextColor = currentColor.Next();

        Assert.Equal(Color.Black, nextColor);
    }
}
