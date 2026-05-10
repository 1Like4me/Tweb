import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { User } from '../../types/models';

export const AdminChatDashboard = () => {
  const { user, isAdmin } = useAuth();
  const {
    adminQueue,
    adminActiveChats,
    messages,
    sendMessage,
    deleteMessage,
    activeSessionId,
    setActiveSessionId,
    fetchUserSessions,
    fetchMessages,
    transferAdmin
  } = useChat();

  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [admins, setAdmins] = useState<User[]>([]);
  const [showTransferMenu, setShowTransferMenu] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUserSessions();
      userService.getUsers().then(users => {
        setAdmins(users.filter(u => u.role === 'admin' && u.id !== user.id));
      });
    }
  }, [user, isAdmin, fetchUserSessions]);

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    }
  }, [activeSessionId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSessionId]);

  if (!user || !isAdmin) return <div className="p-4">Access Denied</div>;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeSessionId) return;
    await sendMessage(activeSessionId, text);
    setText('');
    setTimeout(() => fetchUserSessions(), 500);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this message?')) {
        await deleteMessage(id);
    }
  };

  const handleTransfer = async (adminId: string) => {
    if (activeSessionId) {
      await transferAdmin(activeSessionId, Number(adminId));
      setShowTransferMenu(false);
      setActiveSessionId(null);
    }
  };

  const handleSelectSession = (id: number) => {
    setActiveSessionId(id);
    setSearchQuery('');
  };

  const filteredMessages = messages
    .filter(m => m.sessionId === activeSessionId)
    .filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedSession = [...adminQueue, ...adminActiveChats].find(s => s.id === activeSessionId);

  return (
    <div className="flex h-[80vh] border border-gray-700 rounded-lg bg-gray-800 shadow-2xl overflow-hidden mt-4 text-gray-200">
      {/* Sidebar - Queues */}
      <div className="w-1/3 border-r border-gray-700 bg-gray-900 flex flex-col">
        <div className="p-4 font-bold border-b border-gray-700 bg-gray-900 text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500"></span>
          Live Support Dashboard
        </div>
        
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {/* Active Chats */}
          <div className="p-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Active Chats</h4>
            {adminActiveChats.length === 0 ? <p className="text-xs text-gray-500 pl-1 italic">No active chats</p> : null}
            {adminActiveChats.map(s => (
              <div 
                key={s.id} 
                onClick={() => handleSelectSession(s.id)}
                className={`p-3 text-sm cursor-pointer rounded-md mb-2 transition-all ${activeSessionId === s.id ? 'bg-gray-800 border-l-4 border-brand-500 text-white shadow-sm' : 'hover:bg-gray-800 border-l-4 border-transparent text-gray-400 hover:text-gray-200'}`}
              >
                Chat with {s.userFullName || s.username || `User #${s.userId}`}
              </div>
            ))}
          </div>

          {/* Unassigned Queue */}
          <div className="p-3 border-t border-gray-800">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Unassigned Queue</h4>
            {adminQueue.length === 0 ? <p className="text-xs text-gray-500 pl-1 italic">No users waiting</p> : null}
            {adminQueue.map(s => (
              <div 
                key={s.id} 
                onClick={() => handleSelectSession(s.id)}
                className={`p-3 text-sm cursor-pointer rounded-md mb-2 bg-yellow-900/20 border border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/40 transition-all ${activeSessionId === s.id ? 'ring-1 ring-yellow-500 shadow-sm' : ''}`}
              >
                New from {s.userFullName || s.username || `User #${s.userId}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-800">
        {activeSessionId ? (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-900 text-white font-medium flex items-center justify-between">
              <div className="flex flex-col">
                <span>{selectedSession?.userFullName || selectedSession?.username || `Session #${activeSessionId}`}</span>
                <span className="text-[10px] text-gray-500">ID: #{selectedSession?.userId}</span>
              </div>
              <div className="flex items-center gap-3">
                {selectedSession?.assignedAdminId === Number(user.id) && (
                   <div className="relative">
                      <button 
                        onClick={() => setShowTransferMenu(!showTransferMenu)}
                        className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-gray-200 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                        Transfer
                      </button>
                      {showTransferMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-30 p-1 overflow-hidden">
                           <p className="text-[10px] text-gray-500 uppercase p-2 font-bold tracking-widest border-b border-gray-800">Assign to Agent</p>
                           <div className="max-h-40 overflow-y-auto chat-scrollbar">
                              {admins.map(a => (
                                <button
                                  key={a.id}
                                  onClick={() => handleTransfer(a.id)}
                                  className="w-full text-left p-2 text-xs hover:bg-brand-600 hover:text-white rounded transition-colors"
                                >
                                  {a.firstName} {a.lastName}
                                </button>
                              ))}
                              {admins.length === 0 && <p className="p-2 text-xs text-gray-600 italic">No other admins online</p>}
                           </div>
                        </div>
                      )}
                   </div>
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-xs focus:outline-none focus:border-brand-500"
                />
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">Active</span>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-800 flex flex-col gap-3 chat-scrollbar">
              {filteredMessages.map(m => (
                <div key={m.id} className={`p-3 rounded-lg max-w-[70%] shadow-sm relative group ${m.senderId === Number(user.id) ? 'bg-brand-600 text-white self-end rounded-br-none' : 'bg-gray-700 text-gray-200 self-start border border-gray-600 rounded-bl-none'}`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-xs font-medium opacity-70">{m.senderName}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] opacity-50">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       {isAdmin && (
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.108 0 0 0-7.5 0" /></svg>
                        </button>
                       )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="Type a response..."
              />
              <button 
                type="submit" 
                disabled={!text.trim()} 
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic bg-gray-800">
            Select a chat from the sidebar to begin
          </div>
        )}
      </div>
    </div>
  );
};
