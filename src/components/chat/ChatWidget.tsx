import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../common/Modal';

export const ChatWidget = () => {
  const { user, isAdmin } = useAuth();
  const {
    activeSessionId,
    messages,
    sendMessage,
    deleteMessage,
    createSession,
    fetchUserSessions,
    fetchMessages,
    adminQueue,
    adminActiveChats,
    unreadSessions,
    setActiveSessionId,
    markAsRead
  } = useChat();
  
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSessionSelector, setShowSessionSelector] = useState(false);

  // Custom Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Auto-clear unread when viewing chat
  useEffect(() => {
    if (isOpen && activeSessionId) {
       markAsRead(activeSessionId);
    }
  }, [isOpen, activeSessionId, markAsRead, messages.length]);

  useEffect(() => {
    if (user) fetchUserSessions();
  }, [user, fetchUserSessions]);

  useEffect(() => {
    if (activeSessionId) fetchMessages(activeSessionId);
  }, [activeSessionId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, activeSessionId]);

  if (!user) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = await createSession();
      if (!currentSessionId) return;
    }
    
    await sendMessage(currentSessionId, text);
    setText('');
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteMessage(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleSelectSession = (id: number) => {
    setActiveSessionId(id);
    setShowSessionSelector(false);
    markAsRead(id);
  };

  const filteredMessages = messages
    .filter(m => m.sessionId === activeSessionId)
    .filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  // The red bubble badge count
  const notificationCount = unreadSessions.length;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <Modal
        isOpen={deleteConfirmId !== null}
        title="Delete Message"
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        variant="danger"
      >
        Are you sure you want to delete this message? This action cannot be undone.
      </Modal>

      {isOpen ? (
        <div className="bg-gray-800 border-gray-700 border rounded-xl shadow-2xl w-80 flex flex-col h-[32rem] overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-700 p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="font-bold text-sm">
                  {isAdmin ? 'Support Agent' : 'Live Support'}
                </h3>
                {isAdmin && (
                  <span className="text-[8px] bg-brand-500/20 text-brand-400 px-1 border border-brand-500/40 rounded uppercase font-black tracking-tighter">Admin</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <button 
                    onClick={() => setShowSessionSelector(!showSessionSelector)}
                    className={`p-1.5 rounded-lg transition ${showSessionSelector ? 'bg-brand-500 text-white shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    title="Switch Chats"
                  >
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      {isAdmin && unreadSessions.length > 0 && !showSessionSelector && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-1 ring-gray-900 animate-ping"></span>
                      )}
                    </div>
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            {activeSessionId && !showSessionSelector && (
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversation..."
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none placeholder-gray-500"
              />
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-gray-800">
            {isAdmin && showSessionSelector && (
              <div className="absolute inset-0 z-20 bg-gray-900 overflow-y-auto p-3 border-b border-gray-700 animate-in fade-in duration-200">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">My Active Chats</h4>
                {adminActiveChats.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => handleSelectSession(s.id)}
                    className={`w-full flex justify-between items-center p-2.5 mb-1.5 rounded-lg text-left transition-all ${activeSessionId === s.id ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                  >
                    <span className="text-xs truncate font-medium">{s.userFullName || s.username || `Session #${s.id}`}</span>
                    {unreadSessions.includes(s.id) && <div className="w-2 h-2 bg-brand-400 rounded-full"></div>}
                  </button>
                ))}
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-5 mb-3 px-1">Unassigned Queue</h4>
                {adminQueue.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => handleSelectSession(s.id)}
                    className="w-full flex justify-between items-center p-2.5 mb-1.5 rounded-lg text-left bg-yellow-900/10 border border-yellow-600/20 text-yellow-500 hover:bg-yellow-900/20 transition-all"
                  >
                    <span className="text-xs truncate font-medium">New: {s.userFullName || s.username}</span>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </button>
                ))}
                {(adminActiveChats.length === 0 && adminQueue.length === 0) && (
                  <p className="text-xs text-gray-600 italic text-center py-10">No messages available</p>
                )}
              </div>
            )}

            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 chat-scrollbar">
              {!activeSessionId ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 21l4.584-1.528A9.047 9.047 0 0 0 12 20.25Z" /></svg>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {isAdmin ? 'Choose a conversation from the list to start helping.' : 'Send a message to start a private chat with our team.'}
                  </p>
                </div>
              ) : filteredMessages.map(m => (
                <div key={m.id} className={`p-2.5 rounded-2xl max-w-[85%] shadow-sm relative group ${m.senderId === Number(user.id) ? 'bg-brand-600 text-white self-end rounded-br-none' : 'bg-gray-700 text-gray-100 self-start border border-gray-600 rounded-bl-none'}`}>
                  <div className="flex justify-between items-baseline gap-4 mb-0.5">
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{m.senderName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] opacity-40 font-mono">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isAdmin && (
                        <button onClick={() => handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-300 transition-all p-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.108 0 0 0-7.5 0" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-snug break-words">{m.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={isAdmin && !activeSessionId}
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-brand-500 outline-none disabled:opacity-30 placeholder-gray-600"
              placeholder={isAdmin && !activeSessionId ? "Select a chat..." : "Your message..."}
            />
            <button 
              type="submit" 
              disabled={!text.trim() || (isAdmin && !activeSessionId)} 
              className="bg-brand-500 disabled:bg-gray-800 disabled:text-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-600 transition-all active:scale-95 shadow-lg shadow-brand-900/20"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:bg-brand-600 transition-all active:scale-90 relative ring-4 ring-gray-950"
        >
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-gray-900 shadow-lg animate-bounce">
              {notificationCount}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.33.18.525.539.525.915v7.677a.75.75 0 0 1-1.156.635l-3.324-2.216a.75.75 0 0 0-.414-.13H5.25a.75.75 0 0 1-.75-.75V9.426a.75.75 0 0 1 .75-.75h14.25a.75.75 0 0 1 .25.042l.25.043Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v.008H12v-.008Zm3 0v.008H15v-.008Zm-6 0v.008H9v-.008Z" />
          </svg>
        </button>
      )}
    </div>
  );
};
