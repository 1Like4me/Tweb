import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { authService, updateLocalUser } from '../services/authService';
import { multiAccountService, AuthSession } from '../services/multiAccountService';
import { LoginCredentials, RegisterData, User } from '../types/models';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canSwitchRoleView: boolean;
  isViewingAsUser: boolean;
  multiSessions: AuthSession[];
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  toggleRoleView: () => void;
  updateUserContext: (user: User) => void;
  switchAccount: (userId: string) => void;
  removeAccount: (userId: string) => void;
  addAccount: () => void;
  clearAll: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);
  const [multiSessions, setMultiSessions] = useState<AuthSession[]>([]);

  const loadSessions = useCallback(() => {
    setMultiSessions(multiAccountService.getSessions());
  }, []);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
      multiAccountService.addCurrentToMulti();
    }
    loadSessions();
  }, [loadSessions]);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    setIsViewingAsUser(false);
    multiAccountService.addCurrentToMulti();
    loadSessions();
  }, [loadSessions]);

  const handleRegister = useCallback(async (data: RegisterData) => {
    const registered = await authService.register(data);
    setUser(registered);
    setIsViewingAsUser(false);
    multiAccountService.addCurrentToMulti();
    loadSessions();
  }, [loadSessions]);

  const handleLogout = useCallback(() => {
    const current = authService.getCurrentUser();
    if (current) {
      multiAccountService.removeSession(current.id);
    }
    authService.logout();
    setUser(null);
    setIsViewingAsUser(false);
    
    // Redirect logic
    const remaining = multiAccountService.getSessions();
    if (remaining.length > 0) {
       window.location.href = '/accounts';
    } else {
       window.location.href = '/';
    }
  }, []);

  const handleRemoveAccount = useCallback((userId: string) => {
    multiAccountService.removeSession(userId);
    loadSessions();
    
    const current = authService.getCurrentUser();
    if (current && String(current.id) === String(userId)) {
       authService.logout();
       setUser(null);
       window.location.href = '/accounts';
    }
  }, [loadSessions]);

  const handleSwitchAccount = useCallback((userId: string) => {
    if (multiAccountService.switchToSession(userId)) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleAddAccount = useCallback(() => {
    multiAccountService.addCurrentToMulti();
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const handleClearAll = useCallback(() => {
    multiAccountService.clearAllSessions();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const handleToggleRoleView = useCallback(() => {
    setIsViewingAsUser((prev) => !prev);
  }, []);

  const handleUpdateUserContext = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    updateLocalUser(updatedUser);
    multiAccountService.addCurrentToMulti();
    loadSessions();
  }, [loadSessions]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin' && !isViewingAsUser,
      canSwitchRoleView: user?.role === 'admin',
      multiSessions,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      isViewingAsUser,
      toggleRoleView: handleToggleRoleView,
      updateUserContext: handleUpdateUserContext,
      switchAccount: handleSwitchAccount,
      removeAccount: handleRemoveAccount,
      addAccount: handleAddAccount,
      clearAll: handleClearAll
    }),
    [handleLogin, handleLogout, handleRegister, handleToggleRoleView, handleUpdateUserContext, isViewingAsUser, user, multiSessions, handleSwitchAccount, handleRemoveAccount, handleAddAccount, handleClearAll]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
