using System;

namespace MyApp.Domain.Entities;

public class ChatMessage
{
    public int Id { get; set; }

    public int SessionId { get; set; }
    public ChatSession Session { get; set; } = null!;

    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
