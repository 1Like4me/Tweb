using System;

namespace MyApp.Domain.Models.Chat;

public class ChatSessionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public int? AssignedAdminId { get; set; }
    public string? AssignedAdminName { get; set; }
    public int LastSenderId { get; set; }
    public int LastMessageId { get; set; }
    public bool IsClosed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ChatMessageDto
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
