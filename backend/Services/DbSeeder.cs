using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public static class DbSeeder
{
    public static async Task SeedAdminAsync(IServiceProvider services, IConfiguration configuration)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();

        await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync(u => u.Role == "admin"))
        {
            return;
        }

        var username = configuration["SeedAdmin:Username"] ?? "admin";
        var password = configuration["SeedAdmin:Password"] ?? "Admin@123";

        context.Users.Add(new User
        {
            Username = username.Trim(),
            Password = passwordService.Hash(password),
            Role = "admin",
            IsActive = true
        });

        await context.SaveChangesAsync();
    }
}
