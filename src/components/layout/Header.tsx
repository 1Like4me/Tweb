import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { useI18n } from '../../i18n/i18n';
import { Modal } from '../common/Modal';

export const Header = () => {
  const {
    isAuthenticated,
    isAdmin,
    canSwitchRoleView,
    isViewingAsUser,
    multiSessions,
    user,
    logout,
    toggleRoleView,
    switchAccount,
    addAccount,
    clearAll
  } = useAuth();
  const { lang, setLang, t, supportedLanguages } = useI18n();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Modal State
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    const sessions = multiAccountService.getSessions();
    if (sessions.length > 0) {
      navigate('/accounts');
    } else {
      navigate('/');
    }
  };

  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  const navLinkBase =
    'inline-flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium transition hover:text-brand-400';

  const navLinkActive = 'text-brand-400';
  const navLinkInactive = 'text-slate-200';

  return (
    <header className="neu-header-shell z-40 relative">
      <Modal
        isOpen={showClearConfirm}
        title="Clear All Sessions"
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        confirmLabel="Logout All"
        variant="danger"
      >
        This will log you out of all saved accounts on this device. Do you want to continue?
      </Modal>

      <div className="flex w-full items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-slate-950">
            <span className="text-lg font-bold">E</span>
          </div>
          <div className="flex items-center whitespace-nowrap text-sm leading-none">
            <span className="font-semibold text-slate-50">{t('Elegance Venue')}</span>
          </div>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center space-x-1 lg:flex">
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

        <div className="ml-auto hidden shrink-0 items-center space-x-2 pl-8 lg:flex">
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
              {canSwitchRoleView && (
                <Button variant="ghost" size="sm" onClick={toggleRoleView}>
                  {isViewingAsUser ? t('Switch to admin view') : t('Switch to user view')}
                </Button>
              )}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center space-x-2 rounded-xl p-1 pr-2 hover:bg-slate-800 transition-colors"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-200">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden text-right text-xs leading-tight xl:block">
                    <p className="font-semibold text-slate-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isAdmin ? t('Administrator') : t('Client')}
                    </p>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-700 bg-slate-900 shadow-lg outline-none z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1">
                        <label className="block text-xs text-slate-400 mb-1">{t('Language')}</label>
                        <select
                          value={lang}
                          onChange={(e) => {
                            setLang(e.target.value as any);
                            setUserMenuOpen(false);
                          }}
                          className="w-full h-8 rounded border border-slate-700 bg-slate-800 px-2 text-sm text-slate-200 hover:bg-slate-700 outline-none"
                        >
                          {supportedLanguages.map((l) => (
                            <option key={l.id} value={l.id}>
                              {t(l.label)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="h-px bg-slate-800 my-1"></div>
                      
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Switch Account
                      </div>
                      
                      {multiSessions.filter(s => s.user.id !== user?.id).map(session => (
                        <div key={session.user.id} className="group relative flex items-center pr-2">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              switchAccount(session.user.id);
                            }}
                            className="flex-1 flex items-center gap-2 text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-l transition-colors"
                          >
                            {session.user.profilePictureUrl ? (
                              <img src={session.user.profilePictureUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-200">
                                 {session.user.firstName?.charAt(0) || 'U'}
                              </div>
                            )}
                            <span className="truncate">{session.user.firstName} {session.user.lastName}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Remove ${session.user.firstName}'s session?`)) {
                                removeAccount(session.user.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove account"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          addAccount();
                        }}
                        className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-xs text-brand-400 hover:bg-brand-400/10 rounded transition-colors group"
                      >
                        <div className="h-5 w-5 rounded-full border border-brand-500/50 flex items-center justify-center text-[12px] font-bold">
                           +
                        </div>
                        <span>Add Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setShowClearConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-xs text-red-400 hover:bg-red-400/10 rounded transition-colors group mt-1 border-t border-slate-800 pt-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 01 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.108 0 00-7.5 0" />
                        </svg>
                        <span>Clear All Sessions</span>
                      </button>

                      <div className="h-px bg-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left px-2 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      >
                        {t('Edit Profile')}
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-2 py-2 text-sm text-red-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        {t('Logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800 lg:hidden"
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
        <div className="border-t border-slate-900/80 bg-slate-950/95 lg:hidden">
          <div className="space-y-2 px-3 pb-4 pt-2 sm:px-4">
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
                  {canSwitchRoleView && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toggleRoleView();
                      }}
                    >
                      {isViewingAsUser
                        ? t('Switch to admin view')
                        : t('Switch to user view')}
                    </Button>
                  )}
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

