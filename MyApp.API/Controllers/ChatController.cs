using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Models.Chat;
using System.Security.Claims;

namespace MyApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _db;

    public ChatController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<IEnumerable<ChatSessionDto>>> GetSessions()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("userId")?.Value;
        
        if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

        var query = _db.ChatSessions.AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(s => s.UserId == userId);
        }

        var sessions = await query
            .Include(s => s.User)
            .Include(s => s.AssignedAdmin)
            .Select(s => new ChatSessionDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Username = s.User.Username,
                UserFullName = string.IsNullOrWhiteSpace(s.User.FirstName) ? s.User.Username : (s.User.FirstName + " " + s.User.LastName).Trim(),
                AssignedAdminId = s.AssignedAdminId,
                AssignedAdminName = s.AssignedAdmin != null ? (string.IsNullOrWhiteSpace(s.AssignedAdmin.FirstName) ? s.AssignedAdmin.Username : s.AssignedAdmin.FirstName) : null,
                LastSenderId = s.Messages.OrderByDescending(m => m.CreatedAt).Select(m => m.SenderId).FirstOrDefault(),
                LastMessageId = s.Messages.OrderByDescending(m => m.CreatedAt).Select(m => m.Id).FirstOrDefault(),
                IsClosed = s.IsClosed,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("sessions/{sessionId}/messages")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetMessages(int sessionId)
    {
        var messages = await _db.ChatMessages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SessionId = m.SessionId,
                SenderId = m.SenderId,
                SenderName = string.IsNullOrWhiteSpace(m.Sender.FirstName) ? m.Sender.Username : (m.Sender.FirstName + " " + m.Sender.LastName).Trim(),
                Content = m.Content,
                CreatedAt = m.CreatedAt
            }).ToListAsync();

        return Ok(messages);
    }

    [HttpDelete("messages/{messageId}")]
    public async Task<IActionResult> DeleteMessage(int messageId)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            return Forbid("Only admins can delete messages.");

        var message = await _db.ChatMessages.FindAsync(messageId);
        if (message == null) return NotFound();

        _db.ChatMessages.Remove(message);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Message deleted successfully." });
    }
}
