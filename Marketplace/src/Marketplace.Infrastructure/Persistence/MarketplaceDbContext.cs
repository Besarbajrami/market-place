using Marketplace.Domain.Common;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;

namespace Marketplace.Infrastructure.Persistence;

public class MarketplaceDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public MarketplaceDbContext(DbContextOptions<MarketplaceDbContext> options)
        : base(options)
    {
    }

    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CategoryTranslation> CategoryTranslations => Set<CategoryTranslation>();
    public DbSet<ListingImage> ListingImages => Set<ListingImage>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<ListingReport> ListingReports => Set<ListingReport>();
    public DbSet<ConversationParticipant> ConversationParticipants => Set<ConversationParticipant>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<CategoryAttribute> CategoryAttributes => Set<CategoryAttribute>();
    public DbSet<CategoryAttributeOption> CategoryAttributeOptions => Set<CategoryAttributeOption>();
    public DbSet<ListingAttributeValue> ListingAttributeValues => Set<ListingAttributeValue>();
    public DbSet<CategoryAttributeTranslation> CategoryAttributeTranslations => Set<CategoryAttributeTranslation>();
    public DbSet<CategoryAttributeOptionTranslation> CategoryAttributeOptionTranslations => Set<CategoryAttributeOptionTranslation>();

    public DbSet<Country>Countries => Set<Country>();
    public DbSet<City>Cities => Set<City>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ConfigureCategories(modelBuilder);
        ConfigureCountries(modelBuilder); 
        ConfigureCities(modelBuilder);   
        ApplySoftDeleteQueryFilter(modelBuilder);
        ConfigureListings(modelBuilder);
        ConfigureConversations(modelBuilder);
        ConfigureMessages(modelBuilder);
        ConfigureFavorites(modelBuilder);
        ConfigureListingReports(modelBuilder);
        ConfigureConversationParticipants(modelBuilder);
        ConfigureUserProfiles(modelBuilder);
        ConfigureRefreshTokens(modelBuilder);
        ConfigureCategoryAttribute(modelBuilder);
        ConfigureCategoryAttributeTranslation(modelBuilder);
        ConfigureCategoryAttributeOptionTranslation(modelBuilder);
    }

    private static void ApplySoftDeleteQueryFilter(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                continue;

            var method = typeof(MarketplaceDbContext)
                .GetMethod(nameof(SetSoftDeleteFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)!
                .MakeGenericMethod(entityType.ClrType);

            method.Invoke(null, new object[] { modelBuilder });
        }
    }

    private static void SetSoftDeleteFilter<TEntity>(ModelBuilder modelBuilder)
        where TEntity : BaseEntity
    {
        modelBuilder.Entity<TEntity>()
            .HasQueryFilter(e => e.DeletedAt == null);
    }
    private static void ConfigureCountries(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Country>(entity =>
        {
            entity.ToTable("Countries");

            entity.HasKey(x => x.Code);

            entity.Property(x => x.Code)
                .HasMaxLength(2)
                .IsRequired();

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(x => x.Name)
                .IsUnique();
        });
    }
    private static void ConfigureCities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<City>(entity =>
        {
            entity.ToTable("Cities");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.CountryCode)
                .HasMaxLength(2)
                .IsRequired();

            entity.HasIndex(x => new { x.CountryCode, x.Name })
                .IsUnique();

            entity.HasOne<Country>()
                .WithMany()
                .HasForeignKey(x => x.CountryCode)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureListings(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Listing>(b =>
        {
            b.ToTable("listings");
            b.HasKey(x => x.Id);

            b.Property(x => x.Title).HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(6000);

            b.Property(x => x.Price).HasPrecision(18, 2);
            b.Property(x => x.Currency).HasMaxLength(3);
            b.Property(x => x.Condition).HasMaxLength(20);

            b.Property(x => x.LocationCity).HasMaxLength(100);
            b.Property(x => x.LocationRegion).HasMaxLength(100);

            b.Property(x => x.Status);
            b.Property(x => x.ViewCount);
            b.Property(x => x.ModerationStatus);
            b.Property(x => x.ReportCount);
            b.Property(x => x.HiddenReason).HasMaxLength(500);
            b.Property(x => x.FeaturedUntil);
            b.Property(x => x.UrgentUntil);
            b.Property(x => x.BumpedAt);

            b.HasIndex(x => x.FeaturedUntil);
            b.HasIndex(x => x.UrgentUntil);
            b.HasIndex(x => x.BumpedAt);


            b.HasIndex(x => x.ModerationStatus);

            b.HasIndex(x => x.SellerId);
            b.HasIndex(x => x.CategoryId);
            b.HasIndex(x => new { x.Status, x.PublishedAt });
            b.HasIndex(x => x.Price);
            b.HasIndex(x => x.LocationCity);
            b.HasIndex(x => x.LocationRegion);

            // Relationship
            b.HasMany(x => x.Images)
       .WithOne(i => i.Listing)
       .HasForeignKey(i => i.ListingId)
       .OnDelete(DeleteBehavior.Cascade);

            b.Navigation(x => x.Images)
             .HasField("_images")
             .UsePropertyAccessMode(PropertyAccessMode.Field);

            modelBuilder.Entity<Listing>()
    .HasMany<ListingAttributeValue>()
    .WithOne()
    .HasForeignKey(a => a.ListingId)
    .OnDelete(DeleteBehavior.Cascade);


        });

        modelBuilder.Entity<ListingImage>(b =>
        {
            b.ToTable("listing_images");
            b.HasKey(x => x.Id);

            b.Property(x => x.Url).HasMaxLength(2000).IsRequired();
            b.Property(x => x.IsCover).IsRequired();
            b.Property(x => x.SortOrder).IsRequired();

            b.HasIndex(x => new { x.ListingId, x.SortOrder });
            b.HasIndex(x => new { x.ListingId, x.IsCover });
        });
    }


    private static void ConfigureConversations(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Conversation>(b =>
    {
        b.ToTable("conversations");
        b.HasKey(x => x.Id);

        b.Property(x => x.IsBlocked).IsRequired();
        b.Property(x => x.LastMessageAt).IsRequired();

        // critical: unique conversation per listing per buyer/seller
        b.HasIndex(x => new { x.ListingId, x.SellerId, x.BuyerId })
            .IsUnique();

        // for inbox list
        b.HasIndex(x => new { x.SellerId, x.LastMessageAt });
        b.HasIndex(x => new { x.BuyerId, x.LastMessageAt });

        // relations
        b.HasMany(x => x.Messages)
            .WithOne()
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    });
}

private static void ConfigureMessages(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Message>(b =>
    {
        b.ToTable("messages");
        b.HasKey(x => x.Id);

        b.Property(x => x.Body).HasMaxLength(2000).IsRequired();
        b.Property(x => x.SentAt).IsRequired();
        b.HasIndex(x => new { x.ConversationId, x.SentAt });
        b.HasIndex(x => new { x.ConversationId, x.Id }); // optional but useful
        b.HasIndex(x => x.SenderId);

    });
}
    private static void ConfigureCategories(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(b =>
        {
            b.ToTable("categories");
            b.HasKey(x => x.Id);

            b.Property(x => x.Code).HasMaxLength(100).IsRequired();
            b.HasIndex(x => x.Code).IsUnique();

            b.Property(x => x.IsActive).IsRequired();
            b.Property(x => x.SortOrder).IsRequired();

            b.HasMany(x => x.Translations)
                .WithOne()
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.ParentId);
        });

        modelBuilder.Entity<CategoryTranslation>(b =>
        {
            b.ToTable("category_translations");
            b.HasKey(x => x.Id);

            b.Property(x => x.Culture).HasMaxLength(5).IsRequired();
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.Slug).HasMaxLength(200).IsRequired();

            // one translation per culture per category
            b.HasIndex(x => new { x.CategoryId, x.Culture }).IsUnique();

            // for routing/seo later
            b.HasIndex(x => new { x.Culture, x.Slug }).IsUnique();
        });
    }
    private static void ConfigureFavorites(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>(b =>
        {
            b.ToTable("favorites");
            b.HasKey(x => x.Id);

            b.Property(x => x.UserId).IsRequired();
            b.Property(x => x.ListingId).IsRequired();

            // Prevent duplicates
            b.HasIndex(x => new { x.UserId, x.ListingId }).IsUnique();

            b.HasIndex(x => x.UserId);
            b.HasIndex(x => x.ListingId);
        });
    }
    private static void ConfigureListingReports(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ListingReport>(b =>
        {
            b.ToTable("listing_reports");
            b.HasKey(x => x.Id);

            b.Property(x => x.Reason).IsRequired();
            b.Property(x => x.Status).IsRequired();

            b.Property(x => x.Details).HasMaxLength(2000);

            b.HasIndex(x => x.ListingId);
            b.HasIndex(x => x.ReporterUserId);

            // prevent spam: one report per user per listing
            b.HasIndex(x => new { x.ListingId, x.ReporterUserId }).IsUnique();
        });
    }
    private static void ConfigureConversationParticipants(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ConversationParticipant>(b =>
        {
            b.ToTable("conversation_participants");
            b.HasKey(x => x.Id);

            b.Property(x => x.ConversationId).IsRequired();
            b.Property(x => x.UserId).IsRequired();

            b.HasIndex(x => new { x.ConversationId, x.UserId }).IsUnique();
            b.HasIndex(x => x.UserId);
        });
    }
    private static void ConfigureUserProfiles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfile>(b =>
        {
            b.ToTable("user_profiles");
            b.HasKey(x => x.Id);

            b.Property(x => x.UserId).IsRequired();
            b.Property(x => x.DisplayName).IsRequired().HasMaxLength(100);
            b.Property(x => x.AvatarUrl).HasMaxLength(500);

            b.HasIndex(x => x.UserId).IsUnique();
            b.HasIndex(x => x.DisplayName);
        });
    }
    private static void ConfigureRefreshTokens(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>(b =>
        {
            b.ToTable("refresh_tokens");

            b.HasKey(x => x.Id);

            b.Property(x => x.Token)
                .IsRequired()
                .HasMaxLength(200);

            b.HasIndex(x => x.Token)
                .IsUnique();

            b.HasIndex(x => x.UserId);

            b.Property(x => x.ExpiresAt)
                .IsRequired();

            b.Property(x => x.RevokedAt);
        });
    }
    private static void ConfigureCategoryAttribute(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryAttribute>(b =>
        {
            b.ToTable("CategoryAttributes");

            b.HasKey(x => x.Id);

            b.Property(x => x.Key)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(x => x.IsRequired)
                .IsRequired();

            b.Property(x => x.SortOrder)
                .IsRequired();

            // 🔥 CRITICAL FIX
            b.HasMany(a => a.Options)
                .WithOne()
                .HasForeignKey(o => o.CategoryAttributeId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Navigation(a => a.Options)
                .HasField("_options")
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        });


        modelBuilder.Entity<CategoryAttributeOption>(b =>
        {
            b.ToTable("CategoryAttributeOptions");

            b.HasKey(x => x.Id);

            b.Property(x => x.Value)
                .IsRequired()
                .HasMaxLength(200);

            b.Property(x => x.SortOrder)
                .IsRequired();
        });


        modelBuilder.Entity<ListingAttributeValue>(b =>
        {
            b.HasKey(x => x.Id);

            b.Property(x => x.Value)
                .IsRequired()
                .HasMaxLength(2000);

            b.HasOne<Listing>()
                .WithMany()
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });


    }
    private static void ConfigureCategoryAttributeTranslation(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryAttributeTranslation>(b =>
{
    b.HasKey(x => x.CategoryAttributeId);
    b.Property(x => x.Culture).HasMaxLength(5).IsRequired();
    b.Property(x => x.Label).HasMaxLength(200).IsRequired();

    b.HasIndex(x => new { x.CategoryAttributeId, x.Culture
    }).IsUnique();
});
    }
    private static void ConfigureCategoryAttributeOptionTranslation(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryAttributeOptionTranslation>(b =>
{
    b.HasKey(x => x.Id);
    b.Property(x => x.Culture).HasMaxLength(5).IsRequired();
    b.Property(x => x.Label).HasMaxLength(200).IsRequired();

    b.HasIndex(x => new { x.CategoryAttributeOptionId, x.Culture }).IsUnique();
});
    }
}
