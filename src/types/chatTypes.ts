export interface ChatSession {
  id: number;
  userId: number;
  username: string;
  userFullName: string;
  assignedAdminId: number | null;
  assignedAdminName: string | null;
  lastSenderId: number;
  lastMessageId: number;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}
