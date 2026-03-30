import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { useI18n } from '../../i18n/i18n';

export const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { lang, setLang, t, supportedLanguages } = useI18n();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkBase =
    'inline-flex items-center px-3 py-2 text-sm font-medium transition hover:text-brand-400';

  const navLinkActive = 'text-brand-400';
  const navLinkInactive = 'text-slate-200';

  return (
    <header className="neu-header-shell">
      <div className="page-container flex items-center justify-between py-3">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-slate-950">
              <span className="text-lg font-bold">E</span>
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-semibold text-slate-50">
                {t('Elegance Venue')}
              </span>
              <span className="block text-[11px] text-slate-400">
                {t('Event Booking Management')}
              </span>
            </div>
          </Link>
          <nav className="hidden items-center space-x-2 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              {t('Home')}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              {t('Venue')}
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              {t('Services')}
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              {t('Menu')}
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/booking"
                  className={({ isActive }) =>
                    `${navLinkBase} ${
                      isActive ? navLinkActive : navLinkInactive
                    }`
                  }
                >
                  {t('Book Event')}
                </NavLink>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    `${navLinkBase} ${
                      isActive ? navLinkActive : navLinkInactive
                    }`
                  }
                >
                  {t('My Bookings')}
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${navLinkBase} ${
                      isActive ? navLinkActive : navLinkInactive
                    }`
                  }
                >
                  {t('Dashboard')}
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${navLinkBase} ${
                        isActive ? navLinkActive : navLinkInactive
                      }`
                    }
                  >
                    {t('Admin')}
                  </NavLink>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="hidden items-center space-x-3 md:flex">
          <label className="sr-only" htmlFor="language-select">
            {t('Language')}
          </label>
          <select
            id="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="h-9 rounded-xl border border-slate-700 bg-slate-900/50 px-3 text-sm text-slate-200 hover:bg-slate-800"
          >
            {supportedLanguages.map((l) => (
              <option key={l.id} value={l.id}>
                {t(l.label)}
              </option>
            ))}
          </select>

          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                {t('Log in')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                {t('Register')}
              </Button>
            </>
          ) : (
            <>
              <div className="text-right text-xs leading-tight">
                <p className="font-semibold text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isAdmin ? t('Administrator') : t('Client')}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('Logout')}
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">{t('Open main menu')}</span>
          <span className="h-4 w-4">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-900/80 bg-slate-950/95 md:hidden">
          <div className="page-container space-y-2 pb-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="sr-only" htmlFor="language-select-mobile">
                {t('Language')}
              </label>
              <select
                id="language-select-mobile"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="h-9 rounded-xl border border-slate-700 bg-slate-900/50 px-3 text-sm text-slate-200 hover:bg-slate-800"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {t(l.label)}
                  </option>
                ))}
              </select>
            </div>
            <nav className="flex flex-col space-y-1">
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? navLinkActive : navLinkInactive
                  }`
                }
              >
                {t('Home')}
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? navLinkActive : navLinkInactive
                  }`
                }
              >
                {t('Venue')}
              </NavLink>
              <NavLink
                to="/services"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? navLinkActive : navLinkInactive
                  }`
                }
              >
                {t('Services')}
              </NavLink>
              <NavLink
                to="/menu"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
                }
              >
                {t('Menu')}
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/booking"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${navLinkBase} ${
                        isActive ? navLinkActive : navLinkInactive
                      }`
                    }
                  >
                    {t('Book Event')}
                  </NavLink>
                  <NavLink
                    to="/my-bookings"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${navLinkBase} ${
                        isActive ? navLinkActive : navLinkInactive
                      }`
                    }
                  >
                    {t('My Bookings')}
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${navLinkBase} ${
                        isActive ? navLinkActive : navLinkInactive
                      }`
                    }
                  >
                    {t('Dashboard')}
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `${navLinkBase} ${
                          isActive ? navLinkActive : navLinkInactive
                        }`
                      }
                    >
                      {t('Admin')}
                    </NavLink>
                  )}
                </>
              )}
            </nav>
            <div className="flex items-center justify-between pt-2">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      navigate('/login');
                    }}
                  >
                    {t('Log in')}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setOpen(false);
                      navigate('/register');
                    }}
                  >
                    {t('Register')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-xs text-slate-300">
                    {t('Signed in as')}{' '}
                    <span className="font-semibold">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    {t('Logout')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

