import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useI18n } from '../../i18n/i18n';
import { useEffect } from 'react';

export const AccountPickerPage = () => {
  const navigate = useNavigate();
  const { multiSessions, switchAccount, addAccount, clearAll, isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Debug log
  console.log("AccountPickerPage: multiSessions", multiSessions);

  useEffect(() => {
    // If user is already authenticated and has no other sessions, go to dashboard
    if (isAuthenticated && multiSessions.length <= 1) {
      navigate('/dashboard');
    }
    // If no sessions at all, go to login
    if (!isAuthenticated && multiSessions.length === 0) {
      navigate('/login');
    }
  }, [isAuthenticated, multiSessions, navigate]);

  const handleSelect = (userId: string) => {
    switchAccount(userId);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12 px-4 bg-slate-950">
      <div className="w-full max-w-md">
        <Card title={t('Choose an account')} subtitle={t('Select an account to continue or add a new one')}>
          <div className="space-y-3 mt-4">
            {multiSessions.length === 0 ? (
               <p className="text-center text-slate-500 py-4 italic">{t('No saved accounts found')}</p>
            ) : (
              multiSessions.map((session) => (
                <button
                  key={session.user.id}
                  onClick={() => handleSelect(session.user.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-brand-500/50 transition-all group text-left"
                >
                  {session.user.profilePictureUrl ? (
                    <img src={session.user.profilePictureUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-200">
                      {session.user.firstName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100 truncate">
                      {session.user.firstName} {session.user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate uppercase tracking-tighter">
                      {session.user.role === 'admin' ? t('Administrator') : t('Client')}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </button>
              ))
            )}

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={addAccount}
              >
                <span className="mr-2">+</span> {t('Use another account')}
              </Button>
              
              {multiSessions.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(t('Are you sure you want to sign out of all accounts?'))) {
                      clearAll();
                    }
                  }}
                  className="w-full py-2 text-sm text-slate-500 hover:text-red-400 transition-colors"
                >
                  {t('Sign out of all accounts')}
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
