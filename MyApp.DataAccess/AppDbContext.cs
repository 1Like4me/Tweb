using Microsoft.EntityFrameworkCore;
using MyApp.Domain.Entities;

namespace MyApp.DataAccess;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<HealthCheckEntry> HealthChecks => Set<HealthCheckEntry>();
    public DbSet<User> Users => Set<User>();
    public DbSet<EventType> EventTypes => Set<EventType>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.EventType)
            .WithMany(e => e.Bookings)
            .HasForeignKey(b => b.EventTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>().Property(u => u.Username).IsRequired();
        modelBuilder.Entity<User>().Property(u => u.PasswordHash).IsRequired();
        modelBuilder.Entity<User>().Property(u => u.Role).IsRequired();
        modelBuilder.Entity<EventType>().Property(e => e.Name).IsRequired();
        modelBuilder.Entity<EventType>().Property(e => e.Description).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.Duration).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.GuestCount).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
    }
}
