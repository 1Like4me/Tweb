import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <Header />
      <main className="flex-1">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

