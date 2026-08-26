using System.Security.Claims;

namespace API.Extensions;

public static class UserIdExtensions
{
    public static string GetId(this ClaimsPrincipal User)
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new Exception("Could not get user id from claims");
    }
}
