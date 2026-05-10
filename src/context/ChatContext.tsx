import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from './ToastContext';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { readJson } from '../utils/storage';
import { ChatSession, ChatMessage } from '../types/chatTypes';

interface AuthSession {
  token: string;
  user: any;
}

interface ChatContextType {
  connection: signalR.HubConnection | null;
  activeSessionId: number | null;
  messages: ChatMessage[];
  adminQueue: ChatSession[];
  adminActiveChats: ChatSession[];
  unreadSessions: number[]; 
  sendMessage: (sessionId: number, content: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  createSession: () => Promise<number | null>;
  transferAdmin: (sessionId: number, newAdminId: number) => Promise<void>;
  fetchUserSessions: () => Promise<void>;
  fetchMessages: (sessionId: number) => Promise<void>;
  setActiveSessionId: (id: number | null) => void;
  markAsRead: (sessionId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToastContext();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminQueue, setAdminQueue] = useState<ChatSession[]>([]);
  const [adminActiveChats, setAdminActiveChats] = useState<ChatSession[]>([]);
  const [unreadSessions, setUnreadSessions] = useState<number[]>([]);

  // Ref to track latest state in SignalR callbacks
  const stateRef = useRef({ isAdmin, userId: Number(user?.id), activeSessionId, adminQueue, adminActiveChats });
  useEffect(() => {
    stateRef.current = { isAdmin, userId: Number(user?.id), activeSessionId, adminQueue, adminActiveChats };
  }, [isAdmin, user?.id, activeSessionId, adminQueue, adminActiveChats]);

  const getReadTime = (sid: number) => Number(localStorage.getItem(`chat_read_${user?.id}_${sid}`) || 0);
  const setReadTime = (sid: number) => localStorage.setItem(`chat_read_${user?.id}_${sid}`, Date.now().toString());

  const markAsRead = useCallback((sessionId: number) => {
      setReadTime(sessionId);
      setUnreadSessions(prev => prev.filter(id => id !== sessionId));
  }, [user?.id]);

  const fetchUserSessions = useCallback(async () => {
      const session = readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
      if (!session) return;
      try {
          const res = await fetch("http://localhost:5085/api/chat/sessions", {
              headers: { Authorization: `Bearer ${session.token}` }
          });
          if (!res.ok) return;
          const data = await res.json();
          const userId = Number(user?.id);

          const unread: number[] = [];

          if (isAdmin) {
              const queue = data.filter((s: ChatSession) => s.assignedAdminId === null && !s.isClosed);
              const active = data.filter((s: ChatSession) => s.assignedAdminId === userId && !s.isClosed);
              setAdminQueue(queue);
              setAdminActiveChats(active);
              
              data.forEach((s: ChatSession) => {
                  if (s.isClosed) return;
                  const lastRead = getReadTime(s.id);
                  const updatedAt = new Date(s.updatedAt + "Z").getTime();
                  
                  // ADMIN logic:
                  const isUnassigned = s.assignedAdminId === null;
                  const isAssignedToMe = s.assignedAdminId === userId;
                  
                  if (isUnassigned || isAssignedToMe) {
                      if (s.lastSenderId !== userId && s.lastSenderId !== 0 && updatedAt > lastRead + 500) {
                          unread.push(s.id);
                      }
                  }
              });

              const ownActive = data.find((s: ChatSession) => s.userId === userId && !s.isClosed);
              if (ownActive && stateRef.current.activeSessionId === null) setActiveSessionId(ownActive.id);
          } else {
              // USER/TEST VIEW: Only care about sessions where we are the OWNER
              const active = data.filter((s: ChatSession) => s.userId === userId && !s.isClosed);
              if (active[0] && stateRef.current.activeSessionId === null) setActiveSessionId(active[0].id);
              
              active.forEach((s: any) => {
                  const lastRead = getReadTime(s.id);
                  const updatedAt = new Date(s.updatedAt + "Z").getTime();
                  if (s.lastSenderId !== userId && s.lastSenderId !== 0 && updatedAt > lastRead + 500) {
                      unread.push(s.id);
                  }
              });
          }
          setUnreadSessions(unread);
      } catch (e) { console.error(e); }
  }, [user, isAdmin]);

  const fetchMessages = useCallback(async (sessionId: number) => {
      const session = readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
      if (!session) return;
      try {
          const res = await fetch(`http://localhost:5085/api/chat/sessions/${sessionId}/messages`, {
              headers: { Authorization: `Bearer ${session.token}` }
          });
          const data = await res.json();
          setMessages(data);
      } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (!user) {
      if (connection) { connection.stop(); setConnection(null); }
      return;
    }

    const session = readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
    if (!session?.token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5085/chathub", {
        accessTokenFactory: () => session.token,
        skipNegotiation: false,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (sessionId: number, message: ChatMessage) => {
      const { isAdmin, userId, activeSessionId, adminQueue, adminActiveChats } = stateRef.current;
      
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });

      if (message.senderId !== userId) {
          // Strictly filter notification badge
          let shouldShowBadge = false;
          if (isAdmin) {
              const sessionInfo = [...adminQueue, ...adminActiveChats].find(s => s.id === sessionId);
              const isUnassigned = sessionInfo ? sessionInfo.assignedAdminId === null : true;
              const isAssignedToMe = sessionInfo ? sessionInfo.assignedAdminId === userId : false;
              if (isUnassigned || isAssignedToMe) shouldShowBadge = true;
          } else {
              // User view: only badge if it's our session
              const sessionInfo = [...adminQueue, ...adminActiveChats].find(s => s.id === sessionId);
              if (sessionInfo && sessionInfo.userId === userId) shouldShowBadge = true;
              else if (activeSessionId === sessionId) shouldShowBadge = true;
          }

          if (shouldShowBadge && activeSessionId !== sessionId) {
              setUnreadSessions(prev => Array.from(new Set([...prev, sessionId])));
          }
          if (isAdmin && (userId !== message.senderId)) {
              showToast(`New message from ${message.senderName}`, 'info');
          }
      }
    });

    newConnection.on("MessageDeleted", (sessionId: number, messageId: number) => {
       setMessages(prev => prev.filter(m => m.id !== messageId));
    });

    newConnection.on("SessionCreated", (sessionId: number) => {
      setActiveSessionId(sessionId);
      fetchUserSessions();
    });

    newConnection.on("NewChatSession", (session: any) => {
       setAdminQueue(prev => [...prev, session]);
       if (stateRef.current.isAdmin) {
           showToast(`New chat request from ${session.userFullName || session.username}`, 'info');
           setUnreadSessions(prev => Array.from(new Set([...prev, session.id])));
       }
    });

    newConnection.on("ChatAssigned", () => fetchUserSessions());
    newConnection.on("ChatTransferred", () => {
        fetchUserSessions();
        if (stateRef.current.isAdmin) showToast("A chat has been transferred.", "info");
    });

    setConnection(newConnection);

    const startConnection = async () => {
      try {
        await newConnection.start();
        fetchUserSessions();
      } catch (e) { console.error("SignalR Error:", e); }
    };

    startConnection();
    return () => { newConnection.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const sendMessage = async (sessionId: number, content: string) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      try { await connection.invoke("SendMessage", sessionId, content); } catch (err) { console.error(err); }
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      try { await connection.invoke("DeleteMessage", messageId); } catch (err) { console.error(err); }
    }
  };

  const createSession = async (): Promise<number | null> => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      try {
        const id = await connection.invoke<number>("CreateSession");
        setActiveSessionId(id);
        return id;
      } catch (err) { console.error(err); }
    }
    return null;
  };

  const transferAdmin = async (sessionId: number, newAdminId: number) => {
    if (connection) { await connection.invoke("TransferAdmin", sessionId, newAdminId); }
  };

  return (
    <ChatContext.Provider value={{
      connection, activeSessionId, messages, adminQueue, adminActiveChats, unreadSessions,
      sendMessage, deleteMessage, createSession, transferAdmin, fetchUserSessions, fetchMessages, setActiveSessionId, markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};
