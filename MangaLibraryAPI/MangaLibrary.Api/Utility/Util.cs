namespace MangaLibraryAPI.Utility;

public static class Util
{
    public static string Capitalize(string value)
    {
        return value.ToLower().Substring(0, 1).ToUpper() + value.ToLower().Substring(1);
    }
}