import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { BookingPage } from './pages/bookings/BookingPage';
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { MyBookingsPage } from './pages/bookings/MyBookingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UnauthorizedPage } from './pages/errors/UnauthorizedPage';
import { ForbiddenPage } from './pages/errors/ForbiddenPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import { ServerErrorPage } from './pages/errors/ServerErrorPage';
import { RequireAuth } from './components/layout/RequireAuth';
import { RequireAdmin } from './components/layout/RequireAdmin';
import { SeedInitializer } from './components/layout/SeedInitializer';

function App() {
  return (
    <SeedInitializer>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/booking"
            element={
              <RequireAuth>
                <BookingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <UserDashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <RequireAuth>
                <MyBookingsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />

          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/500" element={<ServerErrorPage />} />

          <Route path="/error" element={<ServerErrorPage />} />

          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </SeedInitializer>
  );
}

export default App;

