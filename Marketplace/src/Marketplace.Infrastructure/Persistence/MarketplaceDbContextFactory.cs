using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Marketplace.Infrastructure.Persistence;

public sealed class MarketplaceDbContextFactory
    : IDesignTimeDbContextFactory<MarketplaceDbContext>
{
    public MarketplaceDbContext CreateDbContext(string[] args)
    {
        // Always resolve solution root
        var basePath = Path.Combine(
        Directory.GetCurrentDirectory(),
        "..", "Marketplace.Api"
    );

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.GetFullPath(basePath))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();


        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        var optionsBuilder = new DbContextOptionsBuilder<MarketplaceDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new MarketplaceDbContext(optionsBuilder.Options);
    }
}
