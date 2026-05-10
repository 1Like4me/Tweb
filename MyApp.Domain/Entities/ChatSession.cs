using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MyApp.Domain.Entities;

public class ChatSession
{
    public int Id { get; set; }

    // The user who created the chat
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // The admin assigned to the chat (nullable)
    public int? AssignedAdminId { get; set; }
    public User? AssignedAdmin { get; set; }

    public bool IsClosed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property for messages
    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}
