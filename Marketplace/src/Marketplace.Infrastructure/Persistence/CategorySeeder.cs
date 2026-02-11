using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Persistence;

public static class CategorySeeder
{
    public static async Task SeedAsync(MarketplaceDbContext db, CancellationToken ct = default)
    {
        if (await db.Categories.AnyAsync(ct))
            return;

        // Create IDs so translations can reference them
        var vehiclesId = Guid.NewGuid();
        var carsId = Guid.NewGuid();
        var electronicsId = Guid.NewGuid();
        var phonesId = Guid.NewGuid();

        var categories = new[]
        {
            new Category("vehicles", null) { }, // parent
            new Category("vehicles.cars", null) { }, // we'll set ParentId via reflection? -> we should set it via constructor; we used constructor with parentId
        };

        // Because our Category constructor takes parentId, create properly:
        var vehicles = new Category("vehicles", null);
        var cars = new Category("vehicles.cars", vehicles.Id);

        var electronics = new Category("electronics", null);
        var phones = new Category("electronics.phones", electronics.Id);

        // Sort order
        SetSort(vehicles, 10);
        SetSort(cars, 20);
        SetSort(electronics, 30);
        SetSort(phones, 40);

        db.Categories.AddRange(vehicles, cars, electronics, phones);

        db.CategoryTranslations.AddRange(
            // MK
            new CategoryTranslation(vehicles.Id, "mk", "Возила", "vozila"),
            new CategoryTranslation(cars.Id, "mk", "Автомобили", "avtomobili"),
            new CategoryTranslation(electronics.Id, "mk", "Електроника", "elektronika"),
            new CategoryTranslation(phones.Id, "mk", "Телефони", "telefoni"),

            // EN
            new CategoryTranslation(vehicles.Id, "en", "Vehicles", "vehicles"),
            new CategoryTranslation(cars.Id, "en", "Cars", "cars"),
            new CategoryTranslation(electronics.Id, "en", "Electronics", "electronics"),
            new CategoryTranslation(phones.Id, "en", "Phones", "phones"),

            // SQ
            new CategoryTranslation(vehicles.Id, "sq", "Automjete", "automjete"),
            new CategoryTranslation(cars.Id, "sq", "Makina", "makina"),
            new CategoryTranslation(electronics.Id, "sq", "Elektronikë", "elektronike"),
            new CategoryTranslation(phones.Id, "sq", "Telefona", "telefona")
        );

        await db.SaveChangesAsync(ct);
    }

    // small hack to set private setter SortOrder without changing domain too much
    private static void SetSort(Category c, int value)
    {
        var prop = typeof(Category).GetProperty("SortOrder");
        prop?.SetValue(c, value);
    }
}
