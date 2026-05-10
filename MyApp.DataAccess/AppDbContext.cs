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
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<EventType> EventTypes => Set<EventType>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>()
            .HasOne(p => p.User)
            .WithMany(u => u.Projects)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

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
        modelBuilder.Entity<Project>().Property(p => p.Name).IsRequired();
        modelBuilder.Entity<TaskItem>().Property(t => t.Title).IsRequired();
        modelBuilder.Entity<TaskItem>().Property(t => t.Status).IsRequired();
        modelBuilder.Entity<EventType>().Property(e => e.Name).IsRequired();
        modelBuilder.Entity<EventType>().Property(e => e.Description).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.Duration).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.GuestCount).IsRequired();
        modelBuilder.Entity<Booking>().Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");

        modelBuilder.Entity<ChatSession>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatSession>()
            .HasOne(c => c.AssignedAdmin)
            .WithMany()
            .HasForeignKey(c => c.AssignedAdminId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(m => m.Session)
            .WithMany(s => s.Messages)
            .HasForeignKey(m => m.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
