import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ChatWidget } from '../chat/ChatWidget';

export const MainLayout = () => {
  return (
    <div className="neu-app-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
      <ChatWidget />
    </div>
  );
};

