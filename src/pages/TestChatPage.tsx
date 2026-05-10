import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatWidget } from '../components/chat/ChatWidget';
import { AdminChatDashboard } from '../components/chat/AdminChatDashboard';

export const TestChatPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Live Chat Testing Sandbox</h1>
      <p className="text-gray-600 mb-8">
        This is a hidden route to test the real-time chat functionality without exposing it to regular users.
        {user ? ` You are logged in as ${user.role} (${user.username}).` : ' You are not logged in. Please log in first.'}
      </p>

      {isAdmin ? (
        <AdminChatDashboard />
      ) : (
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">User View</h2>
          <p className="text-gray-600">The chat widget should appear in the bottom right corner of the screen.</p>
          <ChatWidget />
        </div>
      )}
    </div>
  );
};
