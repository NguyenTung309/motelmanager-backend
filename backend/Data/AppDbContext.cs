using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MotelRoom> MotelRooms { get; set; }
        public DbSet<RequestRegister> RequestRegisters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Password).IsRequired();
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
                entity.Property(u => u.IsActive).HasDefaultValue(false);
            });

            // RequestRegister
            modelBuilder.Entity<RequestRegister>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Username).IsRequired().HasMaxLength(50);
                entity.Property(r => r.Password).IsRequired();
                entity.Property(r => r.Role).IsRequired().HasMaxLength(20);
                entity.Property(r => r.IsApproved).HasDefaultValue(false);
                entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // MotelRoom
            modelBuilder.Entity<MotelRoom>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Title).IsRequired().HasMaxLength(100);
                entity.Property(m => m.Address).IsRequired().HasMaxLength(200);
                entity.Property(m => m.Price).IsRequired();
                entity.Property(m => m.Description).HasMaxLength(500);
                entity.HasOne(m => m.Owner)
                      .WithMany()
                      .HasForeignKey(m => m.OwnerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
