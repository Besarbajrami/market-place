using Microsoft.AspNetCore.Identity;

namespace Marketplace.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsBlocked { get; set; }
    public string PreferredCulture { get; set; } = "mk";

}
