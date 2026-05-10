using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using System.Security.Claims;

namespace MyApp.API.Hubs;

public class ChatHub : Hub
{
    private readonly AppDbContext _db;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(AppDbContext db, ILogger<ChatHub> logger)
    {
        _db = db;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier) 
                    ?? Context.User?.FindFirst("userId") 
                    ?? Context.User?.FindFirst("sub");
        return int.TryParse(claim?.Value, out var id) ? id : 0;
    }

    private string GetCurrentRole()
    {
        return Context.User?.FindFirst(ClaimTypes.Role)?.Value 
               ?? Context.User?.FindFirst("role")?.Value 
               ?? "Anonymous";
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentRole();
        
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }

        if (userId > 0)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(int sessionId, string content)
    {
        var userId = GetCurrentUserId();
        if (userId == 0) return;

        var session = await _db.ChatSessions.FirstOrDefaultAsync(s => s.Id == sessionId);
        if (session == null || session.IsClosed) return;

        var role = GetCurrentRole();
        var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);

        if (!isAdmin && session.UserId != userId) return;

        if (isAdmin && session.UserId != userId && session.AssignedAdminId == null)
        {
            session.AssignedAdminId = userId;
        }

        var message = new ChatMessage
        {
            SessionId = sessionId,
            SenderId = userId,
            Content = content,
            CreatedAt = DateTime.UtcNow
        };

        _db.ChatMessages.Add(message);
        session.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var sender = await _db.Users.FindAsync(userId);
        var senderName = sender != null ? (sender.FirstName + " " + sender.LastName).Trim() : "Unknown";
        if (string.IsNullOrWhiteSpace(senderName)) senderName = sender?.Username ?? "Unknown";

        var payload = new { id = message.Id, sessionId, senderId = userId, senderName, content, createdAt = message.CreatedAt };

        await Clients.Group($"User_{session.UserId}").SendAsync("ReceiveMessage", sessionId, payload);
        if (session.AssignedAdminId.HasValue && session.AssignedAdminId != session.UserId)
            await Clients.Group($"User_{session.AssignedAdminId.Value}").SendAsync("ReceiveMessage", sessionId, payload);
        if (!session.AssignedAdminId.HasValue)
             await Clients.Group("Admins").SendAsync("ReceiveMessage", sessionId, payload);
    }

    public async Task DeleteMessage(int messageId)
    {
        var role = GetCurrentRole();
        if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return;

        var msg = await _db.ChatMessages.Include(m => m.Session).FirstOrDefaultAsync(m => m.Id == messageId);
        if (msg == null) return;

        var sid = msg.SessionId;
        var uid = msg.Session.UserId;
        var aid = msg.Session.AssignedAdminId;

        _db.ChatMessages.Remove(msg);
        await _db.SaveChangesAsync();

        await Clients.Group($"User_{uid}").SendAsync("MessageDeleted", sid, messageId);
        if (aid.HasValue && aid != uid) await Clients.Group($"User_{aid.Value}").SendAsync("MessageDeleted", sid, messageId);
        if (!aid.HasValue) await Clients.Group("Admins").SendAsync("MessageDeleted", sid, messageId);
    }

    public async Task<int> CreateSession()
    {
        var userId = GetCurrentUserId();
        if (userId == 0) return 0;

        var existing = await _db.ChatSessions.FirstOrDefaultAsync(s => s.UserId == userId && !s.IsClosed);
        if (existing != null) return existing.Id;

        var session = new ChatSession { UserId = userId, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsClosed = false };
        _db.ChatSessions.Add(session);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(userId);
        var userFullName = user != null ? (user.FirstName + " " + user.LastName).Trim() : user?.Username ?? "User";

        await Clients.Group("Admins").SendAsync("NewChatSession", new { id = session.Id, userId, username = user?.Username, userFullName, createdAt = session.CreatedAt });
        return session.Id;
    }

    public async Task TransferAdmin(int sessionId, int newAdminId)
    {
        var role = GetCurrentRole();
        if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return;

        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Context.User?.FindFirst("userId")?.Value;
        if (!int.TryParse(userIdStr, out var userId)) return;

        var session = await _db.ChatSessions.FirstOrDefaultAsync(s => s.Id == sessionId);
        if (session == null || session.AssignedAdminId != userId) return;

        session.AssignedAdminId = newAdminId;
        session.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        await Clients.Group("Admins").SendAsync("ChatTransferred", sessionId, newAdminId);
    }
}
